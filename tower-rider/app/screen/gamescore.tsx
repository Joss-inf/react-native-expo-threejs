import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ScoreData {
  score: number;
  name: string;
}

interface GameScoreProps {
  gameOver: boolean;
  playerName: string;
  resetGame?: () => void; 
}

const GameScore: React.FC<GameScoreProps> = ({ gameOver, playerName, resetGame }) => {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      if (!gameOver) {
        setScore(prevScore => prevScore + 1);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [gameOver]);

  useEffect(() => {
    const loadHighScore = async () => {
      try {
        const savedScores = await AsyncStorage.getItem('scores');
        if (savedScores) {
          const scores = JSON.parse(savedScores) as ScoreData[];
          if (scores.length > 0) {
            setHighScore(scores[0].score);
          }
        }
      } catch (error) {
        console.error('Error loading high score:', error);
      }
    };

    loadHighScore();
  }, []);

  useEffect(() => {
    const saveScore = async () => {
      if (gameOver && score > 0) {
        try {
          const savedScores = await AsyncStorage.getItem('scores');
          const scoresData: ScoreData[] = savedScores ? JSON.parse(savedScores) : [];

          const newScore = { 
            score: score, 
            name: playerName || 'Anonymous' 
          };

          const updatedScores = [...scoresData, newScore]
            .sort((a, b) => b.score - a.score)
            .slice(0, 10); 

          await AsyncStorage.setItem('scores', JSON.stringify(updatedScores));

          router.push('/app/screen/Score');
        } catch (error) {
          console.error('Erreur de sauvegarde :', error);
        }
      }
    };

    saveScore();
  }, [gameOver, playerName, score, router, resetGame]);

  return (
    <View style={styles.scoreContainer}>
      <Text style={styles.scoreText}>Distance: {score} m</Text>
      {highScore > 0 && <Text style={styles.highScoreText}>Meilleur score: {highScore} m</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  scoreContainer: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 100,
  },
  scoreText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'black',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  highScoreText: {
    fontSize: 16,
    color: 'white',
    textShadowColor: 'black',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    marginTop: 5,
  },
});

export default GameScore;