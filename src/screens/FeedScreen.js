import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, TextInput, Animated, Image as RNImage } from 'react-native';
import { Image } from 'expo-image';
import CenteredAvatar from '../components/CenteredAvatar';
import useAuthStore from '../store/authStore';
import { API_URL, WEB_URL, apiFetch } from '../services/apiConfig';
import TopHeader from '../components/TopHeader';
import BottomTabBar from '../components/BottomTabBar';

const FeedScreen = () => {
  const { token } = useAuthStore();
  const [items, setItems] = useState([]);
  const [tab, setTab] = useState('all'); // 'friends' | 'all'
   const [loading, setLoading] = useState(true); // No loading state for seamless navigation
  const [commentTexts, setCommentTexts] = useState({}); // Store comment text for each item
  const [lastTap, setLastTap] = useState(null); // For double tap detection
  const [hearts, setHearts] = useState([]); // Array of floating hearts
  const [imageAspectRatios, setImageAspectRatios] = useState({}); // Store aspect ratios for images

  useEffect(() => {
    (async () => {
      try {
        const modeParam = tab === 'friends' ? 'friends' : 'all';
        const res = await apiFetch(`${API_URL}/feed?page=1&per_page=15&mode=${modeParam}`, { 
          headers: { 
            'Authorization': `Bearer ${token}`
          }
        }, 15000);
        
        const data = await res.json();
        if (!res.ok || !data?.data) throw new Error();
        setItems(data.data || []);
      } catch (e) {
        console.log('Feed load error:', e.message);
        // Show empty feed on error
        setItems([]);
      }
      // No loading state for seamless navigation
    })();
  }, [token, tab]);

  const handleLike = async (itemId, isLiked) => {
    try {
      const endpoint = isLiked ? 'unlike' : 'like';
      const res = await apiFetch(`${API_URL}/feed/${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ checkin_id: itemId }),
      }, 15000);
      
      const data = await res.json();

      if (data.success) {
        setItems(prevItems => 
          prevItems.map(item => 
            item.id === itemId 
              ? { ...item, likes_count: data.likes_count, liked_by_me: !isLiked }
              : item
          )
        );
      }
    } catch (e) {
      console.error('Like error:', e);
      console.error('Like URL:', `${API_URL}/feed/${endpoint}`);
    }
  };

  const handleComment = async (itemId) => {
    const commentText = commentTexts[itemId]?.trim();
    if (!commentText) return;

    try {
      const res = await apiFetch(`${API_URL}/feed/comment`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ checkin_id: itemId, comment: commentText }),
      }, 15000);
      
      const data = await res.json();

      if (data.success) {
        setItems(prevItems => 
          prevItems.map(item => 
            item.id === itemId 
              ? { ...item, comments: [...item.comments, data.comment] }
              : item
          )
        );
        setCommentTexts(prev => ({ ...prev, [itemId]: '' }));
      }
    } catch (e) {
      console.error('Comment error:', e);
      console.error('Comment URL:', `${API_URL}/feed/comment`);
    }
  };

  const handleDeleteComment = async (commentId, itemId) => {
    try {
      const res = await fetch(`${API_URL}/feed/comment/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });
      
      const data = await res.json();

      if (data.success) {
        setItems(prevItems => 
          prevItems.map(item => 
            item.id === itemId 
              ? { ...item, comments: item.comments.filter(c => c.id !== commentId) }
              : item
          )
        );
      }
    } catch (e) {
      console.error('Delete comment error:', e);
    }
  };

  const showHeartAnimation = () => {
    const heartId = Date.now() + Math.random();
    const randomX = Math.random() * 60 + 20; // Random X position (20-80% of width)
    const randomY = Math.random() * 60 + 20; // Random Y position (20-80% of height)
    
    const heart = {
      id: heartId,
      opacity: new Animated.Value(1),
      translateY: new Animated.Value(0),
      x: randomX,
      y: randomY,
    };
    
    setHearts(prev => [...prev, heart]);
    
    // Animate heart floating up and fading out
    Animated.parallel([
      Animated.timing(heart.opacity, {
        toValue: 0,
        duration: 2000,
        useNativeDriver: true,
      }),
      Animated.timing(heart.translateY, {
        toValue: -100,
        duration: 2000,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Remove heart from array after animation
      setHearts(prev => prev.filter(h => h.id !== heartId));
    });
  };

  const handleDoubleTap = (itemId, isLiked) => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;
    
    if (lastTap && (now - lastTap) < DOUBLE_PRESS_DELAY) {
      // Double tap detected - always show animation
      showHeartAnimation();
      
      // Like only if not already liked
      if (!isLiked) {
        handleLike(itemId, false);
      }
    }
    setLastTap(now);
  };

  const getImageAspectRatio = (imageUrl, itemId) => {
    if (imageAspectRatios[itemId]) {
      return imageAspectRatios[itemId];
    }
    
    // Use RNImage.getSize for getting dimensions, but render with expo-image
    RNImage.getSize(imageUrl, (width, height) => {
      const aspectRatio = width / height;
      setImageAspectRatios(prev => ({ ...prev, [itemId]: aspectRatio }));
    }, (error) => {
      setImageAspectRatios(prev => ({ ...prev, [itemId]: 16/9 })); // fallback to 16:9 instead of square
    });
    
    return 16/9; // default 16:9 while loading instead of square
  };

  // Remove blocking loading screen for seamless navigation

  return (
    <View style={{ flex: 1, backgroundColor: '#0a3848' }}>
      <TopHeader title="Feed" />
      <View style={{ flex: 1, paddingBottom: 80 }}>
      <View style={styles.tabsRow}>
        <TouchableOpacity style={[styles.tabBtn, tab==='friends' && styles.tabActive]} onPress={()=>setTab('friends')}><Text style={[styles.tabText, tab==='friends' && styles.tabTextActive]}>Draugų apsilankymai</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.tabBtn, tab==='all' && styles.tabActive]} onPress={()=>setTab('all')}><Text style={[styles.tabText, tab==='all' && styles.tabTextActive]}>Visi apsilankymai</Text></TouchableOpacity>
      </View>
      {loading && items.length === 0 && (
        <View style={{ padding: 20, alignItems: 'center' }}>
          <ActivityIndicator color="#ffffff" size="large" />
          <Text style={{ color: '#ffffff', marginTop: 10 }}>Kraunama...</Text>
        </View>
      )}
      <FlatList
        data={items}
        keyExtractor={(it)=>`feed-${it.id}`}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.headerRow}>
              <View style={styles.userRow}>
                <CenteredAvatar 
                  uri={item.user?.profile_photo_url}
                  name={item.user?.name} 
                  size={40} 
                  backgroundColor="#4f46e5" 
                  textColor="#ffffff" 
                />
                <View style={{ marginLeft: 12 }}>
                  <Text style={styles.userName}>{item.user?.name}</Text>
                  <Text style={styles.barName}>{item.bar?.name}</Text>
                </View>
              </View>
              <Text style={styles.dateText}>{new Date(item.created_at).toLocaleString('lt-LT', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</Text>
            </View>
            {item.comment ? <View style={styles.commentBox}><Text style={styles.commentText}>{item.comment}</Text></View> : null}
            {item.photo_path ? (
              <TouchableOpacity 
                style={styles.photoWrap} 
                onPress={() => handleDoubleTap(item.id, item.liked_by_me)}
                activeOpacity={0.9}
              >
                <Image 
                  source={{ uri: `${WEB_URL}/storage/${item.photo_path}` }} 
                  style={[styles.photo, { aspectRatio: getImageAspectRatio(`${WEB_URL}/storage/${item.photo_path}`, item.id) }]} 
                  contentFit="cover"
                  placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
                  onError={() => {}}
                />
                {hearts.map((heart) => (
                  <Animated.View
                    key={heart.id}
                    style={[
                      styles.floatingHeart,
                      {
                        left: `${heart.x}%`,
                        top: `${heart.y}%`,
                        opacity: heart.opacity,
                        transform: [{ translateY: heart.translateY }],
                      },
                    ]}
                  >
                    <Text style={styles.heartEmoji}>♥</Text>
                  </Animated.View>
                ))}
              </TouchableOpacity>
            ) : null}
            {Array.isArray(item.tagged_friends) && item.tagged_friends.length > 0 ? (
              <View style={styles.taggedRow}><Text style={styles.taggedLabel}>Su: </Text>{item.tagged_friends.map((f, idx) => (
                <Text key={idx} style={styles.taggedFriend}>{f.name}</Text>
              ))}</View>
            ) : null}
            <View style={styles.footerBox}>
              <View style={styles.footerInline}>
                <View style={styles.likeRow}>
                  <TouchableOpacity onPress={() => handleLike(item.id, item.liked_by_me)}>
                    <Text style={[styles.likeIcon, item.liked_by_me && styles.likeIconActive]}>
                      {item.liked_by_me ? '♥' : '♡'}
                    </Text>
                  </TouchableOpacity>
                  <Text style={styles.likeCount}>{item.likes_count ?? 0}</Text>
                </View>
                <Text style={styles.separator}>|</Text>
                <Text style={styles.metaLabel}>Komentarai</Text>
              </View>
              {Array.isArray(item.comments) && item.comments.length > 0 ? (
                <View style={styles.commentsBox}>
                  {item.comments.map(c => (
                    <View key={`cm-${c.id}`} style={styles.commentRow}>
                      <CenteredAvatar 
                        uri={c.user?.profile_photo_path ? `${WEB_URL}/storage/${c.user.profile_photo_path}` : null}
                        name={c.user?.name} 
                        size={30} 
                        backgroundColor="#4f46e5" 
                        textColor="#ffffff" 
                      />
                      <View style={styles.commentBubble}>
                        <View style={styles.commentHeader}>
                          <Text style={styles.commentAuthor}>{c.user?.name}</Text>
                          {c.can_delete && (
                            <TouchableOpacity onPress={() => handleDeleteComment(c.id, item.id)} style={styles.deleteButton}>
                              <Text style={styles.deleteButtonText}>✕</Text>
                            </TouchableOpacity>
                          )}
                        </View>
                        <Text style={styles.commentText}>{c.comment}</Text>
                        <Text style={styles.commentTime}>{new Date(c.created_at).toLocaleString('lt-LT', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              ) : null}
              <View style={styles.addCommentRow}>
                <TextInput 
                  style={styles.addCommentInput} 
                  placeholder="Komentaras..." 
                  placeholderTextColor="#9ca3af"
                  multiline={true}
                  value={commentTexts[item.id] || ''}
                  onChangeText={(text) => setCommentTexts(prev => ({ ...prev, [item.id]: text }))}
                />
                <TouchableOpacity style={styles.sendButton} onPress={() => handleComment(item.id)}>
                  <Text style={styles.sendButtonText}>Siųsti</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />
      </View>
      <BottomTabBar />
    </View>
  );
};

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#0a3848', padding: 12 },
  tabsRow: { flexDirection: 'row', marginBottom: 12, justifyContent: 'center' },
  tabBtn: { backgroundColor: '#374151', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, marginHorizontal: 6, borderWidth: 0 },
  tabActive: { backgroundColor: '#4f46e5', borderWidth: 2, borderColor: '#ffffff' },
  tabText: { color: '#cbd5e1', fontWeight: '700' },
  tabTextActive: { color: '#ffffff' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  card: { backgroundColor: '#004259', borderRadius: 10, overflow: 'hidden', marginBottom: 16, borderWidth: 2, borderColor: '#4338ca' },
  headerRow: { padding: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#374151', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  userRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: '#4b5563', marginRight: 12 },
  userName: { color: '#ffffff', fontWeight: '700', fontSize: 16 },
  barName: { color: '#d1d5db', fontSize: 13, marginTop: 2 },
  dateText: { color: '#9ca3af', fontSize: 12 },
  commentBox: { backgroundColor: '#004259', paddingHorizontal: 16, paddingVertical: 12 },
  commentText: { color: '#e5e7eb', fontSize: 16 },
  photoWrap: { backgroundColor: '#000000', width: '100%', position: 'relative' },
  photo: { width: '100%' },
  floatingHeart: {
    position: 'absolute',
    zIndex: 999,
    pointerEvents: 'none',
  },
  heartEmoji: {
    fontSize: 60,
    color: '#f59e0b',
    textAlign: 'center',
  },
  taggedRow: { backgroundColor: '#004259', paddingHorizontal: 16, paddingVertical: 8, flexDirection: 'row', flexWrap: 'wrap' },
  taggedLabel: { color: '#d1d5db', marginRight: 6, fontSize: 14 },
  taggedFriend: { color: '#93c5fd', marginRight: 8, fontSize: 14 },
  footerBox: { backgroundColor: '#0a3848', borderTopWidth: 4, borderTopColor: '#f59e0b', paddingHorizontal: 16, paddingVertical: 16 },
  footerInline: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', marginBottom: 16 },
  likeRow: { flexDirection: 'row', alignItems: 'center' },
  likeIcon: { color: '#6b7280', fontSize: 20, marginRight: 4 },
  likeIconActive: { color: '#f59e0b' },
  likeCount: { color: '#e5e7eb' },
  separator: { color: '#6b7280', marginHorizontal: 16, fontSize: 16 },
  metaLabel: { color: '#d1d5db', fontWeight: '600', fontSize: 16 },
  commentsBox: { marginTop: 8, backgroundColor: '#0a3848', padding: 8, borderRadius: 8 },
  commentRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 },
  commentAvatar: { width: 28, height: 28, borderRadius: 14, marginRight: 8 },
  commentBubble: { backgroundColor: '#374151', borderRadius: 8, padding: 12, flex: 1, marginLeft: 12 },
  commentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  commentAuthor: { color: '#ffffff', fontWeight: '600', fontSize: 14, flex: 1 },
  commentText: { color: '#e5e7eb', fontSize: 14, marginTop: 2 },
  commentTime: { color: '#9ca3af', fontSize: 8, marginTop: 4 },
  deleteButton: { backgroundColor: '#ef4444', borderRadius: 12, width: 24, height: 24, justifyContent: 'center', alignItems: 'center', marginLeft: 8 },
  deleteButtonText: { color: '#ffffff', fontSize: 12, fontWeight: 'bold' },
  addCommentRow: { marginTop: 12, backgroundColor: '#0a3848', borderRadius: 20, paddingVertical: 8, paddingHorizontal: 16, borderWidth: 2, borderColor: '#4b5563', flexDirection: 'row', alignItems: 'center' },
  addCommentInput: { flex: 1, color: '#ffffff', fontSize: 14, marginRight: 12, minHeight: 20 },
  sendButton: { backgroundColor: '#4f46e5', borderRadius: 20, paddingVertical: 8, paddingHorizontal: 16 },
  sendButtonText: { color: '#ffffff', fontWeight: '700', fontSize: 14 },
});

export default FeedScreen;


