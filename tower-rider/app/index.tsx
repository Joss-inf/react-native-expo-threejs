import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Home = () : JSX.Element  => {
    return (
        <View style={styles.container}>
                <Text style={styles.title}>Tower Rider</Text>

                <TouchableOpacity style={styles.playButton} onPress={() => {}}>
                    <Text style={styles.buttonText}>Play</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.inventaryButton} onPress={() => {}}>
                    <Text style={styles.buttonText}>Inventary</Text>
                </TouchableOpacity>

                <View style={styles.buttonRow}>

                <TouchableOpacity style={styles.rankingButton} onPress={() => {}}>
                    <Text style={styles.buttonText}>Ranking</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.optionsButton} onPress={() => {}}>
                    <Text style={styles.buttonText}>Options</Text>
                </TouchableOpacity>
        </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center', 
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#B0E7F5'
    },

    title:{
        fontSize: 40,
        fontWeight: 'bold',
        marginBottom: 20,
        color: 'white',
    },

    buttonText: {
        fontSize: 23,
        fontWeight: 'bold',
        color: 'white',
    },

    playButton:{
        width: '80%',  
        paddingVertical: 10,  
        marginBottom: 10,  
        borderRadius: 10,  
        backgroundColor: '#FEC771',  
        justifyContent: 'center',  
        alignItems: 'center',},

    inventaryButton:{
        width: '80%',  
        paddingVertical: 10,  
        marginBottom: 10,  
        borderRadius: 10,  
        backgroundColor: '#B4DEB8',  
        justifyContent: 'center',  
        alignItems: 'center',
    },

    optionsButton:{
        width: '48%',  
        paddingVertical: 10,  
        borderRadius: 10,  
        backgroundColor: '#DFC5FE',  
        justifyContent: 'center', 
        alignItems: 'center',
    },

    rankingButton:{
        width: '48%',  
        paddingVertical: 10,  
        borderRadius: 10, 
        backgroundColor: '#FFC2D8',  
        justifyContent: 'center',  
        alignItems: 'center',
    },

    buttonRow: {
        flexDirection: 'row',  
        justifyContent: 'space-between', 
        width: '80%',  
        marginBottom: 10,  
    },
    
});

export default Home;