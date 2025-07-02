import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(process.env.REACT_APP_API_URL || 'http://localhost:3001', {
      transports: ['websocket', 'polling'],
      upgrade: true,
      timeout: 20000,
      forceNew: true
    });

    // Connection event handlers
    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
      setIsConnected(true);
      setError(null);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setError(error.message);
      setIsConnected(false);
    });

    newSocket.on('reconnect', (attemptNumber) => {
      console.log('Socket reconnected after', attemptNumber, 'attempts');
      setIsConnected(true);
      setError(null);
    });

    newSocket.on('reconnect_error', (error) => {
      console.error('Socket reconnection error:', error);
      setError(error.message);
    });

    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      newSocket.close();
    };
  }, []);

  // Helper functions for common socket operations
  const joinSession = (sessionId) => {
    if (socket && isConnected) {
      socket.emit('join-session', sessionId);
    }
  };

  const leaveSession = (sessionId) => {
    if (socket && isConnected) {
      socket.emit('leave-session', sessionId);
    }
  };

  const joinBartender = (venueId) => {
    if (socket && isConnected) {
      socket.emit('join-bartender', venueId);
    }
  };

  const leaveBartender = (venueId) => {
    if (socket && isConnected) {
      socket.emit('leave-bartender', venueId);
    }
  };

  const emitBeaconDetection = (data) => {
    if (socket && isConnected) {
      socket.emit('beacon-detection', data);
    }
  };

  const value = {
    socket,
    isConnected,
    error,
    joinSession,
    leaveSession,
    joinBartender,
    leaveBartender,
    emitBeaconDetection
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};