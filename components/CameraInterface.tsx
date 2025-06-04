import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

interface CameraInterfaceProps {
  isVisible: boolean;
  onClose: () => void;
  onPhotoTaken: (photoUri: string, timestamp: string) => void;
  context?: 'checklist' | 'maintenance' | 'fuel' | 'logbook';
}

export const CameraInterface: React.FC<CameraInterfaceProps> = ({
  isVisible,
  onClose,
  onPhotoTaken,
  context = 'checklist'
}) => {
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Mock photo capture - in real app this would use expo-camera
  const handleCapturePhoto = () => {
    // Simulate photo capture
    const mockPhotoUri = `photo_${Date.now()}.jpg`;
    const timestamp = new Date().toLocaleString('sv-SE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    setCapturedPhoto(mockPhotoUri);
    setIsPreviewMode(true);
  };

  const handleSavePhoto = () => {
    if (capturedPhoto) {
      const timestamp = new Date().toLocaleString('sv-SE');
      onPhotoTaken(capturedPhoto, timestamp);
      resetCamera();
      onClose();
    }
  };

  const handleRetakePhoto = () => {
    setCapturedPhoto(null);
    setIsPreviewMode(false);
  };

  const resetCamera = () => {
    setCapturedPhoto(null);
    setIsPreviewMode(false);
  };

  const getContextTitle = () => {
    switch (context) {
      case 'checklist': return 'Checklista Foto';
      case 'maintenance': return 'Service Kvitto';
      case 'fuel': return 'Bränsle Kvitto';
      case 'logbook': return 'Resedagbok Foto';
      default: return 'Ta Foto';
    }
  };

  if (!isVisible) return null;

  return (
    <Modal visible={isVisible} animationType="slide" presentationStyle="fullScreen">
      <View style={styles.container}>
        {/* Header */}
        <BlurView intensity={95} style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{getContextTitle()}</Text>
          <View style={styles.placeholder} />
        </BlurView>

        {/* Camera View */}
        <View style={styles.cameraContainer}>
          {isPreviewMode && capturedPhoto ? (
            // Photo Preview
            <View style={styles.previewContainer}>
              <View style={styles.mockPhoto}>
                <Ionicons name="image" size={80} color="#ddd" />
                <Text style={styles.mockPhotoText}>Foto Preview</Text>
                <Text style={styles.timestampOverlay}>
                  {new Date().toLocaleString('sv-SE')}
                </Text>
              </View>
            </View>
          ) : (
            // Camera Viewfinder
            <View style={styles.viewfinderContainer}>
              <View style={styles.mockViewfinder}>
                <Ionicons name="camera" size={60} color="#888" />
                <Text style={styles.viewfinderText}>Kamera Vy</Text>
                
                {/* Timestamp Overlay */}
                <View style={styles.timestampContainer}>
                  <Text style={styles.timestamp}>
                    {new Date().toLocaleString('sv-SE')}
                  </Text>
                </View>

                {/* Focus indicator */}
                <View style={styles.focusIndicator}>
                  <View style={styles.focusSquare} />
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Controls */}
        <BlurView intensity={95} style={styles.controls}>
          {isPreviewMode ? (
            // Preview Controls
            <View style={styles.previewControls}>
              <TouchableOpacity 
                onPress={handleRetakePhoto}
                style={styles.retakeButton}
              >
                <Ionicons name="refresh" size={24} color="#fff" />
                <Text style={styles.controlText}>Ta Om</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={handleSavePhoto}
                style={styles.saveButton}
              >
                <Ionicons name="checkmark" size={28} color="#fff" />
                <Text style={styles.saveText}>Spara</Text>
              </TouchableOpacity>
            </View>
          ) : (
            // Camera Controls
            <View style={styles.cameraControls}>
              <TouchableOpacity style={styles.galleryButton}>
                <Ionicons name="images" size={24} color="#fff" />
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={handleCapturePhoto}
                style={styles.captureButton}
              >
                <View style={styles.captureButtonInner} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.flipButton}>
                <Ionicons name="camera-reverse" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
        </BlurView>

        {/* Context Info */}
        <View style={styles.contextInfo}>
          <Text style={styles.contextText}>
            {context === 'checklist' && '📋 Foto kommer att läggas till i checklistan'}
            {context === 'maintenance' && '🔧 Kvitto sparas i servicehistorik'}
            {context === 'fuel' && '⛽ Bränslekvitto registreras automatiskt'}
            {context === 'logbook' && '📖 Foto läggs till i resedagboken'}
          </Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  placeholder: {
    width: 40,
  },
  cameraContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewfinderContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  mockViewfinder: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  viewfinderText: {
    color: '#888',
    fontSize: 16,
    marginTop: 10,
  },
  timestampContainer: {
    position: 'absolute',
    top: 30,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  timestamp: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  focusIndicator: {
    position: 'absolute',
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  focusSquare: {
    width: 60,
    height: 60,
    borderWidth: 2,
    borderColor: '#007AFF',
    backgroundColor: 'transparent',
  },
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mockPhoto: {
    width: 300,
    height: 400,
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  mockPhotoText: {
    color: '#888',
    fontSize: 16,
    marginTop: 10,
  },
  timestampOverlay: {
    position: 'absolute',
    bottom: 15,
    right: 15,
    color: '#fff',
    fontSize: 12,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  controls: {
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  cameraControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  galleryButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
  },
  flipButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 20,
  },
  retakeButton: {
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 15,
  },
  controlText: {
    color: '#fff',
    fontSize: 14,
    marginTop: 5,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    borderRadius: 30,
    paddingHorizontal: 40,
    paddingVertical: 15,
    alignItems: 'center',
    flexDirection: 'row',
  },
  saveText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  contextInfo: {
    position: 'absolute',
    bottom: 140,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
  },
  contextText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
}); 