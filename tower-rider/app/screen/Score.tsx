import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

interface ScoreData {
  score: number;
  name: string;
}

const DisplayScores = () => {
  const [scores, setScores] = useState<ScoreData[]>([]);

  useEffect(() => {
    const loadScores = async () => {
      try {
        const savedScores = await AsyncStorage.getItem('scores');
        if (savedScores) {
          const scoresData = JSON.parse(savedScores) as ScoreData[];
          setScores(scoresData);
        }
      } catch (error) {
        console.error('Error loading scores:', error);
      }
    };

    loadScores();
  }, []);

  return (
    <View style={styles.container}>
      {scores.length > 0 ? (
        scores.map((score, index) => (
          <Text key={index} style={styles.scoreText}>
            {score.name}: {score.score} m
          </Text>
        ))
      ) : (
        <Text style={styles.noScoresText}>No scores available</Text>
      )}
      <Button title="Home" onPress={() => router.replace('/')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 18,
    color: 'black',
  },
  noScoresText: {
    fontSize: 18,
    color: 'gray',
  },
});

export default DisplayScores;
