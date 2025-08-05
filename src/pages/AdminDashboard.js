// AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useToast } from '../contexts/ToastContext';
import { 
  Link, 
  useLocation,
  useNavigate, 
 
  Outlet ,
} from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './AdminDashboard.css';
import { appwriteAuth } from '../Auth/Appwriteauth';
import { convertAndValidateDate } from '../helper/helper';
import { addMember, deleteMember } from '../helper/appwritehelper';

const AdminDashboard = ({user,setuser}) => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlelogout = async(e)=>{
    e.preventDefault();
    const res = await appwriteAuth.logout();
    if(res.success){
      setuser(null); 
      navigate("/")
    }
  }

  const currentPath = location.pathname.split('/')[2] || '';

  return (
    <div className="admin-dashboard">
      <button 
        id="menuBtn" 
        className="mobile-menu-button"
        onClick={toggleSidebar}
      >
        <i className="fas fa-bars"></i>
      </button>

      <div 
        id="sidebar" 
        className={`sidebar ${sidebarOpen ? 'open' : ''}`}
      >
        <div className="sidebar-header">
          <h1>Gym Admin</h1>
        </div>

        <nav className="sidebar-nav">
          <Link 
            to="add-member" 
            className={`nav-button ${currentPath === 'add-member' ? 'active' : ''}`}
          >
            <i className="fas fa-user-plus"></i> Add Member
          </Link>

          <Link 
            to="manage-members" 
            className={`nav-button ${currentPath === 'manage-members' ? 'active' : ''}`}
          >
            <i className="fas fa-users"></i> Manage Members
          </Link>

          <Link 
            to="create-bill" 
            className={`nav-button ${currentPath === 'create-bill' ? 'active' : ''}`}
          >
            <i className="fas fa-file-invoice-dollar"></i> Create Bill
          </Link>

          <Link 
            to="assign-fee" 
            className={`nav-button ${currentPath === 'assign-fee' ? 'active' : ''}`}
          >
            <i className="fas fa-tag"></i> Assign Fee Package
          </Link>

          <Link 
            to="send-notification" 
            className={`nav-button ${currentPath === 'send-notification' ? 'active' : ''}`}
          >
            <i className="fas fa-bell"></i> Send Notification
          </Link>

          <Link 
            to="supplement-store" 
            className={`nav-button ${currentPath === 'supplement-store' ? 'active' : ''}`}
          >
            <i className="fas fa-capsules"></i> Supplement Store
          </Link>

          <Link 
            to="diet-details" 
            className={`nav-button ${currentPath === 'diet-details' ? 'active' : ''}`}
          >
            <i className="fas fa-utensils"></i> Diet Details
          </Link>

          <Link 
            to="export-report" 
            className={`nav-button ${currentPath === 'export-report' ? 'active' : ''}`}
          >
            <i className="fas fa-file-export"></i> Export Report
          </Link>

          <button 
            onClick={handlelogout} 
            className="nav-button logout-button"
          >
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </nav>
      </div>

      <div className="main-content">
        <div className="content-container">
          <div id="content" className="content-area">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};


export const DashboardSection = () => (
  <>
    <h1>Admin Dashboard</h1>
    <p>Welcome to the Gym Management System. Please select an option from the sidebar.</p>
    
    <div className="dashboard-stats">
      <div className="stat-card">
        <i className="fas fa-users"></i>
        <h3>Total Members</h3>
        <p>248</p>
      </div>
      
      <div className="stat-card">
        <i className="fas fa-dollar-sign"></i>
        <h3>Monthly Revenue</h3>
        <p>$12,840</p>
      </div>
      
      <div className="stat-card">
        <i className="fas fa-dumbbell"></i>
        <h3>Active Now</h3>
        <p>32</p>
      </div>
      
      <div className="stat-card">
        <i className="fas fa-calendar"></i>
        <h3>Upcoming Classes</h3>
        <p>7</p>
      </div>
    </div>
  </>
);

export const AddMemberSection = ({user,setmembers,members}) =>{
  
  const [isadding,setisadding] = useState(false);
  const [error,seterror] = useState("");
  const [member,setmember] = useState({name:"",email:"",phone:"",membershiptype:"Basic ($49/month)",startdate:""})
  const resetmember = (setmember)=>{
      setmember({
  name: "",
  email: "",
  phone: "",
  membershiptype: "Basic ($49/month)",
  startdate: ""
});

  }
  const handlecreatemember = async(e)=>{
    e.preventDefault();
    const isvalidemail = members?.some(memb => memb.email === member.email);
    if(isvalidemail){
      seterror("this email is used by other user please enter another email");
      return
    }
    
    const res = await convertAndValidateDate(member.startdate)
    if(!res.valid){
      console.log(res.message)
      seterror(res.message)
      return
    }
    setisadding(true);

    const response = await addMember(user?.$id,member)
    if(response.success){
      seterror("");
      resetmember(setmember);
      setmembers((pre) => [response.data, ...pre]);
    }

    setisadding(false)
  }

  return (
    <div className="section-content">
    <h2>Add New Member</h2>
    <div className="form-container">
      <form onSubmit={handlecreatemember}>

      <div className="form-group">
        <label>Full Name</label>
        <input
        required
        value={member.name}
        onChange={(e)=>setmember((pre)=>({...pre,name:e.target.value}))}
         type="text" placeholder="Enter full name" />
      </div>
      
      <div className="form-group">
        <label>Email</label>
        <input required value={member.email}
        onChange={(e)=>setmember((pre)=>({...pre,email:e.target.value}))} 
         type="email" placeholder="Enter email" />
      </div>
      
      <div className="form-group">
        <label>Phone Number</label>
        <input required
        onChange={(e)=>setmember((pre)=>({...pre,phone :e.target.value}))}
         type="tel" value={member.phone} placeholder="Enter phone number" />
      </div>
      
      <div className="form-group">
        <label>Membership Type</label>
        <select
        required
        value={member.membershiptype}
        onChange={(e)=>setmember((pre)=>({...pre,membershiptype:e.target.value}))}
        >
          <option value="Basic ($49/month)" >Basic ($49/month)</option>
          <option value="Premium ($79/month)">Premium ($79/month)</option>
          <option value="VIP ($129/month)">VIP ($129/month)</option>
        </select>
      </div>
      
      <div className="form-group">
        <label>Start Date</label>
        <input
        required
        value={member.startdate}
        onChange={(e)=>setmember((pre)=>({...pre,startdate:e.target.value}))} 
        placeholder='use dd/mm/yy' type="text" />
      </div>
      <div>
        {error && <p style={{color:"red"}}>{error}</p> }
        
      </div>
      
      <button type='submit' style={{background:isadding&& "silver"}} className="submit-button">{isadding?"Adding ...":"Add Member"}</button>
        </form>
    </div>
  </div>
);
} 

export const ManageMembersSection = ({members,setmembers}) => {

  const handledelete = async(m)=>{
    const response = await deleteMember(m.userId,m?.$id);
  if (response.success) {
  setmembers((pre) => pre.filter(user => user.$id !== m.$id));
}
    console.log(response);

  }

  return (
    <div className="section-content">
    <h2>Manage Members</h2>
    <div className="search-bar">
      <input type="text" placeholder="Search members..." />
      <button><i className="fas fa-search"></i></button>
    </div>
    
    <div className="members-table">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Membership</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {members?.map((memb,index)=>(
            <tr key={index}>
            <td>{index}</td>
            <td>{memb.name}</td>
            <td>{memb.membershiptype}</td>
            <td><span className="status active">Active</span></td>
            <td>
              <button className="action-button"><i className="fas fa-edit"></i></button>
              <button onClick={(e)=>{
                e.preventDefault();
                handledelete(memb)
              }}  className="action-button"><i className="fas fa-trash"></i></button>
            </td>
          </tr>
          ))}
        </tbody>
      </table>
    </div>
    
    <div className="pagination">
      <button><i className="fas fa-chevron-left"></i></button>
      <button className="active">1</button>
      <button>2</button>
      <button>3</button>
      <button><i className="fas fa-chevron-right"></i></button>
    </div>
  </div>
);
}

 export const CreateBillSection = () => (
  <div className="section-content">
    <h2>Create Bill</h2>
    <div className="form-container">
      <div className="form-group">
        <label>Member</label>
        <select>
          <option>John Smith (#1001)</option>
          <option>Sarah Johnson (#1002)</option>
          <option>Michael Brown (#1003)</option>
          <option>Emily Davis (#1004)</option>
        </select>
      </div>
      
      <div className="form-group">
        <label>Billing Period</label>
        <div className="date-range">
          <input type="date" />
          <span>to</span>
          <input type="date" />
        </div>
      </div>
      
      <div className="form-group">
        <label>Amount</label>
        <input type="number" placeholder="Enter amount" />
      </div>
      
      <div className="form-group">
        <label>Description</label>
        <textarea placeholder="Enter description"></textarea>
      </div>
      
      <button className="submit-button">Generate Bill</button>
    </div>
  </div>
);

 export const AssignFeeSection = () => (
  <div className="section-content">
    <h2>Assign Fee Package</h2>
    <div className="form-container">
      <div className="form-group">
        <label>Select Member</label>
        <select>
          <option>John Smith (#1001)</option>
          <option>Sarah Johnson (#1002)</option>
          <option>Michael Brown (#1003)</option>
          <option>Emily Davis (#1004)</option>
        </select>
      </div>
      
      <div className="form-group">
        <label>Fee Package</label>
        <select>
          <option>Basic Package - $49/month</option>
          <option>Premium Package - $79/month</option>
          <option>VIP Package - $129/month</option>
          <option>Family Package - $199/month</option>
        </select>
      </div>
      
      <div className="form-group">
        <label>Start Date</label>
        <input type="date" />
      </div>
      
      <div className="form-group">
        <label>Duration (months)</label>
        <input type="number" min="1" max="24" defaultValue="1" />
      </div>
      
      <button className="submit-button">Assign Package</button>
    </div>
  </div>
);

 export const SendNotificationSection = () => (
  <div className="section-content">
    <h2>Send Notification</h2>
    <div className="form-container">
      <div className="form-group">
        <label>Recipients</label>
        <select>
          <option>All Members</option>
          <option>Active Members Only</option>
          <option>Specific Group</option>
          <option>Individual Members</option>
        </select>
      </div>
      
      <div className="form-group">
        <label>Notification Type</label>
        <select>
          <option>General Announcement</option>
          <option>Payment Reminder</option>
          <option>Class Schedule</option>
          <option>Promotional Offer</option>
        </select>
      </div>
      
      <div className="form-group">
        <label>Subject</label>
        <input type="text" placeholder="Enter subject" />
      </div>
      
      <div className="form-group">
        <label>Message</label>
        <textarea placeholder="Enter your message here..." rows="5"></textarea>
      </div>
      
      <div className="form-group">
        <label>Delivery Method</label>
        <div className="checkbox-group">
          <input type="checkbox" id="email" checked />
          <label htmlFor="email">Email</label>
        </div>
        <div className="checkbox-group">
          <input type="checkbox" id="sms" />
          <label htmlFor="sms">SMS</label>
        </div>
        <div className="checkbox-group">
          <input type="checkbox" id="app" checked />
          <label htmlFor="app">Mobile App Notification</label>
        </div>
      </div>
      
      <button className="submit-button">Send Notification</button>
    </div>
  </div>
);

 export const SupplementStoreSection = () => (
  <div className="section-content">
    <h2>Supplement Store</h2>
    <div className="products-grid">
      <div className="product-card">
        <div className="product-image">
          <div className="placeholder-image">Whey Protein</div>
        </div>
        <h3>Premium Whey Protein</h3>
        <p className="price">$49.99</p>
        <div className="stock-status in-stock">In Stock</div>
        <button className="add-to-cart">Add to Cart</button>
      </div>
      
      <div className="product-card">
        <div className="product-image">
          <div className="placeholder-image">Creatine</div>
        </div>
        <h3>Creatine Monohydrate</h3>
        <p className="price">$24.99</p>
        <div className="stock-status in-stock">In Stock</div>
        <button className="add-to-cart">Add to Cart</button>
      </div>
      
      <div className="product-card">
        <div className="product-image">
          <div className="placeholder-image">BCAA</div>
        </div>
        <h3>BCAA Powder</h3>
        <p className="price">$34.99</p>
        <div className="stock-status low-stock">Low Stock</div>
        <button className="add-to-cart">Add to Cart</button>
      </div>
      
      <div className="product-card">
        <div className="product-image">
          <div className="placeholder-image">Pre-Workout</div>
        </div>
        <h3>Energy Pre-Workout</h3>
        <p className="price">$39.99</p>
        <div className="stock-status in-stock">In Stock</div>
        <button className="add-to-cart">Add to Cart</button>
      </div>
    </div>
    
    <div className="cart-summary">
      <h3>Cart Summary</h3>
      <div className="cart-items">
        <div className="cart-item">
          <span>Premium Whey Protein</span>
          <span>$49.99</span>
        </div>
        <div className="cart-item">
          <span>Creatine Monohydrate</span>
          <span>$24.99</span>
        </div>
      </div>
      <div className="cart-total">
        <strong>Total:</strong>
        <strong>$74.98</strong>
      </div>
      <button className="checkout-button">Proceed to Checkout</button>
    </div>
  </div>
);

 export const DietDetailsSection = () => (
  <div className="section-content">
    <h2>Diet Plans Management</h2>
    
    <div className="tabs">
      <button className="tab active">Diet Plans</button>
      <button className="tab">Meal Categories</button>
      <button className="tab">Nutrition Tracking</button>
    </div>
    
    <div className="diet-plans">
      <div className="diet-plan-card">
        <h3>Weight Loss Plan</h3>
        <p>Designed for members looking to lose weight effectively</p>
        <div className="stats">
          <span><i className="fas fa-users"></i> 42 members</span>
          <span><i className="fas fa-star"></i> 4.8 rating</span>
        </div>
        <button className="view-details">View Details</button>
      </div>
      
      <div className="diet-plan-card">
        <h3>Muscle Gain Plan</h3>
        <p>High protein diet for muscle building and strength</p>
        <div className="stats">
          <span><i className="fas fa-users"></i> 35 members</span>
          <span><i className="fas fa-star"></i> 4.7 rating</span>
        </div>
        <button className="view-details">View Details</button>
      </div>
      
      <div className="diet-plan-card">
        <h3>Endurance Plan</h3>
        <p>Optimized for athletes and endurance training</p>
        <div className="stats">
          <span><i className="fas fa-users"></i> 28 members</span>
          <span><i className="fas fa-star"></i> 4.9 rating</span>
        </div>
        <button className="view-details">View Details</button>
      </div>
    </div>
    
    <button className="add-plan-button">
      <i className="fas fa-plus"></i> Add New Diet Plan
    </button>
  </div>
);

 export const ExportReportSection = () => (
  <div className="section-content">
    <h2>Export Reports</h2>
    
    <div className="report-types">
      <div className="report-card">
        <i className="fas fa-user-check"></i>
        <h3>Membership Report</h3>
        <p>Export list of all members with details</p>
        <button className="export-button">Export CSV</button>
      </div>
      
      <div className="report-card">
        <i className="fas fa-money-bill-wave"></i>
        <h3>Financial Report</h3>
        <p>Revenue, payments and outstanding balances</p>
        <button className="export-button">Export Excel</button>
      </div>
      
      <div className="report-card">
        <i className="fas fa-dumbbell"></i>
        <h3>Attendance Report</h3>
        <p>Member check-ins and class attendance</p>
        <button className="export-button">Export PDF</button>
      </div>
    </div>
    
    <div className="custom-report">
      <h3>Custom Report</h3>
      <div className="form-container">
        <div className="form-group">
          <label>Report Type</label>
          <select>
            <option>Select report type</option>
            <option>Membership Summary</option>
            <option>Financial Summary</option>
            <option>Attendance Summary</option>
            <option>Inventory Report</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Date Range</label>
          <div className="date-range">
            <input type="date" />
            <span>to</span>
            <input type="date" />
          </div>
        </div>
        
        <div className="form-group">
          <label>Format</label>
          <div className="checkbox-group">
            <input type="radio" id="csv" name="format" checked />
            <label htmlFor="csv">CSV</label>
          </div>
          <div className="checkbox-group">
            <input type="radio" id="excel" name="format" />
            <label htmlFor="excel">Excel</label>
          </div>
          <div className="checkbox-group">
            <input type="radio" id="pdf" name="format" />
            <label htmlFor="pdf">PDF</label>
          </div>
        </div>
        
        <button className="generate-button">Generate Report</button>
      </div>
    </div>
  </div>
);

export default AdminDashboard;