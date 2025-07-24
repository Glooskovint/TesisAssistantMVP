import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { X, Send, Paperclip } from 'lucide-react-native';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'advisor';
  timestamp: Date;
}

interface MessagingModalProps {
  visible: boolean;
  onClose: () => void;
  advisor: {
    name: string;
    image: string;
    specialty: string;
  };
}

export const MessagingModal: React.FC<MessagingModalProps> = ({
  visible,
  onClose,
  advisor,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `¡Hola! Soy ${advisor.name}. ¿En qué puedo ayudarte con tu tesis?`,
      sender: 'advisor',
      timestamp: new Date(),
    },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (visible) {
      // Reset messages when modal opens
      setMessages([
        {
          id: '1',
          text: `¡Hola! Soy ${advisor.name}. ¿En qué puedo ayudarte con tu tesis?`,
          sender: 'advisor',
          timestamp: new Date(),
        },
      ]);
    }
  }, [visible, advisor.name]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');

    // Simulate advisor response
    setTimeout(() => {
      const advisorResponses = [
        'Perfecto, puedo ayudarte con eso. ¿Podrías contarme más detalles?',
        'Excelente pregunta. Te recomiendo que primero revisemos la estructura.',
        'Claro, ese es un tema muy importante en las tesis. ¿Ya tienes definida tu metodología?',
        'Me parece muy bien. ¿Te gustaría agendar una consulta para profundizar más?',
        'Entiendo tu preocupación. Es normal en esta etapa del proceso.',
      ];

      const randomResponse = advisorResponses[Math.floor(Math.random() * advisorResponses.length)];
      
      const advisorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        sender: 'advisor',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, advisorMessage]);
    }, 1000 + Math.random() * 2000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  useEffect(() => {
    // Scroll to bottom when new messages are added
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView 
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.advisorInfo}>
              <Image source={{ uri: advisor.image }} style={styles.advisorImage} />
              <View>
                <Text style={styles.advisorName}>{advisor.name}</Text>
                <Text style={styles.advisorSpecialty}>{advisor.specialty}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView 
            ref={scrollViewRef}
            style={styles.messagesContainer}
            showsVerticalScrollIndicator={false}
          >
            {messages.map((message) => (
              <View
                key={message.id}
                style={[
                  styles.messageContainer,
                  message.sender === 'user' ? styles.userMessage : styles.advisorMessage,
                ]}
              >
                <View
                  style={[
                    styles.messageBubble,
                    message.sender === 'user' ? styles.userBubble : styles.advisorBubble,
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      message.sender === 'user' ? styles.userText : styles.advisorText,
                    ]}
                  >
                    {message.text}
                  </Text>
                </View>
                <Text style={styles.timestamp}>{formatTime(message.timestamp)}</Text>
              </View>
            ))}
          </ScrollView>

          <View style={styles.inputContainer}>
            <TouchableOpacity style={styles.attachButton}>
              <Paperclip size={20} color="#666" />
            </TouchableOpacity>
            <TextInput
              style={styles.textInput}
              placeholder="Escribe un mensaje..."
              value={newMessage}
              onChangeText={setNewMessage}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[styles.sendButton, !newMessage.trim() && styles.sendButtonDisabled]}
              onPress={sendMessage}
              disabled={!newMessage.trim()}
            >
              <Send size={20} color={newMessage.trim() ? '#6FC309' : '#ccc'} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 50,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#f8f9fa',
  },
  advisorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  advisorImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  advisorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  advisorSpecialty: {
    fontSize: 12,
    color: '#6FC309',
  },
  closeButton: {
    padding: 5,
  },
  messagesContainer: {
    flex: 1,
    padding: 20,
  },
  messageContainer: {
    marginBottom: 15,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  advisorMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 18,
  },
  userBubble: {
    backgroundColor: '#6FC309',
    borderBottomRightRadius: 5,
  },
  advisorBubble: {
    backgroundColor: '#f0f0f0',
    borderBottomLeftRadius: 5,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  userText: {
    color: '#fff',
  },
  advisorText: {
    color: '#333',
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    marginHorizontal: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#f8f9fa',
  },
  attachButton: {
    padding: 10,
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 100,
    backgroundColor: '#fff',
  },
  sendButton: {
    padding: 10,
    marginLeft: 10,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});