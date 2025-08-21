import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';

const Avatar = ({ 
  uri, 
  name = 'User', 
  size = 50, 
  backgroundColor = '#4f46e5', 
  textColor = '#ffffff' 
}) => {
  const [imageError, setImageError] = useState(false);
  
  // Reset error state when URI changes
  useEffect(() => {
    setImageError(false);
  }, [uri]);
  
  // Get initials from name
  const getInitials = (name) => {
    if (!name || typeof name !== 'string') return 'U';
    
    // Pašaliname specialius simbolius ir skaičius
    const cleaned = name.trim()
      .replace(/[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g, '')
      .replace(/\s+/g, ' ');
    
    if (cleaned === '') return 'U';
    
    const words = cleaned.split(' ').filter(word => word.length > 0);
    
    if (words.length === 0) return 'U';
    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }
    
    // Pirmas ir paskutinis žodis
    const firstWord = words[0];
    const lastWord = words[words.length - 1];
    
    if (firstWord === lastWord) {
      return firstWord.charAt(0).toUpperCase();
    }
    
    return (firstWord.charAt(0) + lastWord.charAt(0)).toUpperCase();
  };

  const initials = getInitials(name);

  // Only show image if URI is valid and looks like a URL and no error occurred
  const isValidImageUri = uri && 
    uri !== '' && 
    uri !== null && 
    uri !== undefined && 
    (uri.startsWith('http://') || 
     uri.startsWith('https://') || 
     uri.startsWith('/storage/') ||
     uri.startsWith('storage/')) &&
    !imageError;

  if (isValidImageUri) {
    return (
      <Image
        source={{ uri }}
        style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]}
        contentFit="cover"
        onError={() => {
          setImageError(true);
        }}
      />
    );
  }

  return (
    <View style={[
      styles.initialsContainer, 
      { 
        width: size, 
        height: size, 
        borderRadius: size / 2, 
        backgroundColor 
      }
    ]}>
      <View style={[styles.textWrapper, { paddingTop: size * 0.25 }]}>
        <Text style={[
          styles.initialsText, 
          { 
            color: textColor,
            fontSize: size * 0.4, // 40% of container size
          }
        ]}>
          {initials}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    backgroundColor: '#f3f4f6',
  },
  initialsContainer: {
    position: 'relative',
    backgroundColor: '#4f46e5',
  },
  textWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  initialsText: {
    fontWeight: 'bold',
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});

export default Avatar;
