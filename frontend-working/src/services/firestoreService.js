// Firestore Database Service
import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  Timestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Collections
export const COLLECTIONS = {
  USERS: 'users',
  VENUES: 'venues',
  SESSIONS: 'sessions',
  MENU_ITEMS: 'menuItems',
  BEACONS: 'beacons',
  ANALYTICS: 'analytics',
  NOTIFICATIONS: 'notifications'
};

// Generic CRUD operations
export const createDocument = async (collectionName, data) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error(`Error creating document in ${collectionName}:`, error);
    throw error;
  }
};

export const getDocument = async (collectionName, docId) => {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error(`Error getting document from ${collectionName}:`, error);
    throw error;
  }
};

export const updateDocument = async (collectionName, docId, updates) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error(`Error updating document in ${collectionName}:`, error);
    throw error;
  }
};

export const deleteDocument = async (collectionName, docId) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error(`Error deleting document from ${collectionName}:`, error);
    throw error;
  }
};

// Venue operations
export const createVenue = async (venueData) => {
  return await createDocument(COLLECTIONS.VENUES, venueData);
};

export const getVenue = async (venueId) => {
  return await getDocument(COLLECTIONS.VENUES, venueId);
};

export const updateVenue = async (venueId, updates) => {
  return await updateDocument(COLLECTIONS.VENUES, venueId, updates);
};

// Session operations
export const createSession = async (sessionData) => {
  return await createDocument(COLLECTIONS.SESSIONS, sessionData);
};

export const getActiveSessionsForVenue = async (venueId) => {
  try {
    const q = query(
      collection(db, COLLECTIONS.SESSIONS),
      where('venueId', '==', venueId),
      where('status', '==', 'active'),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting active sessions:', error);
    throw error;
  }
};

export const updateSession = async (sessionId, updates) => {
  return await updateDocument(COLLECTIONS.SESSIONS, sessionId, updates);
};

// Menu item operations
export const createMenuItem = async (menuItemData) => {
  return await createDocument(COLLECTIONS.MENU_ITEMS, menuItemData);
};

export const getMenuItemsForVenue = async (venueId) => {
  try {
    const q = query(
      collection(db, COLLECTIONS.MENU_ITEMS),
      where('venueId', '==', venueId),
      where('isActive', '==', true),
      orderBy('category'),
      orderBy('name')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting menu items:', error);
    throw error;
  }
};

export const updateMenuItem = async (itemId, updates) => {
  return await updateDocument(COLLECTIONS.MENU_ITEMS, itemId, updates);
};

// Beacon operations
export const createBeacon = async (beaconData) => {
  return await createDocument(COLLECTIONS.BEACONS, beaconData);
};

export const getBeaconsForVenue = async (venueId) => {
  try {
    const q = query(
      collection(db, COLLECTIONS.BEACONS),
      where('venueId', '==', venueId),
      orderBy('name')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting beacons:', error);
    throw error;
  }
};

// Real-time listeners
export const subscribeToActiveSessions = (venueId, callback) => {
  const q = query(
    collection(db, COLLECTIONS.SESSIONS),
    where('venueId', '==', venueId),
    where('status', '==', 'active'),
    orderBy('createdAt', 'desc')
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const sessions = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(sessions);
  });
};

// Analytics operations
export const recordAnalytics = async (analyticsData) => {
  return await createDocument(COLLECTIONS.ANALYTICS, analyticsData);
};

export const getAnalyticsForVenue = async (venueId, startDate, endDate) => {
  try {
    const q = query(
      collection(db, COLLECTIONS.ANALYTICS),
      where('venueId', '==', venueId),
      where('date', '>=', startDate),
      where('date', '<=', endDate),
      orderBy('date', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting analytics:', error);
    throw error;
  }
};

// Initialize venue with demo data
export const initializeVenueWithDemoData = async (venueId, venueName) => {
  try {
    // Create venue
    await createVenue({
      id: venueId,
      name: venueName,
      address: '123 Demo Street, Bar City, BC 12345',
      phone: '+1 (555) 123-4567',
      email: 'info@thedigitaltap.com',
      subscriptionTier: 'pro',
      settings: {
        autoCloseTabMinutes: 60,
        maxTabAmount: 500,
        tipSuggestions: [15, 18, 20, 25],
        allowCustomTips: true,
        notifications: {
          drinkReady: true,
          lowInventory: true,
          staffAlerts: true
        }
      },
      isActive: true
    });

    // Create demo beacons
    await createBeacon({
      venueId: venueId,
      name: 'Entry Beacon',
      uuid: 'E2C56DB5-DFFB-48D2-B060-D0F5A71096E0',
      major: 1,
      minor: 1,
      type: 'entry',
      location: 'Main Entrance',
      batteryLevel: 85,
      isActive: true
    });

    await createBeacon({
      venueId: venueId,
      name: 'Exit Beacon',
      uuid: 'E2C56DB5-DFFB-48D2-B060-D0F5A71096E0',
      major: 1,
      minor: 2,
      type: 'exit',
      location: 'Main Exit',
      batteryLevel: 92,
      isActive: true
    });

    // Create demo menu items
    const demoMenuItems = [
      { name: 'Craft IPA', category: 'Beer', price: 8.50, description: 'Local craft IPA with citrus notes' },
      { name: 'House Red Wine', category: 'Wine', price: 12.00, description: 'Full-bodied red wine blend' },
      { name: 'Whiskey Sour', category: 'Cocktails', price: 14.00, description: 'Classic whiskey sour with fresh lemon' },
      { name: 'Moscow Mule', category: 'Cocktails', price: 13.50, description: 'Vodka, ginger beer, and lime' },
      { name: 'Sparkling Water', category: 'Non-Alcoholic', price: 3.00, description: 'Premium sparkling water' }
    ];

    for (const item of demoMenuItems) {
      await createMenuItem({
        venueId: venueId,
        ...item,
        isActive: true,
        inventory: 50
      });
    }

    console.log(`Demo venue ${venueName} initialized successfully`);
    return venueId;
  } catch (error) {
    console.error('Error initializing demo venue:', error);
    throw error;
  }
};