import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, PanResponder } from 'react-native';
import { GLView } from 'expo-gl';
import * as THREE from 'three';
import { Renderer } from 'expo-three';

// Hook pour gérer les gestes de balayage
const useSwipe = () => {
  const [direction, setDirection] = useState(null);  // État pour stocker la direction du swipe

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderRelease: (_, gesture) => {
      if (gesture.dx > 50) {
        setDirection('right');
      } else if (gesture.dx < -50) {
        setDirection('left');
      } else {
        setDirection(null);
      }
    },
  });

  return { panHandlers: panResponder.panHandlers, direction };
};

const GameScene = () => {
  const glViewRef = useRef(null);
  const { panHandlers, direction } = useSwipe(); // Utilisation du hook pour obtenir direction et handlers

  // Initialisation de la scène
  const onContextCreate = async (gl) => {
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

    // =======================
    // Définition des segments de plateformes
    // =======================
    class PlatformSegment {
      platformMesh;
      windowMesh;
      constructor(zPosition, platformColor, withWindow = false) {
        const platformGeometry = new THREE.BoxGeometry(PLATFORM_WIDTH, 1, PLATFORM_DEPTH);
        const platformMaterial = new THREE.MeshStandardMaterial({ color: platformColor });
        this.platformMesh = new THREE.Mesh(platformGeometry, platformMaterial);
        this.platformMesh.position.set(0, -0.5, zPosition);

        scene.add(this.platformMesh);

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

    // =======================
    // Constantes et variables globales
    // =======================
    const PLATFORM_WIDTH = 10;
    const PLATFORM_DEPTH = 10;
    const INITIAL_SEGMENTS = 20;
    const generationDistance = 450;
    let platformSegments = [];
    let lastPlatformZ = 0;
    let nextWindowCounter = 0;
    let nextPlatformColorToggle = true;

    function createPlatformSegment(zPosition) {
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

    for (let i = -1; i < INITIAL_SEGMENTS; i++) {
      createPlatformSegment(-i * PLATFORM_DEPTH);
    }

    // =======================
    // Création du cube (le joueur)
    // =======================
    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
    const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(0, 0.5, 0);
    cube.castShadow = true;
    scene.add(cube);

    // =======================
    // Variables de mouvement et physique
    // =======================
    const velocity = new THREE.Vector3();
    const SPEED = 0.3;
    const GRAVITY = -0.01;

    // =======================
    // Fonction d'animation
    // =======================
    const animate = () => {
      requestAnimationFrame(animate);

      velocity.z = -SPEED;
      velocity.y += GRAVITY;
      cube.position.add(velocity);

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

      updatePlatformSegments();

      camera.position.set(cube.position.x, cube.position.y + 13.4, cube.position.z + 9);
      camera.lookAt(cube.position.x, cube.position.y + 6, cube.position.z);

      renderer.render(scene, camera);
      gl.endFrameEXP(); // Terminer le rendu
    };

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

    // Détection des gestes de balayage
    useEffect(() => {
      if (direction === 'right') {
        cube.position.x += 1;  // Déplacer le cube vers la droite
      } else if (direction === 'left') {
        cube.position.x -= 1;  // Déplacer le cube vers la gauche
      }
    }, [direction]); // Appliquer les déplacements à chaque changement de direction

    animate();
  };

  return (
    <View style={styles.container} {...panHandlers}>  {/* Lier les handlers aux gestes */}
      <GLView style={styles.glView} ref={glViewRef} onContextCreate={onContextCreate} />
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
});

export default GameScene;
