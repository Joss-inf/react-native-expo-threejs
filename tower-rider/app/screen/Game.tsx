import React, { useRef, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { GLView } from 'expo-gl';
import * as THREE from 'three';
import { Renderer } from 'expo-three';

const GameScene = () => {
  const glViewRef = useRef(null);

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
      // Positionné juste en avant de la plateforme
      this.windowMesh.position.set(0, 0.1, zPosition - PLATFORM_DEPTH);
   
      scene.add(this.windowMesh);
    } else {
      this.windowMesh = null;
    }
  }

  // Méthode pour vérifier si le segment est hors de vue (derrière la caméra)
  isVisible() {
    const offset = 18; // marge à ajuster
    // La plateforme est considérée comme visible tant qu'elle se trouve devant ou assez proche du cube.
    return this.platformMesh.position.z <= cube.position.z + offset;
  }

  // Suppression des objets de la scène
  dispose() {
    scene.remove(this.platformMesh);
    if (this.windowMesh) scene.remove(this.windowMesh);
  }

  // Récupération de la position Z (pour le placement du prochain segment)
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
const generationDistance =  450;
let platformSegments:any = [];      // Tableau contenant tous les segments (plateforme + optionnellement une fenêtre)
let lastPlatformZ = 0;
let nextWindowCounter = 0;
let nextPlatformColorToggle = true;  // Pour alterner la couleur de la plateforme
// =====================
// Fonctions de création des segments
// =====================
function createPlatformSegment(zPosition: number) {
  // Ici, vous pouvez gérer la couleur et l'ajout éventuel d'une fenêtre
  const platformColor = 0x808080; // ou une alternance de couleurs
  nextPlatformColorToggle = !nextPlatformColorToggle;
  
  // Créer une plateforme et ajouter une fenêtre tous les 5 segments
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
for (let i =- 1; i < INITIAL_SEGMENTS; i++) {
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

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);

      // Déplacement automatique vers l'avant
  velocity.z = -SPEED;
  velocity.y += GRAVITY;

  // Appliquer les mouvements
  cube.position.add(velocity);

  // Vérification des collisions avec les plateformes
  let onPlatform = false;
  const cubeBox = new THREE.Box3().setFromObject(cube);
  for (const segment of platformSegments) {
    const platformBox = new THREE.Box3().setFromObject(segment.platformMesh);
    if (cubeBox.intersectsBox(platformBox)) {
      onPlatform = true;
      // Si le cube descend, le placer sur la plateforme
      if (velocity.y < 0) {
        cube.position.y = platformBox.max.y + 0.5;
        velocity.y = 0;
      }
    }
  }

  // Mise à jour des segments : suppression de ceux qui sont hors vue et ajout de nouveaux segments
  updatePlatformSegments();

  // Positionnement de la caméra pour suivre le cube
  camera.position.set(cube.position.x, cube.position.y + 13.4, cube.position.z + 9);
  camera.lookAt(cube.position.x, cube.position.y + 6, cube.position.z);

      // Rendu
      renderer.render(scene, camera);
      gl.endFrameEXP(); // Terminer le rendu
    };
// =====================
// Mise à jour et nettoyage des segments de plateformes
// =====================

function updatePlatformSegments() {
  // Suppression des segments derrière le cube
  while (platformSegments.length > 0 && !platformSegments[0].isVisible()) {
    const oldSegment = platformSegments.shift();
    oldSegment.dispose();
  }

  // Génération des nouveaux segments en avant du cube
  while (
    platformSegments.length === 0 || 
    platformSegments[platformSegments.length - 1].z > cube.position.z - generationDistance
  ) {
    createPlatformSegment(lastPlatformZ - PLATFORM_DEPTH);
  }
}
    animate();
  };


  return (
    <View style={styles.container}>
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





