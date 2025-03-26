import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';
import { useRouter } from 'expo-router';

interface ScoreList {
  score: number;
  name: string;
}

import scoresData from '../data/score.json'; // Charge directement le JSON comme un objet

const ScoreScreen = (): JSX.Element => {
  const router = useRouter();
  const [scores, setScores] = useState<ScoreList[]>([]);

  useEffect(() => {
    // Trier les scores et les stocker
    setScores([...scoresData].sort((a, b) => b.score - a.score));
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
        keyExtractor={(item, index) => index.toString()}
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