import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../config/supabase';
import { useAuth } from '../contexts/AuthContext';
import { decode } from 'base64-arraybuffer';

export default function CreatePostScreen({ navigation }) {
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth();

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Permission to access camera roll is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      allowsMultipleSelection: false,
      presentationStyle: 'fullScreen',
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handlePost = async () => {
    if (!caption && !image) {
      Alert.alert('Error', 'Please add a caption or image');
      return;
    }

    setUploading(true);

    try {
      // First, ensure the user profile exists
      const { data: existingProfile, error: profileCheckError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.uid)
        .single();

      // If profile doesn't exist, create it with upsert to handle duplicates
      if (profileCheckError || !existingProfile) {
        const username = user.displayName || user.email?.split('@')[0] || `user_${user.uid.slice(0, 8)}`;
        
        const { error: profileUpsertError } = await supabase
          .from('profiles')
          .upsert([
            {
              id: user.uid,
              username: username,
              full_name: user.displayName || null,
              avatar_url: user.photoURL || null,
              bio: null,
            },
          ], {
            onConflict: 'id',
            ignoreDuplicates: false,
          });

        if (profileUpsertError && !profileUpsertError.message.includes('duplicate key')) {
          throw new Error(`Profile creation failed: ${profileUpsertError.message}`);
        }
      }

      let imageUrl = null;

      if (image) {
        // Generate unique filename
        const fileExt = image.split('.').pop();
        const fileName = `${user.uid}/${Date.now()}.${fileExt || 'jpg'}`;
        
        // Fetch the image and convert to blob
        const response = await fetch(image);
        const blob = await response.blob();
        
        // Convert blob to array buffer
        const arrayBuffer = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsArrayBuffer(blob);
        });
        
        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('posts')
          .upload(fileName, arrayBuffer, {
            contentType: 'image/jpeg',
            upsert: false,
          });

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('posts')
          .getPublicUrl(fileName);

        imageUrl = urlData.publicUrl;
      }

      // Insert post into database
      const { error } = await supabase.from('posts').insert([
        {
          caption,
          image_url: imageUrl,
          user_id: user.uid,
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      Alert.alert('Success', 'Post created successfully!');
      setCaption('');
      setImage(null);
      navigation.navigate('Feed');
    } catch (error) {
      Alert.alert('Error', 'Failed to create post: ' + error.message);
      if (__DEV__) {
        console.error('Create post error:', error);
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.cancelButton}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Post</Text>
          <TouchableOpacity onPress={handlePost} disabled={uploading}>
            <Text style={[styles.postButton, uploading && styles.postButtonDisabled]}>
              {uploading ? 'Posting...' : 'Post'}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          {image ? (
            <View style={styles.imageContainer}>
              <Image source={{ uri: image }} style={styles.image} />
              <View style={styles.imageOverlay}>
                <Text style={styles.changeImageText}>Tap to change photo</Text>
              </View>
            </View>
          ) : (
            <View style={styles.imagePlaceholder}>
              <View style={styles.iconCircle}>
                <Text style={styles.iconText}>📷</Text>
              </View>
              <Text style={styles.imagePlaceholderText}>Add Photo</Text>
              <Text style={styles.imagePlaceholderSubtext}>Tap to select from gallery</Text>
            </View>
          )}
        </TouchableOpacity>

        <TextInput
          style={styles.captionInput}
          placeholder="Write a caption..."
          value={caption}
          onChangeText={setCaption}
          multiline
          maxLength={500}
          placeholderTextColor="#8e8e8e"
        />

        {uploading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#3797f0" />
            <Text style={styles.loadingText}>Uploading...</Text>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#dbdbdb',
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#262626',
  },
  cancelButton: {
    color: '#262626',
    fontSize: 16,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  postButton: {
    color: '#3797f0',
    fontSize: 16,
    fontWeight: '600',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  postButtonDisabled: {
    color: '#9acaf7',
  },
  imagePicker: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    overflow: 'hidden',
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#e1e8ed',
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(55, 151, 240, 0.95)',
    paddingVertical: 18,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  changeImageText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    margin: 15,
    borderRadius: 8,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  iconText: {
    fontSize: 40,
  },
  imagePlaceholderText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#262626',
    marginBottom: 6,
  },
  imagePlaceholderSubtext: {
    fontSize: 14,
    color: '#8e8e8e',
    fontWeight: '500',
  },
  captionInput: {
    padding: 15,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#262626',
  },
});