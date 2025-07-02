import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Camera, Upload, X, Scan } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

const ScanContainer = styled.div`
  min-height: 100vh;
  background-color: var(--bg-primary);
  display: flex;
  flex-direction: column;
`;

const ScanHeader = styled.div`
  padding: var(--spacing-lg) var(--spacing-md);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const HeaderTitle = styled.h1`
  color: var(--text-primary);
  font-size: 1.5rem;
  font-weight: 600;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: var(--radius-md);
  transition: all 0.2s ease;
  
  &:hover {
    color: var(--text-primary);
    background-color: var(--bg-hover);
  }
`;

const ScanContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl);
  text-align: center;
`;

const CameraContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 400px;
  margin-bottom: var(--spacing-xl);
  border-radius: var(--radius-xl);
  overflow: hidden;
  background-color: var(--bg-secondary);
  aspect-ratio: 1;
`;

const VideoElement = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ScanOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
`;

const ScanFrame = styled.div`
  width: 200px;
  height: 200px;
  border: 3px solid var(--accent-primary);
  border-radius: var(--radius-lg);
  position: relative;
  
  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    border: 3px solid var(--accent-primary);
  }
  
  &::before {
    top: -3px;
    left: -3px;
    border-right: none;
    border-bottom: none;
  }
  
  &::after {
    bottom: -3px;
    right: -3px;
    border-left: none;
    border-top: none;
  }
`;

const ScanInstructions = styled.div`
  margin-bottom: var(--spacing-xl);
`;

const InstructionTitle = styled.h2`
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
  font-size: 1.25rem;
`;

const InstructionText = styled.p`
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: var(--spacing-md);
`;

const ActionButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  width: 100%;
  max-width: 300px;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  border: none;
  border-radius: var(--radius-lg);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &.primary {
    background-color: var(--accent-primary);
    color: var(--bg-primary);
    
    &:hover:not(:disabled) {
      background-color: var(--accent-hover);
      transform: translateY(-1px);
    }
  }
  
  &.secondary {
    background-color: var(--bg-secondary);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
    
    &:hover:not(:disabled) {
      background-color: var(--bg-hover);
    }
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const ErrorMessage = styled.div`
  background-color: rgba(255, 107, 107, 0.1);
  border: 1px solid var(--error-color);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  color: var(--error-color);
  margin-bottom: var(--spacing-md);
`;

const QRScanPage = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { success, error: showError } = useToast();

  useEffect(() => {
    return () => {
      // Cleanup camera stream on unmount
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const startCamera = async () => {
    try {
      setError('');
      setIsScanning(true);
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      
      // Start QR detection
      startQRDetection();
    } catch (err) {
      console.error('Camera access error:', err);
      setError('Unable to access camera. Please check permissions.');
      setIsScanning(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsScanning(false);
  };

  const startQRDetection = () => {
    // Note: In a real implementation, you'd use a QR code detection library
    // like qr-scanner or jsQR to detect QR codes from the video stream
    console.log('QR detection started');
    
    // Simulate QR code detection for demo
    setTimeout(() => {
      const mockQRData = 'http://localhost:3000/session/demo-session-id';
      handleQRDetected(mockQRData);
    }, 3000);
  };

  const handleQRDetected = async (qrData) => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    
    try {
      // Parse QR code data
      const url = new URL(qrData);
      const pathParts = url.pathname.split('/');
      
      if (pathParts[1] === 'session') {
        const sessionId = pathParts[2];
        if (sessionId && sessionId !== 'demo-session-id') {
          // Navigate to existing session
          stopCamera();
          navigate(`/session/${sessionId}`);
          return;
        }
      }
      
      // For demo purposes, redirect to a demo session creation
      stopCamera();
      success('QR Code detected! Redirecting to session...');
      navigate('/session/new?venueId=demo-venue&table=5');
      
    } catch (err) {
      console.error('Invalid QR code:', err);
      showError('Invalid QR code. Please try again.');
      setIsProcessing(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setIsProcessing(true);
    
    try {
      // Note: In a real implementation, you'd process the uploaded image
      // to detect QR codes using a library like qr-scanner
      
      // Simulate QR detection from uploaded image
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful detection
      success('QR Code detected in image!');
      navigate('/session/new?venueId=demo-venue&table=upload');
      
    } catch (err) {
      showError('Could not detect QR code in image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    stopCamera();
    navigate(-1);
  };

  return (
    <ScanContainer>
      <ScanHeader>
        <HeaderTitle>Scan QR Code</HeaderTitle>
        <CloseButton onClick={handleClose}>
          <X size={24} />
        </CloseButton>
      </ScanHeader>
      
      <ScanContent>
        {isScanning ? (
          <CameraContainer>
            <VideoElement 
              ref={videoRef}
              autoPlay
              playsInline
              muted
            />
            <ScanOverlay>
              <ScanFrame />
            </ScanOverlay>
          </CameraContainer>
        ) : (
          <CameraContainer>
            <ScanOverlay>
              <Scan size={64} color="var(--text-muted)" />
            </ScanOverlay>
          </CameraContainer>
        )}
        
        <ScanInstructions>
          <InstructionTitle>
            {isScanning ? 'Point at QR Code' : 'Start Scanning'}
          </InstructionTitle>
          <InstructionText>
            {isScanning 
              ? 'Position the QR code within the frame to scan'
              : 'Use your camera to scan a QR code at your table, or upload an image'
            }
          </InstructionText>
          {isProcessing && (
            <InstructionText style={{ color: 'var(--accent-primary)' }}>
              Processing QR code...
            </InstructionText>
          )}
        </ScanInstructions>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <ActionButtons>
          {!isScanning ? (
            <>
              <ActionButton 
                className="primary" 
                onClick={startCamera}
                disabled={isProcessing}
              >
                <Camera size={20} />
                Start Camera
              </ActionButton>
              
              <ActionButton 
                className="secondary" 
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
              >
                <Upload size={20} />
                Upload Image
              </ActionButton>
            </>
          ) : (
            <ActionButton 
              className="secondary" 
              onClick={stopCamera}
              disabled={isProcessing}
            >
              <X size={20} />
              Stop Camera
            </ActionButton>
          )}
        </ActionButtons>
        
        <HiddenFileInput
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
        />
      </ScanContent>
    </ScanContainer>
  );
};

export default QRScanPage;