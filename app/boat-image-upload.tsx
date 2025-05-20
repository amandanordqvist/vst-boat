import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  Image,
  Alert,
  Platform,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ship, ChevronLeft, Camera, Upload, ArrowRight, Check } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useAuth } from '@/hooks/useAuth';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import Animated, { 
  FadeIn,
  FadeInUp,
  FadeOut
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

export default function BoatImageUploadScreen() {
  const { user, associateBoat } = useAuth();
  const params = useLocalSearchParams();
  const [boatImage, setBoatImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);

  // Request camera permissions on component mount
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Camera access is needed to take photos of your boat.',
          [{ text: 'OK' }]
        );
      }
    })();
  }, []);

  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.7,
      });

      if (!result.canceled) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setBoatImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.7,
      });

      if (!result.canceled) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setBoatImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to select image. Please try again.');
    }
  };

  const handleUploadImage = async () => {
    if (!boatImage) {
      Alert.alert('No Image Selected', 'Please take or choose a photo of your boat first.');
      return;
    }

    setIsUploading(true);
    try {
      // In a real app, you would upload the image to your backend here
      // Simulating an upload delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful upload
      setUploadComplete(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      // Auto-navigate after a short delay
      setTimeout(() => {
        router.replace('/(tabs)/vessel');
      }, 1500);
      
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Upload Failed', 'Failed to upload the image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSkip = () => {
    Alert.alert(
      'Skip Image Upload',
      'You can add an image of your boat later from the vessel details screen.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Skip', onPress: () => router.replace('/(tabs)/vessel') }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <LinearGradient
        colors={['#F0F4F8', '#FFFFFF']}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ChevronLeft size={24} color={Colors.neutral[800]} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Boat Image</Text>
          <View style={styles.headerRight} />
        </View>

        <View style={styles.content}>
          <Animated.View 
            entering={FadeInUp.duration(400).delay(100)}
            style={styles.titleContainer}
          >
            <Text style={styles.title}>Almost done!</Text>
            <Text style={styles.subtitle}>
              Add a photo of your boat to help identify it easily
            </Text>
          </Animated.View>

          <Animated.View 
            entering={FadeInUp.duration(400).delay(200)}
            style={styles.imageContainer}
          >
            {boatImage ? (
              <View style={styles.imagePreviewContainer}>
                <Image 
                  source={{ uri: boatImage }} 
                  style={styles.imagePreview} 
                  resizeMode="cover"
                />
                <TouchableOpacity 
                  style={styles.retakeButton}
                  onPress={takePhoto}
                >
                  <Camera size={18} color="#FFF" />
                  <Text style={styles.retakeButtonText}>Retake</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.placeholderContainer}>
                <Ship size={64} color={Colors.primary[300]} />
                <Text style={styles.placeholderText}>No image selected</Text>
              </View>
            )}
          </Animated.View>

          <Animated.View 
            entering={FadeInUp.duration(400).delay(300)}
            style={styles.buttonContainer}
          >
            {!boatImage && (
              <>
                <TouchableOpacity 
                  style={styles.cameraButton}
                  onPress={takePhoto}
                >
                  <Camera size={24} color="#FFF" />
                  <Text style={styles.cameraButtonText}>Take Photo</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.galleryButton}
                  onPress={pickImage}
                >
                  <Text style={styles.galleryButtonText}>Choose from Gallery</Text>
                </TouchableOpacity>
              </>
            )}

            {boatImage && !isUploading && !uploadComplete && (
              <TouchableOpacity 
                style={styles.uploadButton}
                onPress={handleUploadImage}
              >
                <Upload size={20} color="#FFF" />
                <Text style={styles.uploadButtonText}>Complete Registration</Text>
              </TouchableOpacity>
            )}

            {isUploading && (
              <View style={styles.uploadingContainer}>
                <ActivityIndicator color={Colors.primary[600]} size="large" />
                <Text style={styles.uploadingText}>Uploading...</Text>
              </View>
            )}

            {uploadComplete && (
              <Animated.View 
                entering={FadeIn.duration(300)}
                style={styles.successContainer}
              >
                <View style={styles.successIconContainer}>
                  <Check size={32} color="#FFF" />
                </View>
                <Text style={styles.successText}>Registration Complete!</Text>
                <Text style={styles.redirectingText}>Redirecting to your vessel...</Text>
              </Animated.View>
            )}

            {!uploadComplete && (
              <TouchableOpacity
                style={styles.skipButton}
                onPress={handleSkip}
              >
                <Text style={styles.skipButtonText}>Skip for now</Text>
              </TouchableOpacity>
            )}
          </Animated.View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary[700],
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? 20 : 10,
    paddingBottom: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.neutral[200],
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral[800],
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingBottom: 40,
  },
  titleContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  title: {
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    fontSize: 28,
    fontWeight: '700',
    color: Colors.neutral[900],
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    fontSize: 16,
    fontWeight: '400',
    color: Colors.neutral[600],
    textAlign: 'center',
    marginBottom: 24,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  placeholderContainer: {
    width: width - 48,
    height: (width - 48) * 0.6,
    backgroundColor: Colors.neutral[100],
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: Colors.neutral[300],
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    fontSize: 16,
    fontWeight: '400',
    color: Colors.neutral[500],
    marginTop: 16,
  },
  imagePreviewContainer: {
    width: width - 48,
    height: (width - 48) * 0.6,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 2,
    borderColor: Colors.primary[200],
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  retakeButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  retakeButtonText: {
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    marginLeft: 6,
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  cameraButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary[600],
    paddingVertical: 16,
    borderRadius: 12,
    width: '100%',
    marginBottom: 12,
  },
  cameraButtonText: {
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  galleryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary[100],
    paddingVertical: 16,
    borderRadius: 12,
    width: '100%',
    marginBottom: 12,
  },
  galleryButtonText: {
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary[700],
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary[600],
    paddingVertical: 16,
    borderRadius: 12,
    width: '100%',
    marginBottom: 12,
  },
  uploadButtonText: {
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  skipButton: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipButtonText: {
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary[600],
  },
  uploadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 24,
  },
  uploadingText: {
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    fontSize: 16,
    fontWeight: '500',
    color: Colors.primary[700],
    marginTop: 12,
  },
  successContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 24,
  },
  successIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.status.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  successText: {
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    fontSize: 20,
    fontWeight: '700',
    color: Colors.neutral[900],
    marginBottom: 8,
  },
  redirectingText: {
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    fontSize: 14,
    fontWeight: '400',
    color: Colors.neutral[600],
  },
}); 