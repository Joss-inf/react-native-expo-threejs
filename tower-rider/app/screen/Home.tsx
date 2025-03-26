import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from "expo-router";
import Ionicons from 'react-native-vector-icons/Ionicons';


const Home = () : JSX.Element  => {
    return (
        <View style={styles.container}>
                <Text style={styles.title}>Tower Rider</Text>

                <TouchableOpacity style={styles.playButton} onPress={() => router.push('/screen/Game')}>
                    <Text style={styles.buttonText}>Play</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.inventaryButton} onPress={() => router.push('/screen/inventory')}>
                    <Text style={styles.buttonText}>Inventary</Text>
                </TouchableOpacity>

                <View style={styles.buttonRow}>

                <TouchableOpacity style={styles.rankingButton} onPress={() => router.push('/screen/Score')}>
                    <Text style={styles.buttonText}>Ranking</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.contactButton} onPress={() => router.push('/screen/Contact')}>
                    <Text style={styles.buttonText}>Contact</Text>
                </TouchableOpacity>
        </View> 
                <TouchableOpacity style={styles.optionsButton} onPress={() => router.push('/screen/Settings')}>
                    <Ionicons name="settings" size={30} color="#a9a9a9" /> 
                </TouchableOpacity>
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

    contactButton:{
        width: '48%',  
        paddingVertical: 10,  
        borderRadius: 10,  
        backgroundColor: '#DFC5FE',  
        justifyContent: 'center', 
        alignItems: 'center',
    },

    optionsButton: {
        display: 'flex',
        justifyContent: 'flex-end'
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
    optionsbutton:{
        alignItems:"flex-end"
    }
    
});

export default Home;