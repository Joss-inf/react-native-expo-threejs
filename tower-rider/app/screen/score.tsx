import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';
import { useRouter } from 'expo-router';

interface ScoreList {
  score: number;
  name: string;
}

const ScoreScreen = (): JSX.Element => {
  const router = useRouter();
  const [scores, setScores] = useState<ScoreList[]>([]);

  // Charger les scores depuis un fichier JSON local
  useEffect(() => {
    const loadScores = async () => {
      try {
        const response = await fetch(require('../assets/scores.json'));  // Charge le fichier JSON
        const data: ScoreList[] = await response.json();

        // Trier les scores par ordre décroissant
        const sortedScores = data.sort((a, b) => b.score - a.score);
        setScores(sortedScores);
      } catch (error) {
        console.error('Error loading scores:', error);
      }
    };

    loadScores();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leaderboard</Text>

      <FlatList
        data={scores}
        renderItem={({ item, index }) => (
          <View style={styles.scoreItem}>
            <Text style={styles.rank}>{index + 1}.</Text>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.score}>{item.score} pts</Text>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}  // Utilisation de l'index comme clé
      />

      <Button title="Home" onPress={() => router.replace('/')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  scoreItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  rank: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  name: {
    fontSize: 18,
  },
  score: {
    fontSize: 18,
  },
});

export default ScoreScreen;