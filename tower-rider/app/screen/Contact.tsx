import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Linking } from "react-native";
import { useRouter } from "expo-router"; // Pour naviguer entre les pages

const ContactScreen = () => {
  const router = useRouter(); // Permet de naviguer

  // Liste des réseaux sociaux
  const socialLinks = [
    { name: "Twitter", url: "https://twitter.com" },
    { name: "Facebook", url: "https://facebook.com" },
    { name: "Instagram", url: "https://instagram.com" },
    { name: "Discord", url: "https://discord.com" },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contactez-nous</Text>

      {/* Boutons pour chaque réseau social */}
      {socialLinks.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.button}
          onPress={() => Linking.openURL(item.url)}
        >
          <Text style={styles.buttonText}>{item.name}</Text>
        </TouchableOpacity>
      ))}

      {/* Bouton pour revenir à l'accueil */}
      <TouchableOpacity style={styles.homeButton} onPress={() => router.push("/home")}>
        <Text style={styles.buttonText}>Retour à l'accueil</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ContactScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1e1e1e",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#444",
    padding: 10,
    marginVertical: 10,
    borderRadius: 8,
    width: 200,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
  homeButton: {
    marginTop: 20,
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 8,
    width: 200,
    alignItems: "center",
  },
});
