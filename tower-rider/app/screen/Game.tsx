import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, PanResponder } from 'react-native';
import { GLView } from 'expo-gl';
import * as THREE from 'three';
import { Renderer } from 'expo-three';

const useSwipe = () => {
  const [direction, setDirection] = useState(null);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderRelease: (_, gesture) => {
      if (Math.abs(gesture.dx) > 50) {
        setDirection(gesture.dx > 0 ? 'right' : 'left');
      }
    },
  });

  return { panHandlers: panResponder.panHandlers, direction, setDirection };
};

const GameScene = () => {
  const glViewRef = useRef(null);
  const { panHandlers, direction, setDirection } = useSwipe();
  const sceneRef = useRef(null);
  const cubeRef = useRef(null);
  const cameraRef = useRef(null);
  const platformSegmentsRef = useRef([]);
  const lastPlatformZRef = useRef(0);
  const nextWindowCounterRef = useRef(0);
  const animationRef = useRef(null);
  const currentLaneRef = useRef(1); // 0: gauche, 1: centre, 2: droite

  // Constantes
  const PLATFORM_WIDTH = 10;
  const PLATFORM_DEPTH = 10;
  const INITIAL_SEGMENTS = 20;
  const generationDistance = 450;
  const SPEED = 0.3;
  const GRAVITY = -0.01;
  const LANE_POSITIONS = [-3, 0, 3]; // Positions x pour les 3 colonnes

  const onContextCreate = async (gl) => {
    // Création de la scène
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB);
    sceneRef.current = scene;

    // Caméra
    const camera = new THREE.PerspectiveCamera(
      75,
      gl.drawingBufferWidth / gl.drawingBufferHeight,
      0.1,
      1000
    );
    camera.position.set(0, 13.4, 9);
    cameraRef.current = camera;

    // Renderer
    const renderer = new Renderer({ gl });
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);

    // Lumière
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 10, 7.5);
    scene.add(light);

    // Création du cube (joueur)
    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
    const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(LANE_POSITIONS[1], 0.5, 0); // Position initiale au centre
    cube.castShadow = true;
    scene.add(cube);
    cubeRef.current = cube;

    // Initialisation des plateformes
    platformSegmentsRef.current = [];
    lastPlatformZRef.current = 0;
    nextWindowCounterRef.current = 0;

    // Création des plateformes initiales
    for (let i = -1; i < INITIAL_SEGMENTS; i++) {
      createPlatformSegment(-i * PLATFORM_DEPTH, scene);
    }

    // Animation
    const velocity = new THREE.Vector3();
    
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);

      const cube = cubeRef.current;
      const scene = sceneRef.current;
      const camera = cameraRef.current;

      // Mouvement du cube
      velocity.z = -SPEED;
      velocity.y += GRAVITY;
      cube.position.add(velocity);

      // Détection des collisions
      let onPlatform = false;
      const cubeBox = new THREE.Box3().setFromObject(cube);
      
      platformSegmentsRef.current.forEach(segment => {
        const platformBox = new THREE.Box3().setFromObject(segment.platformMesh);
        if (cubeBox.intersectsBox(platformBox)) {
          onPlatform = true;
          if (velocity.y < 0) {
            cube.position.y = platformBox.max.y + 0.5;
            velocity.y = 0;
          }
        }
      });

      // Mise à jour des plateformes
      updatePlatformSegments(scene);

      // Position de la caméra
      camera.position.set(cube.position.x, cube.position.y + 13.4, cube.position.z + 9);
      camera.lookAt(cube.position.x, cube.position.y + 6, cube.position.z);

      renderer.render(scene, camera);
      gl.endFrameEXP();
    };

    animate();
  };

  const createPlatformSegment = (zPosition, scene) => {
    const platformColor = 0x808080;
    const withWindow = nextWindowCounterRef.current === 4;
    
    if (withWindow) {
      nextWindowCounterRef.current = 0;
    } else {
      nextWindowCounterRef.current++;
    }

    // Plateforme principale
    const platformGeometry = new THREE.BoxGeometry(PLATFORM_WIDTH, 1, PLATFORM_DEPTH);
    const platformMaterial = new THREE.MeshStandardMaterial({ color: platformColor });
    const platformMesh = new THREE.Mesh(platformGeometry, platformMaterial);
    platformMesh.position.set(0, -0.5, zPosition);
    scene.add(platformMesh);

    // Fenêtre (si nécessaire)
    let windowMesh = null;
    if (withWindow) {
      const windowGeometry = new THREE.BoxGeometry(PLATFORM_WIDTH, 0.2, PLATFORM_DEPTH / 3);
      const windowMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
      windowMesh = new THREE.Mesh(windowGeometry, windowMaterial);
      windowMesh.position.set(0, 0.1, zPosition - PLATFORM_DEPTH);
      scene.add(windowMesh);
    }

    const segment = {
      platformMesh,
      windowMesh,
      z: zPosition,
      dispose: () => {
        scene.remove(platformMesh);
        if (windowMesh) scene.remove(windowMesh);
      },
      isVisible: () => {
        const offset = 18;
        return zPosition <= cubeRef.current.position.z + offset;
      }
    };

    platformSegmentsRef.current.push(segment);
    lastPlatformZRef.current = zPosition;
  };

  const updatePlatformSegments = (scene) => {
    // Supprimer les plateformes non visibles
    while (platformSegmentsRef.current.length > 0 && 
           !platformSegmentsRef.current[0].isVisible()) {
      const oldSegment = platformSegmentsRef.current.shift();
      oldSegment.dispose();
    }

    // Ajouter de nouvelles plateformes si nécessaire
    while (
      platformSegmentsRef.current.length === 0 ||
      platformSegmentsRef.current[platformSegmentsRef.current.length - 1].z > 
      cubeRef.current.position.z - generationDistance
    ) {
      createPlatformSegment(lastPlatformZRef.current - PLATFORM_DEPTH, scene);
    }
  };

  // Gestion des mouvements via les gestes - MODIFIÉ POUR 3 COLONNES
  useEffect(() => {
    if (!cubeRef.current || direction === null) return;

    const currentLane = currentLaneRef.current;
    let newLane = currentLane;

    if (direction === 'right' && currentLane < 2) {
      newLane = currentLane + 1;
    } else if (direction === 'left' && currentLane > 0) {
      newLane = currentLane - 1;
    }

    if (newLane !== currentLane) {
      cubeRef.current.position.x = LANE_POSITIONS[newLane];
      currentLaneRef.current = newLane;
    }

    setDirection(null);
  }, [direction]);

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      if (platformSegmentsRef.current) {
        platformSegmentsRef.current.forEach(segment => segment.dispose());
        platformSegmentsRef.current = [];
      }
    };
  }, []);

  return (
    <View style={styles.container} {...panHandlers}>
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