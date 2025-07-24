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
  Switch,
  SafeAreaView,
} from 'react-native';
import { User, Mail, Phone, MapPin, Settings, Bell, Shield, CircleHelp as HelpCircle, LogOut, UserPen as Edit, Star, Camera, UserPlus } from 'lucide-react-native';

export default function ProfileScreen() {
  const [isEditing, setIsEditing] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isAdvisor, setIsAdvisor] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: 'Juan Pérez',
    email: 'juan.perez@email.com',
    phone: '+57 300 123 4567',
    location: 'Bogotá, Colombia',
    university: 'Universidad Nacional',
    image: 'https://images.pexels.com/photos/5212324/pexels-photo-5212324.jpeg?auto=compress&cs=tinysrgb&w=400',
  });

  const handleSaveProfile = () => {
    setIsEditing(false);
    Alert.alert('Perfil actualizado', 'Tus cambios han sido guardados exitosamente');
  };

  const handleBecomeAdvisor = () => {
    Alert.alert(
      'Solicitar ser Asesor',
      'Tu solicitud será revisada por nuestro equipo. Te contactaremos en 24-48 horas.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Enviar Solicitud', onPress: () => {
          Alert.alert('Solicitud enviada', 'Hemos recibido tu solicitud para ser asesor');
        }},
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Cerrar Sesión', style: 'destructive', onPress: () => {
          // Implement logout logic
          Alert.alert('Sesión cerrada', 'Has cerrado sesión exitosamente');
        }},
      ]
    );
  };

  const MenuItem = ({ icon, title, onPress, showArrow = true, rightContent = null }: any) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuItemLeft}>
        {icon}
        <Text style={styles.menuItemTitle}>{title}</Text>
      </View>
      {rightContent || (showArrow && <Text style={styles.menuItemArrow}>›</Text>)}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Perfil</Text>
          <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
            <Edit size={24} color="#6FC309" />
          </TouchableOpacity>
        </View>

        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <Image source={{ uri: userInfo.image }} style={styles.profileImage} />
            {isEditing && (
              <TouchableOpacity style={styles.cameraButton}>
                <Camera size={20} color="#fff" />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.profileInfo}>
            {isEditing ? (
              <TextInput
                style={styles.editInput}
                value={userInfo.name}
                onChangeText={(text) => setUserInfo({...userInfo, name: text})}
                placeholder="Nombre completo"
              />
            ) : (
              <Text style={styles.profileName}>{userInfo.name}</Text>
            )}

            <View style={styles.profileDetails}>
              <View style={styles.detailItem}>
                <Mail size={16} color="#666" />
                {isEditing ? (
                  <TextInput
                    style={styles.editDetailInput}
                    value={userInfo.email}
                    onChangeText={(text) => setUserInfo({...userInfo, email: text})}
                    placeholder="Email"
                  />
                ) : (
                  <Text style={styles.detailText}>{userInfo.email}</Text>
                )}
              </View>

              <View style={styles.detailItem}>
                <Phone size={16} color="#666" />
                {isEditing ? (
                  <TextInput
                    style={styles.editDetailInput}
                    value={userInfo.phone}
                    onChangeText={(text) => setUserInfo({...userInfo, phone: text})}
                    placeholder="Teléfono"
                  />
                ) : (
                  <Text style={styles.detailText}>{userInfo.phone}</Text>
                )}
              </View>

              <View style={styles.detailItem}>
                <MapPin size={16} color="#666" />
                {isEditing ? (
                  <TextInput
                    style={styles.editDetailInput}
                    value={userInfo.location}
                    onChangeText={(text) => setUserInfo({...userInfo, location: text})}
                    placeholder="Ubicación"
                  />
                ) : (
                  <Text style={styles.detailText}>{userInfo.location}</Text>
                )}
              </View>
            </View>

            {isEditing && (
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
                <Text style={styles.saveButtonText}>Guardar Cambios</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {!isAdvisor && (
          <View style={styles.becomeAdvisorSection}>
            <TouchableOpacity style={styles.becomeAdvisorButton} onPress={handleBecomeAdvisor}>
              <UserPlus size={24} color="#6FC309" />
              <View style={styles.becomeAdvisorContent}>
                <Text style={styles.becomeAdvisorTitle}>Conviértete en Asesor</Text>
                <Text style={styles.becomeAdvisorSubtitle}>
                  Comparte tu conocimiento y ayuda a otros estudiantes
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.menuSection}>
          <MenuItem
            icon={<Bell size={20} color="#666" />}
            title="Notificaciones"
            onPress={() => {}}
            showArrow={false}
            rightContent={
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#ccc', true: '#6FC309' }}
                thumbColor={notificationsEnabled ? '#fff' : '#f4f3f4'}
              />
            }
          />

          <MenuItem
            icon={<Settings size={20} color="#666" />}
            title="Configuración"
            onPress={() => Alert.alert('Configuración', 'Próximamente disponible')}
          />

          <MenuItem
            icon={<Shield size={20} color="#666" />}
            title="Privacidad"
            onPress={() => Alert.alert('Privacidad', 'Próximamente disponible')}
          />

          <MenuItem
            icon={<HelpCircle size={20} color="#666" />}
            title="Ayuda y Soporte"
            onPress={() => Alert.alert('Ayuda', 'Próximamente disponible')}
          />

          <MenuItem
            icon={<Star size={20} color="#666" />}
            title="Calificar App"
            onPress={() => Alert.alert('Calificar', 'Próximamente disponible')}
          />

          <MenuItem
            icon={<LogOut size={20} color="#e74c3c" />}
            title="Cerrar Sesión"
            onPress={handleLogout}
            showArrow={false}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6FC309',
  },
  profileSection: {
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0f0f0',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#6FC309',
    borderRadius: 20,
    padding: 8,
    borderWidth: 3,
    borderColor: '#fff',
  },
  profileInfo: {
    alignItems: 'center',
    width: '100%',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  editInput: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#6FC309',
    paddingBottom: 4,
    marginBottom: 16,
    textAlign: 'center',
  },
  profileDetails: {
    width: '100%',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 12,
  },
  editDetailInput: {
    fontSize: 16,
    color: '#666',
    marginLeft: 12,
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 4,
  },
  saveButton: {
    backgroundColor: '#6FC309',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  becomeAdvisorSection: {
    margin: 20,
  },
  becomeAdvisorButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  becomeAdvisorContent: {
    marginLeft: 12,
    flex: 1,
  },
  becomeAdvisorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6FC309',
    marginBottom: 4,
  },
  becomeAdvisorSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  menuSection: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemTitle: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  menuItemArrow: {
    fontSize: 20,
    color: '#ccc',
  },
});