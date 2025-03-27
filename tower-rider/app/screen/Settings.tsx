import React, { useState, useEffect } from "react";
import { View, Text, Switch, StyleSheet, TouchableOpacity } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const SettingsScreen = () => {
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [soundVolume, setSoundVolume] = useState(50);
  const router = useRouter();

  // Charger les paramètres depuis AsyncStorage
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const music = await AsyncStorage.getItem("musicEnabled");
        const volume = await AsyncStorage.getItem("soundVolume");

        if (music !== null) setMusicEnabled(music === "true");
        if (volume !== null) setSoundVolume(Number(volume));
      } catch (error) {
        console.log("Error loading settings", error);
      }
    };

    loadSettings();
  }, []);

  // Sauvegarder les paramètres dans AsyncStorage
  const saveSettings = async () => {
    try {
      await AsyncStorage.setItem("musicEnabled", JSON.stringify(musicEnabled));
      await AsyncStorage.setItem("soundVolume", soundVolume.toString());
      alert("Settings saved!");
    } catch (error) {
      console.log("Error saving settings", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Options</Text>

      {/* Ajout d'une boîte pour contenir les paramètres */}
      <View style={styles.settingsBox}>
        <View style={styles.setting}>
          <Text style={styles.musicstart}>Enable music</Text>
          <Switch 
            value={musicEnabled} 
            onValueChange={setMusicEnabled} 
          />
        </View>

        <View style={styles.setting}>
          <Text style={styles.soundvo}>Sound Volume :  {soundVolume}</Text>
          <View style={styles.volumeControl}>
          <TouchableOpacity 
              onPress={() => setSoundVolume(Math.max(0, soundVolume - 10))}
            >
              <Text style={styles.volumeSign}>-</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => setSoundVolume(Math.min(100, soundVolume + 10))}
            >
              <Text style={styles.volumeSign}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
           <TouchableOpacity onPress={saveSettings} style={styles.saveyou}>
                <Text style={styles.saveme}>Save</Text>
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
  title: {
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 20,
    color: "white"
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
  setting: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    gap: 10,
  },
  volumeControl: {
    flexDirection: "row",
    gap: 10,
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
  musicstart:{
    fontSize: 18,
    color: 'white', 
    fontWeight: 'bold',
  },
  soundvo: {
    fontSize: 18,
    color: 'white', 
    fontWeight: 'bold',
  },
  saveyou: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveme: {
    color: "white",
    fontSize: 18,
    fontWeight: 'bold',
  },

  volumeSign: {
    fontSize: 18,
    color: 'white',  
    fontWeight: 'bold',
    padding: 10,
    backgroundColor: '#B4DEB8',  
    borderRadius: 10
},
});

export default SettingsScreen;
