import React, { useState, useEffect } from "react";
import { View, Text, Switch, Button, StyleSheet } from "react-native";
import {AsyncStorage} from 'react-native';

const SettingsScreen = () => {
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [soundVolume, setSoundVolume] = useState(50);

  // Charger les paramètres 
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const music = await AsyncStorage.getItem("musicEnabled");
        const volume = await AsyncStorage.getItem("soundVolume");
        if (music !== null) setMusicEnabled(music === "true");
        if (volume !== null) setSoundVolume(Number(volume));
      } catch (error) {
        console.log("Erreur", error);
      }
    };
    loadSettings();
  }, []);
// Sauvegarder les paramètres
  const saveSettings = async () => {
    try {
      await AsyncStorage.setItem("musicEnabled", JSON.stringify(musicEnabled));
      await AsyncStorage.setItem("soundVolume", soundVolume.toString());
      alert("Paramètres enregistrés !");
    } catch (error) {
      console.log("Erreur lors de la sauvegarde des paramètres", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Paramètres du jeu</Text>

      <View style={styles.setting}>
        <Text>Activer la musique</Text>
        <Switch value={musicEnabled} onValueChange={setMusicEnabled} />
      </View>

      <View style={styles.setting}>
        <Text>Volume du son : {soundVolume}</Text>
        <Button title="-" onPress={() => setSoundVolume(Math.max(0, soundVolume - 10))} />
        <Button title="+" onPress={() => setSoundVolume(Math.min(100, soundVolume + 10))} />
      </View>

      <Button title="Sauvegarder" onPress={saveSettings} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  setting: { flexDirection: "row", alignItems: "center", marginVertical: 10, gap: 10 },
});
export default SettingsScreen;