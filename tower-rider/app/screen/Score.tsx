import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import { useRouter } from 'expo-router';

interface ScoreList {
  score: number;
  name: string;
}

import scoresData from '../data/score.json'; 
const ScoreScreen = (): JSX.Element => {
  const router = useRouter();
  const [scores, setScores] = useState<ScoreList[]>([]);

  useEffect(() => {
    
    setScores([...scoresData].sort((a, b) => b.score - a.score));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ranking</Text>

      {}
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

export default ScoreScreen;