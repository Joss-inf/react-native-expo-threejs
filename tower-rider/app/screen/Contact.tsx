import React, { useState } from 'react';
import {View,Text,TextInput,Alert,StyleSheet,TouchableOpacity,Modal,FlatList} from 'react-native';
import { useRouter } from 'expo-router';

const categories = ['Bugs', 'Autre', 'Suggestion', 'Feedback'];

const ContactScreen: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  const handleSubmit = () => {
    if (!name || !email || !message || !category) {
      Alert.alert('Error', 'Please fill in all the fields');
      return;
    }

    // Vérification basique de l'email
    if (!email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    // Simuler l'envoi des données
    Alert.alert('Success', 'Your message has been sent!');
    
    // Réinitialisation du formulaire
    setName('');
    setEmail('');
    setMessage('');
    setCategory('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contact</Text>
      <View style={styles.settingsBox}>
      <Text style={styles.label}>Name :</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Email :</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
       <Text style={styles.label}>Catégorie :</Text>
      <TouchableOpacity style={styles.dropdown} onPress={() => setModalVisible(true)}>
        <Text style={styles.dropdownText}>
          {category || 'Select a category...'}
        </Text>
      </TouchableOpacity>

      {/* Modal pour afficher la liste des catégories */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={categories}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    setCategory(item);
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      <Text style={styles.label}>Message :</Text>
      <TextInput
        style={[styles.input, styles.textarea]}
        placeholder="Enter your message"
        value={message}
        onChangeText={setMessage}
        multiline
      />

      <TouchableOpacity onPress={handleSubmit} style={styles.sendyou}>
          <Text style={styles.sendme}>Send</Text>
      </TouchableOpacity>
    </View>

      <TouchableOpacity style={styles.backhButton} onPress={() => router.back()}>
              <Text style={styles.backhText}>Home</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: '#B0E7F5'
  },
  settingsBox: {
    backgroundColor: '#B4DEB8', 
    borderRadius: 10, 
    padding: 15, 
    width: '80%', 
    marginVertical: 20, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2, 
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 20,
    color: "white"
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: "white",
    marginBottom: 5,
  },
  sendyou: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendme: {
    color: "white",
    fontSize: 18,
    fontWeight: 'bold',
  },
  backhButton: {
    width: '30%',
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#FEC771',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  backhText: {
    color: "white",
    fontSize: 15,
    fontWeight: 'bold'
  },
  input: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor:"#ddd",
    marginBottom: 15,
  },
  textarea: {
    height: 100,
    textAlignVertical: 'top',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  modalItemText: {
    fontSize: 16,
  },
  dropdown: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 15,
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
  },
});

export default ContactScreen;