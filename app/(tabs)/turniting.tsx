import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { Upload, File, CircleCheck as CheckCircle, Clock, CircleAlert as AlertCircle, X } from 'lucide-react-native';
import { AppBar } from '@/components/AppBar';
import { PaymentModal } from '@/components/PaymentModal';
import { useRouter } from 'expo-router';

interface DocumentFile {
  id: string;
  name: string;
  type: string;
  size: number;
  uri: string;
  status: 'uploading' | 'success' | 'error';
  uploadProgress?: number;
}

export default function TurnitingScreen() {
  const [documents, setDocuments] = useState<DocumentFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const router = useRouter();

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return '#e74c3c';
    if (type.includes('word') || type.includes('doc')) return '#2980b9';
    if (type.includes('text')) return '#27ae60';
    return '#95a5a6';
  };

  const handleProfilePress = () => {
    router.push('/profile');
  };

  const pickDocument = async () => {
    // Show payment modal first
    setPaymentModalVisible(true);
  };

  const handlePaymentSuccess = async () => {
    // After successful payment, proceed with document selection
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const newDocument: DocumentFile = {
          id: Date.now().toString(),
          name: asset.name,
          type: asset.mimeType || 'unknown',
          size: asset.size || 0,
          uri: asset.uri,
          status: 'uploading',
          uploadProgress: 0,
        };

        setDocuments(prev => [...prev, newDocument]);
        simulateUpload(newDocument.id);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo seleccionar el documento');
    }
  };

  const handleUploadDocument = () => {
    setPaymentModalVisible(true);
  };

  const simulateUpload = (documentId: string) => {
    setIsUploading(true);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setDocuments(prev => 
        prev.map(doc => {
          if (doc.id === documentId) {
            const newProgress = (doc.uploadProgress || 0) + 10;
            if (newProgress >= 100) {
              clearInterval(interval);
              setIsUploading(false);
              return { ...doc, status: 'success', uploadProgress: 100 };
            }
            return { ...doc, uploadProgress: newProgress };
          }
          return doc;
        })
      );
    }, 200);
  };

  const removeDocument = (documentId: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== documentId));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'uploading':
        return <Clock size={20} color="#f39c12" />;
      case 'success':
        return <CheckCircle size={20} color="#27ae60" />;
      case 'error':
        return <AlertCircle size={20} color="#e74c3c" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'uploading':
        return 'Subiendo...';
      case 'success':
        return 'Completado';
      case 'error':
        return 'Error';
      default:
        return '';
    }
  };

  return (
    <View style={styles.container}>
      <AppBar onProfilePress={handleProfilePress} />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Turniting</Text>
          <Text style={styles.headerSubtitle}>Sube tus documentos para revisión</Text>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.uploadSection}>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={handleUploadDocument}
              disabled={isUploading}
            >
              <Upload size={48} color="#6FC309" />
              <Text style={styles.uploadButtonText}>
                {isUploading ? 'Subiendo...' : 'Seleccionar Documento'}
              </Text>
              <Text style={styles.uploadButtonSubtext}>
                PDF, Word, o texto plano
              </Text>
            </TouchableOpacity>
          </View>

          {documents.length > 0 && (
            <View style={styles.documentsSection}>
              <Text style={styles.sectionTitle}>Documentos Subidos</Text>
            
              {documents.map((doc) => (
                <View key={doc.id} style={styles.documentCard}>
                  <View style={styles.documentHeader}>
                    <View style={styles.documentInfo}>
                      <File size={24} color={getFileIcon(doc.type)} />
                      <View style={styles.documentDetails}>
                        <Text style={styles.documentName} numberOfLines={1}>
                          {doc.name}
                        </Text>
                        <Text style={styles.documentSize}>
                          {formatFileSize(doc.size)}
                        </Text>
                      </View>
                    </View>
                  
                    <View style={styles.documentActions}>
                      <View style={styles.statusContainer}>
                        {getStatusIcon(doc.status)}
                        <Text style={styles.statusText}>
                          {getStatusText(doc.status)}
                        </Text>
                      </View>
                    
                      <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => removeDocument(doc.id)}
                      >
                        <X size={18} color="#666" />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {doc.status === 'uploading' && (
                    <View style={styles.progressContainer}>
                      <View style={styles.progressBar}>
                        <View
                          style={[
                            styles.progressFill,
                            { width: `${doc.uploadProgress || 0}%` }
                          ]}
                        />
                      </View>
                      <Text style={styles.progressText}>
                        {doc.uploadProgress || 0}%
                      </Text>
                    </View>
                  )}

                  {doc.status === 'success' && (
                    <View style={styles.successContainer}>
                      <CheckCircle size={16} color="#27ae60" />
                      <Text style={styles.successText}>
                        Documento subido exitosamente
                      </Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}

          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>Información Importante</Text>
            <View style={styles.infoItem}>
              <Text style={styles.infoText}>
                • Costo por análisis: $25 USD
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoText}>
                • Tamaño máximo por archivo: 10MB
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoText}>
                • Formatos soportados: PDF, Word, TXT
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoText}>
                • Los documentos son revisados por plagio automáticamente
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoText}>
                • Recibirás un reporte detallado en 24-48 horas
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>

      <PaymentModal
        visible={paymentModalVisible}
        onClose={() => setPaymentModalVisible(false)}
        title="Análisis de Documento"
        amount="$25 USD"
        description="Análisis completo de plagio y originalidad"
        onPaymentSuccess={handlePaymentSuccess}
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
  scrollView: {
    flex: 1,
  },
  uploadSection: {
    padding: 20,
  },
  uploadButton: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#6FC309',
    borderStyle: 'dashed',
  },
  uploadButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6FC309',
    marginTop: 12,
  },
  uploadButtonSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  documentsSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  documentCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  documentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  documentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  documentDetails: {
    marginLeft: 12,
    flex: 1,
  },
  documentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  documentSize: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  documentActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  statusText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  removeButton: {
    padding: 4,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6FC309',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    minWidth: 35,
  },
  successContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  successText: {
    fontSize: 14,
    color: '#27ae60',
    marginLeft: 6,
  },
  infoSection: {
    padding: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  infoItem: {
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});