import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from "expo-router";

const Home = () : JSX.Element  => {
    return (
        <View style={styles.container}>
                <Text style={styles.title}>Tower Rider</Text>

                <TouchableOpacity style={styles.playButton} onPress={() =>router.push("/app/screen/Game")}>
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
        backgroundColor: '#e6e6fa'
    },

    title:{
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#191970'
    },

    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
    },

    playButton:{
        width: '80%',  
        paddingVertical: 10,  
        marginBottom: 10,  
        borderRadius: 10,  
        backgroundColor: '#D3D3D3',  
        justifyContent: 'center',  
        alignItems: 'center',},

    inventaryButton:{
        width: '80%',  
        paddingVertical: 10,  
        marginBottom: 10,  
        borderRadius: 10,  
        backgroundColor: '#D3D3D3',  
        justifyContent: 'center',  
        alignItems: 'center',
    },

    optionsButton:{
        width: '48%',  
        paddingVertical: 10,  
        borderRadius: 10,  
        backgroundColor: '#D3D3D3',  
        justifyContent: 'center', 
        alignItems: 'center',
    },

    rankingButton:{
        width: '48%',  
        paddingVertical: 10,  
        borderRadius: 10, 
        backgroundColor: '#D3D3D3',  
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
