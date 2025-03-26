import React, { useState, useEffect } from 'react'; 
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'; 
import { Audio } from 'expo-av'; 
import { Ionicons } from '@expo/vector-icons'; 

export default function App() {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Configuration audio pour éviter les problèmes sur iOS et Android
  useEffect(() => {
    async function setupAudio() {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true, // Permet de jouer le son même en mode silencieux sur iOS
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        playsInSilentModeAndroid: true, // Permet de jouer le son même en mode silencieux sur Android
      });
    }
    setupAudio();
  }, []);

  // Fonction qui joue ou met en pause la musique selon l'état actuel
  const playPauseSound = async () => {
    if (sound) { 
      if (isPlaying) { 
        await sound.pauseAsync(); // Met en pause la musique
      } else { 
        await sound.playAsync(); // Démarrer le son
      }
      setIsPlaying(!isPlaying); 
    } else {
      try {
        // Charger le son depuis le dossier assets/sound/
        console.log("Chargement du son...");
        const { sound: newSound } = await Audio.Sound.createAsync(
          require('../assets/sound/(Intro).mp3') // Chemin relatif correct 
        );

        console.log("Son chargé avec succès !");
        setSound(newSound);
        await newSound.setVolumeAsync(1.0); // Volume max
        await newSound.playAsync(); // Démarrer la lecture
        setIsPlaying(true); // Mise à jour de l'état
      } catch (error) {
        console.error('Erreur lors du chargement du son :', error);
      }
    }
  };

  return (
    <View style={styles.container}> 
      <Text style={styles.title}>Mon Son</Text> 

      <TouchableOpacity onPress={playPauseSound} style={styles.button}> 
        <Ionicons 
          name={isPlaying ? 'pause' : 'play'}  
          size={32}  
          color="white"  
        />
      </TouchableOpacity>
      
      <Text style={styles.status}>
        {isPlaying ? 'Lecture en cours...' : 'Prêt à jouer'} 
      </Text>
    </View>
  );
}

// Définition des styles 
const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#f5fcff', 
    padding: 20, 
  },
  title: {
    fontSize: 22, 
    fontWeight: 'bold', 
    marginBottom: 30, 
    color: '#333', 
  },
  button: {
    backgroundColor: '#3CBBB1', 
    padding: 20, 
    borderRadius: 50, 
    marginBottom: 20, 
  },
  status: {
    fontSize: 16, 
    color: '#666', 
    marginTop: 10, 
  },
});
