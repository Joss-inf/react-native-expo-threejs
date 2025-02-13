import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';

const ContactScreen: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    if (!name || !email || !message) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }

    // Vérification basique de l'email
    if (!email.includes('@')) {
      Alert.alert('Erreur', 'Veuillez entrer une adresse email valide.');
      return;
    }

    // Simuler l'envoi des données
    Alert.alert('Succès', 'Votre message a été envoyé !');
    
    // Réinitialisation du formulaire
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nom :</Text>
      <TextInput
        style={styles.input}
        placeholder="Entrez votre nom"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Email :</Text>
      <TextInput
        style={styles.input}
        placeholder="Entrez votre email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <Text style={styles.label}>Message :</Text>
      <TextInput
        style={[styles.input, styles.textarea]}
        placeholder="Entrez votre message"
        value={message}
        onChangeText={setMessage}
        multiline
      />

      <Button title="Envoyer" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 15,
  },
  textarea: {
    height: 100,
    textAlignVertical: 'top',
  },
});

export default ContactScreen;