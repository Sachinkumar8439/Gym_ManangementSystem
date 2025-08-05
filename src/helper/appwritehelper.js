import { ID, Databases, Query } from 'appwrite';
import { client } from '../Auth/Appwriteauth';

const databases = new Databases(client);

const databaseId = process.env.REACT_APP_APPWRITE_DATABASE_ID;
const memberCollectionId = process.env.REACT_APP_APPWRITE_COLLECTION_ID;


export const addMember = async (userId, memberData) => {
  if (!userId || !memberData) return { success: false, message: 'Missing parameters' };

  try {
    const newMember = await databases.createDocument(
      databaseId,
      memberCollectionId,
      ID.unique(),
      {
        ...memberData,
        userId,
        createdAt: new Date().toISOString(),
      }
    );

    return { success: true, message: 'Member added successfully', data: newMember };
  } catch (error) {
    console.log("error")
    return { success: false, message: error.message };
  }
};

export const getMembers = async (userId) => {
  if (!userId) return { success: false, message: 'User ID required' };

  try {
    const res = await databases.listDocuments(
      databaseId,
      memberCollectionId,
      [Query.equal('userId', userId), Query.orderDesc('$createdAt')]
    );

    return { success: true, members: res.documents, message: 'Members fetched successfully' };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const deleteMember = async (userId, memberId) => {
  if (!userId || !memberId) return { success: false, message: 'Missing parameters' };

  try {
    const memberDoc = await databases.getDocument(databaseId, memberCollectionId, memberId);

    if (memberDoc.userId !== userId) {
      return { success: false, message: 'Unauthorized access to delete member' };
    }

    await databases.deleteDocument(databaseId, memberCollectionId, memberId);
    return { success: true, message: 'Member deleted successfully' };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const updateMember = async (userId, memberId, updates) => {
  if (!userId || !memberId || !updates) return { success: false, message: 'Missing parameters' };

  try {
    const existingMember = await databases.getDocument(databaseId, memberCollectionId, memberId);

    if (existingMember.userId !== userId) {
      return { success: false, message: 'Unauthorized access to update member' };
    }

    const updated = await databases.updateDocument(
      databaseId,
      memberCollectionId,
      memberId,
      {
        ...updates,
        updatedAt: new Date().toISOString(),
      }
    );

    return { success: true, message: 'Member updated successfully', data: updated };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
