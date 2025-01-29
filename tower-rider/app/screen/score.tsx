import React from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';
import { useRouter } from 'expo-router';


interface scoreList {
  score:number
  id: number,
  name:string,
}

interface Props {
  scores: scoreList[];
}
const scores:scoreList[] = [
  { id: 1, name: 'Player1', score: 1500 },
  { id: 2, name: 'Player2', score: 1200 },
  { id: 3, name: 'Player3', score: 1100 },
  { id: 4, name: 'Player4', score: 900 },
  { id: 5, name: 'Player5', score: 800 },
];
const ScoreScreen = () : JSX.Element  => {
  const router = useRouter();

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
    backgroundColor: '#222',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  scoreItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#333',
    borderRadius: 10,
  },
  rank: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  name: {
    fontSize: 18,
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  score: {
    fontSize: 18,
    color: '#fff',
  },
});

export default ScoreScreen;
