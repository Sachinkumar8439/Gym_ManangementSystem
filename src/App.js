import './App.css';
import Loginpage from './pages/AuthPage';
import {
  AddMemberSection,
  ManageMembersSection,
  CreateBillSection,
  AssignFeeSection,
  SendNotificationSection,
  SupplementStoreSection,
  DietDetailsSection,
  ExportReportSection
} from './pages/AdminDashboard';
import AdminDashboard from './pages/AdminDashboard';
import { Routes, Route, Navigate } from 'react-router-dom';
import Verify from './pages/verify';
import { useState } from 'react';
import { appwriteAuth } from './Auth/Appwriteauth';
import { getMembers } from './helper/appwritehelper';


 const response = await appwriteAuth.getUser();
 const memberdata = await getMembers(response.user?.$id);


export default function App() {
  const [members,setmembers] = useState(memberdata?.members || []);
  const [user,setuser] = useState(response?.user || null);

  return (
    <>
      <Routes>
        <Route path="/" element={!user ? <Loginpage  user={user} setuser={setuser} />: <Navigate to="/admin"/>} />
        <Route path="/verify" element={<Verify/>} />
        <Route path="/admin" element={user? <AdminDashboard user={user} setuser={setuser} />: <Navigate to="/"/>}>
          <Route index element={<Navigate to="manage-members" replace />} />
          <Route path="add-member" element={<AddMemberSection user={user} setmembers={setmembers} members={members} />} />
          <Route path="manage-members" element={<ManageMembersSection members={members} setmembers={setmembers} />} />
          <Route path="create-bill" element={<CreateBillSection />} />
          <Route path="assign-fee" element={<AssignFeeSection />} />
          <Route path="send-notification" element={<SendNotificationSection />} />
          <Route path="supplement-store" element={<SupplementStoreSection />} />
          <Route path="diet-details" element={<DietDetailsSection />} />
          <Route path="export-report" element={<ExportReportSection />} />
        </Route>
      </Routes>
    </>
      
  );
}

