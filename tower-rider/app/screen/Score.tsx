import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
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

      {/* Conteneur global pour tous les scores */}
      <View style={styles.scoreListContainer}>
        <FlatList
          data={scores}
          renderItem={({ item, index }) => (
            <View style={styles.scoreRow}>
              <Text style={styles.rank}>{index + 1}.</Text>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.score}>{item.score} pts</Text>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#B0E7F5'
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
  },
  // Conteneur qui enveloppe tous les scores
  scoreListContainer: {
    backgroundColor: '#B4DEB8', // Fond bleu nuit
    borderRadius: 10, // Coins arrondis
    padding: 15, // Espacement interne
    width: '100%', // Occuper toute la largeur
    marginVertical: 20, // Espacement entre les autres éléments
    shadowColor: '#000', // Ombre du conteneur
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
    elevation: 5, // Ombre sous Android
  },
  // Style de chaque ligne (score individuel)
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
    color: '#ffffff', // Texte en blanc
  },
  name: {
    fontSize: 18,
    color: '#ffffff', // Texte en blanc
  },
  score: {
    fontSize: 18,
    color: '#ffffff', // Texte en blanc
  },
  backhButton:{
    width: '48%',  
    paddingVertical: 10,  
    borderRadius: 10, 
    backgroundColor: '#FFC2D8',  
    justifyContent: 'center',  
    alignItems: 'center',
},
backhText:{}

  
});

export default ScoreScreen;