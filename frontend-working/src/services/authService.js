// Firebase Authentication Service
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

// User roles
export const USER_ROLES = {
  OWNER: 'owner',
  MANAGER: 'manager',
  BARTENDER: 'bartender',
  SERVER: 'server'
};

// Create user with role
export const createUserWithRole = async (email, password, userData) => {
  try {
    // Create user account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update display name
    await updateProfile(user, {
      displayName: userData.name
    });

    // Save additional user data to Firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: email,
      name: userData.name,
      role: userData.role,
      venueId: userData.venueId || null,
      createdAt: new Date().toISOString(),
      isActive: true
    });

    return user;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

// Sign in user
export const signInUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

// Sign out user
export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

// Get user data from Firestore
export const getUserData = async (uid) => {
  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log('No user data found');
      return null;
    }
  } catch (error) {
    console.error('Error getting user data:', error);
    throw error;
  }
};

// Update user data
export const updateUserData = async (uid, updates) => {
  try {
    const docRef = doc(db, 'users', uid);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating user data:', error);
    throw error;
  }
};

// Send password reset email
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};

// Auth state listener
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Check if user has required role
export const hasRole = (userRole, requiredRole) => {
  // Owner and Manager can access everything
  if (userRole === USER_ROLES.OWNER || userRole === USER_ROLES.MANAGER) {
    return true;
  }
  
  // Otherwise, exact role match required
  return userRole === requiredRole;
};

// Demo account creation (for development)
export const createDemoAccounts = async (venueId) => {
  const demoAccounts = [
    {
      email: 'owner@thedigitaltap.com',
      password: 'demo123',
      name: 'Sarah Johnson',
      role: USER_ROLES.OWNER,
      venueId: venueId
    },
    {
      email: 'manager@thedigitaltap.com',
      password: 'demo123',
      name: 'Mike Chen',
      role: USER_ROLES.MANAGER,
      venueId: venueId
    },
    {
      email: 'bartender@thedigitaltap.com',
      password: 'demo123',
      name: 'Alex Rodriguez',
      role: USER_ROLES.BARTENDER,
      venueId: venueId
    },
    {
      email: 'server@thedigitaltap.com',
      password: 'demo123',
      name: 'Emma Davis',
      role: USER_ROLES.SERVER,
      venueId: venueId
    }
  ];

  try {
    for (const account of demoAccounts) {
      try {
        await createUserWithRole(account.email, account.password, account);
        console.log(`Created demo account: ${account.email}`);
      } catch (error) {
        // Account might already exist
        console.log(`Demo account ${account.email} already exists or error:`, error.message);
      }
    }
  } catch (error) {
    console.error('Error creating demo accounts:', error);
  }
};