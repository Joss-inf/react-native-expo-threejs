import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, Button } from 'react-native';
import { useRouter } from 'expo-router';

interface Item {
  id: string;
  name: string;
  description: string;
 
}

const InventoryScreen = () => {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const router = useRouter();

  // Liste d'objets de l'inventaire
  const inventory: Item[] = [
    {
      id: '1',
      name: 'The Intergalactic Dumpster ',
      description: 'It doesn t abduct cows, it just collects trash from every corner of the universe. Might as well take some human souls while it s at it.',
       
    },
    {
      id: '2',
      name: 'The Void Walker',
      description: 'ts existence is a cruel reminder that there’s something worse than being alone in the dark… being watched by something in ite menaces invisibles .',
    },
    {
      id: '3',
      name: 'The Dark Sasuke',
      description: 't shows up at night, takes a bite of your dreams, and leaves you with an empty feeling. No one knows what it s really after… probably just your sanity.',
    },
    {
      id: '4',
      name: 'The Mind Eraser',
      description: 'f it’s not erasing your memories, it’s messing with them. Who needs an abduction when you can have your own brain wiped clean?',
    
    },
    
  ];

  // Afficher les détails de l'objet sélectionné 
  const handleItemPress = (item: Item) => {
    setSelectedItem(item);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedItem(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>inventory</Text>

      {/* Liste des objets de l'inventaire */}
      <FlatList
        data={inventory}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.itemName}
            onPress={() => handleItemPress(item)}
          >
            <Text style={styles.itemName}>{item.name}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
      />

      {/* afficher les détails de l'objet */}
      {selectedItem && (
        <Modal
          visible={isModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={handleCloseModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{selectedItem.name}</Text>
              <Text style={styles.modalDescription}>{selectedItem.description}</Text>
              <Button title="Fermer" onPress={handleCloseModal} />
            </View>
          </View>
        </Modal>
      )}
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
  itemName: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#B4DEB8',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },

  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#e1e1e1',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 16,
    marginBottom: 20,
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
    fontSize: 15,
  }
});

export default InventoryScreen;
