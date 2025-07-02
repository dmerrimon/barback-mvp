import React, { useEffect, useState, useRef } from 'react';
import { useSocket } from '../contexts/SocketContext';
import { useToast } from '../contexts/ToastContext';

const BeaconDetection = ({ sessionId, onStatusChange }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [detectedBeacons, setDetectedBeacons] = useState([]);
  const [bluetoothDevice, setBluetoothDevice] = useState(null);
  const [scanningError, setScanningError] = useState(null);
  
  const { emitBeaconDetection } = useSocket();
  const { warning } = useToast();
  const scanIntervalRef = useRef(null);
  const proximityCheckRef = useRef(null);

  // Mock beacon data for demo
  const VENUE_BEACONS = [
    {
      uuid: 'E2C56DB5-DFFB-48D2-B060-D0F5A71096E0',
      major: 1,
      minor: 1,
      name: 'Entry Zone',
      type: 'entry'
    },
    {
      uuid: 'E2C56DB5-DFFB-48D2-B060-D0F5A71096E0',
      major: 1,
      minor: 2,
      name: 'Bar Zone',
      type: 'bar'
    },
    {
      uuid: 'E2C56DB5-DFFB-48D2-B060-D0F5A71096E0',
      major: 1,
      minor: 3,
      name: 'Exit Zone',
      type: 'exit'
    }
  ];

  const RSSI_THRESHOLD = -65; // Signal strength threshold for proximity

  useEffect(() => {
    startBeaconDetection();
    
    return () => {
      stopBeaconDetection();
    };
  }, [sessionId]);

  const startBeaconDetection = async () => {
    try {
      // Check if Web Bluetooth is supported
      if (!navigator.bluetooth) {
        console.warn('Web Bluetooth not supported');
        // Fallback to mock detection for demo
        startMockDetection();
        return;
      }

      setIsScanning(true);
      setScanningError(null);
      onStatusChange?.('searching');

      // Request Bluetooth device
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['battery_service'] // Add beacon services as needed
      });

      setBluetoothDevice(device);
      
      // Start scanning for advertisements
      const abortController = new AbortController();
      
      device.addEventListener('advertisementreceived', handleAdvertisement);
      await device.watchAdvertisements({ signal: abortController.signal });
      
      console.log('Beacon scanning started');
      
      // Set up proximity checking
      startProximityCheck();
      
    } catch (error) {
      console.error('Bluetooth scanning failed:', error);
      setScanningError(error.message);
      
      if (error.name === 'NotAllowedError') {
        warning('Bluetooth permission denied. Beacon detection disabled.');
      } else {
        warning('Could not start beacon detection. Using mock data for demo.');
      }
      
      // Fallback to mock detection
      startMockDetection();
    }
  };

  const stopBeaconDetection = () => {
    setIsScanning(false);
    
    if (bluetoothDevice) {
      bluetoothDevice.removeEventListener('advertisementreceived', handleAdvertisement);
    }
    
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
    }
    
    if (proximityCheckRef.current) {
      clearInterval(proximityCheckRef.current);
    }
  };

  const handleAdvertisement = (event) => {
    const device = event.device;
    const rssi = event.rssi;
    
    // Check if this is a beacon we're interested in
    const beacon = VENUE_BEACONS.find(b => 
      device.name && device.name.includes(b.name)
    );
    
    if (beacon) {
      const detectedBeacon = {
        ...beacon,
        rssi,
        timestamp: Date.now(),
        distance: calculateDistance(rssi)
      };
      
      updateDetectedBeacons(detectedBeacon);
    }
  };

  const updateDetectedBeacons = (newBeacon) => {
    setDetectedBeacons(prev => {
      const existing = prev.find(b => 
        b.uuid === newBeacon.uuid && 
        b.major === newBeacon.major && 
        b.minor === newBeacon.minor
      );
      
      if (existing) {
        return prev.map(b => 
          b.uuid === newBeacon.uuid && 
          b.major === newBeacon.major && 
          b.minor === newBeacon.minor ? newBeacon : b
        );
      } else {
        return [...prev, newBeacon];
      }
    });
  };

  const calculateDistance = (rssi) => {
    // Rough distance calculation based on RSSI
    // This is an approximation and can vary greatly
    if (rssi === 0) return -1;
    
    const ratio = (rssi * 1.0) / -59;
    if (ratio < 1.0) {
      return Math.pow(ratio, 10);
    } else {
      const accuracy = (0.89976) * Math.pow(ratio, 7.7095) + 0.111;
      return accuracy;
    }
  };

  const startProximityCheck = () => {
    proximityCheckRef.current = setInterval(() => {
      const now = Date.now();
      const activeBeacons = detectedBeacons.filter(beacon => 
        now - beacon.timestamp < 10000 && // Last seen within 10 seconds
        beacon.rssi > RSSI_THRESHOLD // Strong enough signal
      );
      
      if (activeBeacons.length > 0) {
        const closestBeacon = activeBeacons.reduce((closest, beacon) => 
          beacon.rssi > closest.rssi ? beacon : closest
        );
        
        handleZoneEntry(closestBeacon);
      } else {
        handleZoneExit();
      }
    }, 2000); // Check every 2 seconds
  };

  const handleZoneEntry = (beacon) => {
    console.log('Entered zone:', beacon.name);
    
    onStatusChange?.('connected');
    
    // Emit to server
    emitBeaconDetection({
      sessionId,
      beaconId: `${beacon.uuid}-${beacon.major}-${beacon.minor}`,
      action: 'enter',
      rssi: beacon.rssi,
      zoneType: beacon.type,
      timestamp: Date.now()
    });
  };

  const handleZoneExit = () => {
    console.log('Exited all zones');
    
    onStatusChange?.('disconnected');
    
    // Emit to server
    emitBeaconDetection({
      sessionId,
      action: 'exit',
      timestamp: Date.now()
    });
  };

  // Mock detection for demo purposes
  const startMockDetection = () => {
    onStatusChange?.('searching');
    
    // Simulate finding beacons after a delay
    setTimeout(() => {
      const mockBeacon = VENUE_BEACONS[1]; // Bar zone
      const mockDetection = {
        ...mockBeacon,
        rssi: -45, // Strong signal
        timestamp: Date.now(),
        distance: 2.5
      };
      
      setDetectedBeacons([mockDetection]);
      handleZoneEntry(mockDetection);
    }, 3000);
    
    // Simulate periodic updates
    scanIntervalRef.current = setInterval(() => {
      const randomRssi = -45 + (Math.random() * 20 - 10); // Vary signal strength
      const mockBeacon = VENUE_BEACONS[1];
      
      const updatedDetection = {
        ...mockBeacon,
        rssi: randomRssi,
        timestamp: Date.now(),
        distance: calculateDistance(randomRssi)
      };
      
      setDetectedBeacons([updatedDetection]);
      
      if (randomRssi > RSSI_THRESHOLD) {
        onStatusChange?.('connected');
      } else {
        onStatusChange?.('disconnected');
      }
    }, 5000);
  };

  // This component doesn't render anything visible
  // It only handles beacon detection logic
  return null;
};

export default BeaconDetection;