import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';
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
      <Text style={styles.title}>Ranking</Text>
      <View style={styles.scoreListContainer}>
        {scores.length > 0 ? (
          scores.map((score, index) => (
        
            <View key={index } style={styles.scoreRow}>
              <Text style={styles.name}>{score.name}</Text>
              <Text style={styles.score}>{score.score} m</Text>
            </View>
          ))
        ) : (
          <Text style={styles.title}>No scores available</Text>
        )}
        <TouchableOpacity style={styles.backhButton} onPress={() => router.back()}>
          <Text style={styles.backhText}>Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#B0E7F5'
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
  },
  scoreListContainer: {
    backgroundColor: '#B4DEB8', 
    borderRadius: 10, 
    padding: 15, 
    width: '100%', 
    marginVertical: 20, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2, 
  },
  scoreRow: {
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
    color: 'white',
  },
  name: {
    fontSize: 18,
    color: 'white', 
  },
  score: {
    fontSize: 18,
    color: 'white', 
  },
  backhButton:{
    width: '30%',  
    paddingVertical: 10,  
    borderRadius: 10, 
    backgroundColor: '#FEC771',  
    justifyContent: 'center',  
    alignItems: 'center',
},
backhText:{
  color: "white",
  fontWeight: 'bold',
  fontSize: 15
}

  
});

export default DisplayScores;
