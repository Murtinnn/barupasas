import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';

const CenteredAvatar = ({ 
  uri,
  name = 'User', 
  size = 50, 
  backgroundColor = '#4f46e5', 
  textColor = '#ffffff',
  borderWidth = 0,
  borderColor = 'transparent',
  style = {},
}) => {
  const [imageError, setImageError] = useState(false);
  
  // Show image if valid URI, otherwise show perfectly centered initials
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
  const fontSize = Math.floor(size * 0.4);

  // Show image only if URI is valid AND no error occurred
  const hasValidUri = uri && uri !== '' && uri !== null && uri !== undefined && (
    uri.startsWith('http://') || 
    uri.startsWith('https://') || 
    uri.startsWith('/storage/') ||
    uri.startsWith('storage/')
  );
  const shouldShowImage = hasValidUri && !imageError;
  
  if (shouldShowImage) {
    return (
      <Image
        source={{ uri }}
        style={[{ width: size, height: size, borderRadius: size / 2, borderWidth, borderColor }, style]}
        contentFit="cover"
        onError={() => {
          setImageError(true); // This will cause re-render with initials
        }}
      />
    );
  }

  // Show perfectly centered initials
  return (
    <View style={[
      styles.container, 
      { 
        width: size, 
        height: size, 
        borderRadius: size / 2, 
        backgroundColor,
        borderWidth,
        borderColor,
      },
      style
    ]}>
      <Text style={[
        styles.text, 
        { 
          color: textColor,
          fontSize: fontSize,
        }
      ]}>
        {initials}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4f46e5',
  },
  text: {
    fontWeight: 'bold',
    textAlign: 'center',
    includeFontPadding: false,
  },
});

export default CenteredAvatar;
