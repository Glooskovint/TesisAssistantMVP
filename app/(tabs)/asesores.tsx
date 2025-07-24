import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import { Search, Star, MessageCircle, Calendar, MapPin } from 'lucide-react-native';
import { AppBar } from '@/components/AppBar';
import { PaymentModal } from '@/components/PaymentModal';
import { MessagingModal } from '@/components/MessagingModal';
import { useRouter } from 'expo-router';

// Mock data for advisors
const advisors = [
  {
    id: 1,
    name: 'Dr. María González',
    specialty: 'Investigación Cuantitativa',
    rating: 4.9,
    reviews: 124,
    available: true,
    location: 'Universidad Central',
    price: '$50/hora',
    image: 'https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Doctora en Ciencias Sociales con 15 años de experiencia en investigación académica.',
  },
  {
    id: 2,
    name: 'Prof. Carlos Rodríguez',
    specialty: 'Metodología de Investigación',
    rating: 4.8,
    reviews: 89,
    available: true,
    location: 'Instituto Tecnológico',
    price: '$45/hora',
    image: 'https://images.pexels.com/photos/5212700/pexels-photo-5212700.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Magíster en Educación, especialista en metodologías de investigación cualitativa.',
  },
  {
    id: 3,
    name: 'Dra. Ana Martínez',
    specialty: 'Redacción Académica',
    rating: 4.7,
    reviews: 156,
    available: false,
    location: 'Universidad Nacional',
    price: '$55/hora',
    image: 'https://images.pexels.com/photos/5212329/pexels-photo-5212329.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Doctora en Literatura, experta en redacción y corrección de textos académicos.',
  },
  {
    id: 4,
    name: 'Dr. Luis Fernández',
    specialty: 'Estadística Aplicada',
    rating: 4.9,
    reviews: 203,
    available: true,
    location: 'Universidad Privada',
    price: '$60/hora',
    image: 'https://images.pexels.com/photos/5212317/pexels-photo-5212317.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Doctor en Estadística con amplia experiencia en análisis de datos para tesis.',
  },
];

interface AdvisorCardProps {
  advisor: any;
  onContact: () => void;
  onSchedule: () => void;
}

const AdvisorCard: React.FC<AdvisorCardProps> = ({ advisor, onContact, onSchedule }) => {
  return (
    <View style={styles.advisorCard}>
      <View style={styles.advisorHeader}>
        <Image source={{ uri: advisor.image }} style={styles.advisorImage} />
        <View style={styles.advisorInfo}>
          <Text style={styles.advisorName}>{advisor.name}</Text>
          <Text style={styles.advisorSpecialty}>{advisor.specialty}</Text>
          <View style={styles.ratingContainer}>
            <Star size={16} color="#FFD700" fill="#FFD700" />
            <Text style={styles.rating}>{advisor.rating}</Text>
            <Text style={styles.reviews}>({advisor.reviews} reviews)</Text>
          </View>
          <View style={styles.locationContainer}>
            <MapPin size={14} color="#666" />
            <Text style={styles.location}>{advisor.location}</Text>
          </View>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>{advisor.price}</Text>
          <View style={[
            styles.statusIndicator,
            { backgroundColor: advisor.available ? '#6FC309' : '#ff4444' }
          ]}>
            <Text style={styles.statusText}>
              {advisor.available ? 'Disponible' : 'Ocupado'}
            </Text>
          </View>
        </View>
      </View>
      
      <Text style={styles.advisorDescription}>{advisor.description}</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.contactButton]}
          onPress={onContact}
        >
          <MessageCircle size={18} color="#6FC309" />
          <Text style={styles.contactButtonText}>Contactar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.scheduleButton]}
          onPress={onSchedule}
          disabled={!advisor.available}
        >
          <Calendar size={18} color="#fff" />
          <Text style={styles.scheduleButtonText}>Agendar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function AdvisorsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredAdvisors, setFilteredAdvisors] = useState(advisors);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [messagingModalVisible, setMessagingModalVisible] = useState(false);
  const [selectedAdvisor, setSelectedAdvisor] = useState<any>(null);
  const router = useRouter();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = advisors.filter(advisor =>
      advisor.name.toLowerCase().includes(query.toLowerCase()) ||
      advisor.specialty.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredAdvisors(filtered);
  };

  const handleProfilePress = () => {
    router.push('/profile');
  };

  const handleContact = (advisor: any) => {
    setSelectedAdvisor(advisor);
    setMessagingModalVisible(true);
  };

  const handleSchedule = (advisor: any) => {
    setSelectedAdvisor(advisor);
    setPaymentModalVisible(true);
  };

  const handlePaymentSuccess = () => {
    Alert.alert(
      'Consulta Agendada',
      `Tu consulta con ${selectedAdvisor?.name} ha sido agendada exitosamente. Recibirás un email con los detalles.`
    );
  };

  return (
    <View style={styles.container}>
      <AppBar onProfilePress={handleProfilePress} />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Asesores</Text>
          <Text style={styles.headerSubtitle}>Encuentra el asesor perfecto para tu tesis</Text>
        </View>

        <View style={styles.searchContainer}>
          <Search size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar asesores..."
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {filteredAdvisors.map((advisor) => (
            <AdvisorCard
              key={advisor.id}
              advisor={advisor}
              onContact={() => handleContact(advisor)}
              onSchedule={() => handleSchedule(advisor)}
            />
          ))}
        </ScrollView>
      </View>

      <PaymentModal
        visible={paymentModalVisible}
        onClose={() => setPaymentModalVisible(false)}
        title="Agendar Consulta"
        amount={selectedAdvisor?.price || '$50/hora'}
        description={`Consulta con ${selectedAdvisor?.name || ''} - ${selectedAdvisor?.specialty || ''}`}
        onPaymentSuccess={handlePaymentSuccess}
      />

      <MessagingModal
        visible={messagingModalVisible}
        onClose={() => setMessagingModalVisible(false)}
        advisor={selectedAdvisor || { name: '', image: '', specialty: '' }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6FC309',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 20,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  advisorCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  advisorHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  advisorImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  advisorInfo: {
    flex: 1,
  },
  advisorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  advisorSpecialty: {
    fontSize: 14,
    color: '#6FC309',
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 4,
  },
  reviews: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6FC309',
    marginBottom: 8,
  },
  statusIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  advisorDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  contactButton: {
    backgroundColor: '#f0f9e8',
    borderWidth: 1,
    borderColor: '#6FC309',
  },
  scheduleButton: {
    backgroundColor: '#6FC309',
  },
  contactButtonText: {
    color: '#6FC309',
    fontWeight: 'bold',
    marginLeft: 6,
  },
  scheduleButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 6,
  },
});