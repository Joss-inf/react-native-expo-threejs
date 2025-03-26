mport React, { useRef, useState } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Text } from 'react-native';
import { GLView } from 'expo-gl';
import { THREE } from 'expo-three'; 
import { Renderer } from 'expo-three';
import { useRouter } from 'expo-router';

global.THREE = global.THREE || THREE;

const GameScene = () => {
  const glViewRef = useRef(null);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showPauseMenu, setShowPauseMenu] = useState(false);
  const animationRef = useRef(null);
  const animateRef = useRef<() => void>(); 
  const router = useRouter();

  const pauseGame = () => {
    setIsPaused(true);
    setShowPauseMenu(true);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null; 
    }
  };
  
  const resumeGame = () => {
    setIsPaused(false);
    setShowPauseMenu(false);
    
    if (animateRef.current && !animationRef.current) {
      animationRef.current = requestAnimationFrame(animateRef.current);
    }
  };

  const quitGame = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    router.replace('/screen/Home');
  };

  const onContextCreate = async (gl: { drawingBufferWidth: number; drawingBufferHeight: number; endFrameEXP: () => void; }) => {
    // Initialisation de la scène
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB); // Bleu ciel

    // Caméra
    const camera = new THREE.PerspectiveCamera(75, gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 1000);
    camera.position.set(0, 13.4, 9);

    // Renderer
    const renderer = new Renderer({ gl });
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);

    // Lumière
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 10, 7.5);
    scene.add(light);

    // =====================
    // Classe PlatformSegment
    // =====================
    class PlatformSegment {
      platformMesh: THREE.Mesh<THREE.BoxGeometry, THREE.MeshStandardMaterial, THREE.Object3DEventMap>;
      windowMesh: THREE.Mesh<THREE.BoxGeometry, THREE.MeshStandardMaterial, THREE.Object3DEventMap>;
      constructor(zPosition: number, platformColor: number, withWindow = false) {
        // Création de la plateforme
        const platformGeometry = new THREE.BoxGeometry(PLATFORM_WIDTH, 1, PLATFORM_DEPTH);
        const platformMaterial = new THREE.MeshStandardMaterial({ color: platformColor });
        this.platformMesh = new THREE.Mesh(platformGeometry, platformMaterial);
        this.platformMesh.position.set(0, -0.5, zPosition);

        scene.add(this.platformMesh);

        // Création optionnelle de la fenêtre (highlight)
        if (withWindow) {
          const windowGeometry = new THREE.BoxGeometry(PLATFORM_WIDTH, 0.2, PLATFORM_DEPTH / 3);
          const windowMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
          this.windowMesh = new THREE.Mesh(windowGeometry, windowMaterial);
          this.windowMesh.position.set(0, 0.1, zPosition - PLATFORM_DEPTH);
          scene.add(this.windowMesh);
        } else {
          this.windowMesh = null;
        }
      }

      isVisible() {
        const offset = 18;
        return this.platformMesh.position.z <= cube.position.z + offset;
      }

      dispose() {
        scene.remove(this.platformMesh);
        if (this.windowMesh) scene.remove(this.windowMesh);
      }

      get z() {
        return this.platformMesh.position.z;
      }
    }

    // =====================
    // Constantes et variables globales
    // =====================
    const PLATFORM_WIDTH = 10;
    const PLATFORM_DEPTH = 10;
    const INITIAL_SEGMENTS = 20;
    const generationDistance = 450;
    let platformSegments: any = [];
    let lastPlatformZ = 0;
    let nextWindowCounter = 0;
    let nextPlatformColorToggle = true;

    // =====================
    // Fonctions de création des segments
    // =====================
    function createPlatformSegment(zPosition: number) {
      const platformColor = 0x808080;
      nextPlatformColorToggle = !nextPlatformColorToggle;
      
      const withWindow = nextWindowCounter === 4;
      if (withWindow) {
        nextWindowCounter = 0;
      } else {
        nextWindowCounter++;
      }
      const segment = new PlatformSegment(zPosition, platformColor, withWindow);
      platformSegments.push(segment);
      lastPlatformZ = zPosition;
    }

    // Création des segments initiaux
    for (let i = -1; i < INITIAL_SEGMENTS; i++) {
      createPlatformSegment(-i * PLATFORM_DEPTH);
    }

    // =====================
    // Création du cube (le joueur)
    // =====================
    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
    const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(0, 0.5, 0);
    cube.castShadow = true;
    scene.add(cube);

    // =====================
    // Variables de mouvement et physique
    // =====================
    const velocity = new THREE.Vector3();
    const SPEED = 0.3;
    const GRAVITY = -0.01;

    // =====================
    // Fonction d'animation
    // =====================
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      if (isPaused) return;

      // Déplacement automatique vers l'avant
      velocity.z = -SPEED;
      velocity.y += GRAVITY;

      // Appliquer les mouvements
      cube.position.add(velocity);

      if (cube.position.y < -10 && !gameOver) {
        setGameOver(true);
      }

      // Vérification des collisions avec les plateformes
      let onPlatform = false;
      const cubeBox = new THREE.Box3().setFromObject(cube);
      for (const segment of platformSegments) {
        const platformBox = new THREE.Box3().setFromObject(segment.platformMesh);
        if (cubeBox.intersectsBox(platformBox)) {
          onPlatform = true;
          if (velocity.y < 0) {
            cube.position.y = platformBox.max.y + 0.5;
            velocity.y = 0;
          }
        }
      }

      // Mise à jour des segments
      updatePlatformSegments();

      // Positionnement de la caméra
      camera.position.set(cube.position.x, cube.position.y + 13.4, cube.position.z + 9);
      camera.lookAt(cube.position.x, cube.position.y + 6, cube.position.z);

      // Rendu
      renderer.render(scene, camera);
      gl.endFrameEXP();
    };

    // =====================
    // Mise à jour et nettoyage des segments de plateformes
    // =====================
    function updatePlatformSegments() {
      while (platformSegments.length > 0 && !platformSegments[0].isVisible()) {
        const oldSegment = platformSegments.shift();
        oldSegment.dispose();
      }

      while (
        platformSegments.length === 0 || 
        platformSegments[platformSegments.length - 1].z > cube.position.z - generationDistance
      ) {
        createPlatformSegment(lastPlatformZ - PLATFORM_DEPTH);
      }
    }

    animateRef.current = animate; 
    animationRef.current = requestAnimationFrame(animate);

  };

  return (
    <View style={styles.container}>
      <GLView style={styles.glView} ref={glViewRef} onContextCreate={onContextCreate} />
      
      {/* Bouton Pause */}
      <TouchableOpacity style={styles.pauseButton} onPress={pauseGame}>
        <Text style={styles.pauseButtonText}>II</Text>
      </TouchableOpacity>
      
      {/* Menu Pause */}
      <Modal
        visible={showPauseMenu}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowPauseMenu(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.pauseMenu}>
            <Text style={styles.pauseMenuTitle}>GAME OVER</Text>
            
            <TouchableOpacity 
              style={styles.menuButton}
              onPress={quitGame}
            >
              <Text style={styles.menuButtonText}>Quit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glView: {
    width: '100%',
    height: '100%',
  },
  pauseButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 5,
  },
  pauseButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pauseMenu: {
    backgroundColor: '#B4DEB8',
    padding: 15,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  pauseMenuTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 20,
    color: "white"
  },
  menuButton: {
    backgroundColor: '#FFC2D8', 
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
  menuButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default GameScene;