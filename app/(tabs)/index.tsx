import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { Heart, MessageCircle, Share, Play, Pause } from 'lucide-react-native';
import { AppBar } from '@/components/AppBar';
import { useRouter } from 'expo-router';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Mock data for video guides
const videoGuides = [
  {
    id: 1,
    title: 'Cómo estructurar tu tesis',
    author: 'Dr. María González',
    likes: 1234,
    comments: 89,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    description: 'Aprende los fundamentos para estructurar correctamente tu tesis de grado',
  },
  {
    id: 2,
    title: 'Metodología de investigación',
    author: 'Prof. Carlos Rodríguez',
    likes: 892,
    comments: 45,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    description: 'Guía completa sobre metodologías de investigación académica',
  },
  {
    id: 3,
    title: 'Citas y referencias APA',
    author: 'Dra. Ana Martínez',
    likes: 2156,
    comments: 123,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    description: 'Todo lo que necesitas saber sobre el formato APA 7ma edición',
  },
];

interface VideoItemProps {
  item: any;
  isActive: boolean;
}

const VideoItem: React.FC<VideoItemProps> = ({ item, isActive }) => {
  const [liked, setLiked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<Video>(null);

  const togglePlayPause = async () => {
    if (videoRef.current) {
      if (isPlaying) {
        await videoRef.current.pauseAsync();
      } else {
        await videoRef.current.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <View style={styles.videoContainer}>
      <TouchableOpacity 
        style={styles.videoWrapper}
        onPress={togglePlayPause}
        activeOpacity={0.9}
      >
        <Video
          ref={videoRef}
          source={{ uri: item.videoUrl }}
          style={styles.video}
          resizeMode={ResizeMode.COVER}
          shouldPlay={isActive}
          isLooping
          onPlaybackStatusUpdate={(status) => {
            if (status.isLoaded) {
              setIsPlaying(status.isPlaying || false);
            }
          }}
        />
        
        {!isPlaying && (
          <View style={styles.playButton}>
            <Play size={60} color="#fff" />
          </View>
        )}
      </TouchableOpacity>

      <View style={styles.videoInfo}>
        <Text style={styles.videoTitle}>{item.title}</Text>
        <Text style={styles.videoAuthor}>@{item.author}</Text>
        <Text style={styles.videoDescription}>{item.description}</Text>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => setLiked(!liked)}
        >
          <Heart 
            size={28} 
            color={liked ? '#6FC309' : '#fff'} 
            fill={liked ? '#6FC309' : 'none'}
          />
          <Text style={styles.actionText}>{item.likes}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <MessageCircle size={28} color="#fff" />
          <Text style={styles.actionText}>{item.comments}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Share size={28} color="#fff" />
          <Text style={styles.actionText}>Compartir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function GuidesScreen() {
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();

  const onScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.y;
    const index = Math.round(scrollPosition / screenHeight);
    setActiveIndex(index);
  };

  const handleProfilePress = () => {
    router.push('/profile');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      <AppBar onProfilePress={handleProfilePress} />

      <ScrollView
        style={styles.scrollView}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {videoGuides.map((item, index) => (
          <VideoItem
            key={item.id}
            item={item}
            isActive={index === activeIndex}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollView: {
    flex: 1,
  },
  videoContainer: {
    height: screenHeight,
    width: screenWidth,
    position: 'relative',
  },
  videoWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: screenWidth,
    height: screenHeight,
  },
  playButton: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 50,
    padding: 10,
  },
  videoInfo: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 80,
  },
  videoTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  videoAuthor: {
    color: '#6FC309',
    fontSize: 14,
    marginBottom: 8,
  },
  videoDescription: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
  },
  actionButtons: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    alignItems: 'center',
  },
  actionButton: {
    alignItems: 'center',
    marginBottom: 20,
  },
  actionText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
  },
});