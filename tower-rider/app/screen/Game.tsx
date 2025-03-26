import React, { useRef, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { GLView } from 'expo-gl';
import * as THREE from 'three';
import { loadTextureAsync, Renderer } from 'expo-three';
import { Asset } from 'expo-asset';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';


const GameScene = () => {
  const glViewRef = useRef(null);
  const mixerRef = useRef(null);
  const onContextCreate = async (gl: { drawingBufferWidth: number; drawingBufferHeight: number; endFrameEXP: () => void; }) => {
    // Initialisation de la scène
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB); // Bleu ciel

    // Caméra
    const camera = new THREE.PerspectiveCamera(75, gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 1000);
    camera.position.set(50, 13.4, 9);
  
    // Renderer
    const renderer = new Renderer({ gl });
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);

    // Lumière
    const light = new THREE.DirectionalLight(0xffffff,2 );
    light.position.set(5, 10, 7.5)
    scene.add(light);
    const ambientLight = new THREE.AmbientLight(0xffffff, 2);
    scene.add(ambientLight);

    const loader = new GLTFLoader()

    // =====================
    // Constantes et variables globales
    // =====================

  // le game over
  let gameOver = false
  //liste des segments
  let platformSegments:any = [];
  const PLATFORM_WIDTH = 13.8;
  const PLATFORM_DEPTH = 10;

  //nombre de segment initial au lancement de la partie
  const INITIAL_SEGMENTS = 26;

  //la distance de génération des segments
  const generationDistance =  450;
  //distance du ciel du joueur
  const skyDistance = -150
  //distance a laquelle les obstacles et la plateforme ce supprime par rapport au joueur pour pouvoir decharger la memoire
  const offset = 18;
  //liste des  obstacles
  let obstacleList:any = [];
  //distance de plateforme entre les obstacles 
  const distanceBetweenObstacles = 4
  //distance des obstacles entre le mur et eux
  const obstacleY = 4
  //distance du joueur de la platforme
  const playerY = 3.9
  //montant du bonusAdditionneur pour le score
  let bonusAdditionner = 1
  //la mesh du bonus bouclier
  let shieldmesh:any

// Variables de mouvement et physique
const velocity = new THREE.Vector3();

//vitesse de départ
const SPEED = 0.5;

//vitesse maximal
const maxspeed = 10
 //addtion de vitesse par execution de boucle
 const acuSpeed = 0.00009
//gravité
const GRAVITY = -0.01;
//additionne le bonus
const bonusAdditionnerStatic = bonusAdditionner
  let score = 0

  //distance z de spawn de la plateforme
  let lastPlatformZ = 0;
//premet de creer l interval
  let nextWindowCounter = 0;
  

// =====================
// sky
// =====================

      const skytexture = await loadTextureAsync({ asset: require('../../assets/gameAsset/images/sky.png') });
      skytexture.minFilter = THREE.NearestFilter;
      skytexture.mapping = THREE.EquirectangularReflectionMapping;
      skytexture.wrapS = THREE.RepeatWrapping;
      skytexture.wrapT = THREE.RepeatWrapping;
      skytexture.encoding = THREE.sRGBEncoding;
      // Création de la sphère pour le ciel
      const geometry = new THREE.SphereGeometry(300, 15, 15);
      const material = new THREE.MeshBasicMaterial({
          map: skytexture,
          transparent: true,
          opacity:0.8,
          side: THREE.BackSide // On affiche l’intérieur
      });
    
      const skySphere = new THREE.Mesh(geometry, material);
     
      scene.add(skySphere);


// =====================
// Classe PlatformSegment
// =====================

const platformtexture = await loadTextureAsync({ asset: require('../../assets/gameAsset/images/tuile.png') });
platformtexture.minFilter = THREE.NearestFilter
const nmaptexture = await loadTextureAsync({ asset: require('../../assets/gameAsset/images/nmap.png') });
nmaptexture.repeat.set(1, 2)
class PlatformSegment {
  platformMesh: THREE.Mesh<THREE.BoxGeometry, THREE.MeshStandardMaterial, THREE.Object3DEventMap>;
  window: any;
  obstacles: never[];

  constructor(zPosition: number,  withWindow = false) {
    // Création de la plateforme
    const platformGeometry = new THREE.BoxGeometry(PLATFORM_WIDTH, 1, PLATFORM_DEPTH);
    const platformMaterial = new THREE.MeshStandardMaterial({
      map: platformtexture,
      envMap: skySphere.material.map,
      metalness:0.9,
      roughness:0,
      normalMap:nmaptexture
    });
    this.platformMesh = new THREE.Mesh(platformGeometry, platformMaterial);
    this.platformMesh.position.set(0, -0.5, zPosition);
    this.window = withWindow
    scene.add(this.platformMesh);
    this.obstacles = [];
    this.zPosition = zPosition;
    // Création optionnelle de la fenêtre (highlight)
    if (withWindow) {
      this.init();
    }
  }
 // Asynchronous initialization method for obstacles
 async init() {
  const obstacles = placeObstacle(); // Récupère les obstacles

  const obstaclePromises = obstacles.map(async (obs) => {
    const obstacleMesh = await createObstacle(obs.type, obs.model); // Charger le modèle
    let x = 0;
    if (obs.column === 1) x = -PLATFORM_WIDTH / 3;
    if (obs.column === 2) x = 0;
    if (obs.column === 3) x = PLATFORM_WIDTH / 3;

    // Position initiale
    obstacleMesh.position.set(x, obstacleY, this.zPosition);
    obstacleMesh.rotation.set(
      (Math.random() + 0.2) * 0.002, // X vitesse de rotation
      (Math.random() - 0.01) * 0.01, // Y
      (Math.random() - 0.01) * 0.001  // Z
    );

    // Ajouter à la scène
    scene.add(obstacleMesh);

    return {
      mesh: obstacleMesh,
      rotationVelocity: new THREE.Vector3(
        (Math.random() + 0.2) * 0.002, // X vitesse de rotation
        (Math.random() - 0.01) * 0.01, // Y
        (Math.random() - 0.01) * 0.001  // Z
      ),
      type: obs.type,
      name:obs.model.name,
    };
  });

  // Résout toutes les promesses et les ajoute directement à obstacleList
  obstacleList.push(...(await Promise.all(obstaclePromises)));
}
  // Méthode pour vérifier si le segment est hors de vue (derrière la caméra)
  isVisible() {
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
// Fonctions de création des segments
// =====================

function createPlatformSegment(zPosition: number,value = true) {
  
  // Créer une plateforme et ajouter une fenêtre tous les 5 segments
  let withWindow = nextWindowCounter === distanceBetweenObstacles;
  if (withWindow) {
    nextWindowCounter = 0;
  } else {
    nextWindowCounter++;
  }
  if(!value){
    withWindow = false
  }
  const segment = new PlatformSegment(zPosition,  withWindow);
  platformSegments.push(segment);
  lastPlatformZ = zPosition;
}

// Création des segments initiaux
for (let i =- 1; i < INITIAL_SEGMENTS; i++) {
  createPlatformSegment(-i * PLATFORM_DEPTH,false);
}

    // =====================
    // parametre des objets
    // =====================


    const modelPaths = {
      bonus: [
        
        { path: 'trashcan.glb', size: { x: 0.6, y: 0.6, z: 0.6 },name:'shield' },
        { path: 'Soda.glb', size: { x: 0.25, y: 0.25, z: 0.25 },name:'counter' },
      ],
      malus: [
        { path: 'chair1.glb', size: { x: 3, y: 3, z: 3 },name:'' },
        { path: 'chair2.glb', size: { x: 1.2, y: 1.2, z: 1.2},name:'' },
        { path: 'chair3.glb', size: { x: 1, y: 1, z: 1 },name:'' },
        { path: 'Drawer.glb', size: { x: 1.3, y: 1.3, z: 1.3 },name:'' },
        { path: 'cabinet.glb', size: { x: 2, y: 2, z: 2 },name:'' },
        { path: 'Monitor.glb', size: { x: 2, y: 2, z: 2 },name:'' },
      ]
    };
     // =====================
    // Fonction de création des obstacles 3D
    // =====================
    
    const  pathchair1 = Asset.fromModule(require("../../assets/gameAsset/objs/chair1.glb"));
     await pathchair1.downloadAsync();
    const  pathchair2 = Asset.fromModule(require("../../assets/gameAsset/objs/chair2.glb"));
    await pathchair2.downloadAsync();
    const pathchair3 = Asset.fromModule(require("../../assets/gameAsset/objs/chair3.glb"));
    await pathchair3.downloadAsync();
    const pathDrawer = Asset.fromModule(require("../../assets/gameAsset/objs/Drawer.glb"));
    await pathDrawer.downloadAsync();
    const  pathSoda = Asset.fromModule(require("../../assets/gameAsset/objs/Soda.glb"));
    await pathSoda.downloadAsync();
    const pathtrashcan = Asset.fromModule(require("../../assets/gameAsset/objs/trashcan.glb"));
    await pathtrashcan.downloadAsync();
    const pathcabinet = Asset.fromModule(require("../../assets/gameAsset/objs/cabinet.glb"));
    await pathcabinet.downloadAsync();
    const pathMonitor = Asset.fromModule(require("../../assets/gameAsset/objs/Monitor.glb"));
    await pathMonitor.downloadAsync();

    function createObstacle(type, model) {
      // Trouver le bon modèle et la taille selon le type et le modèle
      if (!model) {
        console.error('Modèle non trouvé pour', type);
        return null;
      }
      
      // Retourne une promesse qui résout l'objet mesh une fois le modèle chargé
      return new Promise(async (resolve, reject) => {
        let path = null
        if(model.path == "chair1.glb" ){
          path = pathchair1
        } if(model.path == "chair2.glb" ){
          path =pathchair2
        } if(model.path == "chair3.glb" ){
          path = pathchair3
        } if(model.path == "Drawer.glb" ){
          path = pathDrawer
        } if(model.path == "Soda.glb" ){
          path = pathSoda
        } if(model.path == "trashcan.glb" ){
          path = pathtrashcan
        } if(model.path == "cabinet.glb" ){
          path = pathcabinet
        } if(model.path == "Monitor.glb" ){
          path = pathMonitor
        }
 
        if (path == null)return null;
        loader.load(
          path.uri, // Le chemin du modèle
          (gltf:any) => {
            // Quand le modèle est chargé, récupère le mesh
            const obstacleMesh = gltf.scene;
    
            // Appliquer la taille du modèle
            obstacleMesh.scale.set(model.size.x, model.size.y, model.size.z);
            obstacleMesh.castShadow = true;
            obstacleMesh.metalness = 0.6;
    
            // Résoudre la promesse avec le mesh
            resolve(obstacleMesh);
          },
          undefined, // Callback de progression (si nécessaire)
          (error:any) => {
            // Si une erreur se produit lors du chargement, la promesse est rejetée
            reject(error);
          }
        );
      });
    }
      // =====================
    // calcul de probalité pour le spawn des objets
    // =====================
    function getRandomInt(max:number) {
      return Math.floor(Math.random() * max);
    }

    function placeObstacle() {
      let list = [
        { column: 1 },
        { column: 2 },
        { column: 3 }
      ];
    
      // On enlève un élément aléatoire
      list.splice(getRandomInt(list.length), 1);
    
      // On parcourt les colonnes restantes
      for (let i = 0; i < list.length; i++) {
        const random = getRandomInt(20); //luck

        if (random === 0) {
          // Bonus
          list[i].type = "bonus";
          const bonusModel = modelPaths.bonus[getRandomInt(modelPaths.bonus.length)]; // Sélectionner un modèle bonus aléatoire
          list[i].model = bonusModel; // Utiliser le modèle entier
        } else {
          // Malus
          list[i].type = "malus";
          const malusModel = modelPaths.malus[getRandomInt(modelPaths.malus.length)]; // Sélectionner un modèle malus aléatoire
          list[i].model = malusModel; // Utiliser le modèle entier
        }
      }

      return list;
    }

    // =====================
    // class de gestion des bonus
    // =====================

    class Bonus {
      shieldbonuscount: number;
      counterbonuscount: number;
      counterbonustimer: number;

      constructor(){

        this.counterbonustimer = 0
        this.shieldbonuscount = 0
        this.counterbonuscount = 0
      }

      checkBonusLifetime(){
        if(this.counterbonustimer > 0){
          this.counterbonustimer -= 1
        }else{
          bonusAdditionner = bonusAdditionnerStatic

        }

        if(!this.ShieldBonusAvailable() && shieldmesh){
          obstacleList.push({mesh:shieldmesh,rotationVelocity:{x:0,y:0,z:0},fallVelocity:0})
          shieldmesh = null

        }
      }

      applybonus(bonus,i){

        if(bonus.name == "counter"){  
          this.setCounterBonus()
        }else if (bonus.name == "shield"){
         const obs = obstacleList.splice(i,1)
          this.addShieldBonus(obs[0])

        }

      }
    
      addShieldBonus(bonus) {
        shieldmesh = bonus.mesh
        // Incrémenter le compteur de boucliers
        this.shieldbonuscount = 1;
      }
    
      reduceShieldBonus(){
        if(this.shieldbonuscount > 0){
          this.shieldbonuscount -= 1
          return 
        }

      }
    
      ShieldBonusAvailable(){
        if (this.shieldbonuscount > 0)return true
        return false
      }
    
      setCounterBonus(){
        this.counterbonustimer += 200
        this.counterbonuscount += 1
        bonusAdditionner += 1
      }
    }
    
    const bonus = new Bonus();

    // =====================
    // calcul  une valeur au hasard dans une plage donnée
    // =====================
    
    function getRandomFallVelocity(min, max) {
      return Math.random() * (max - min) + min;
    }
    
    
    // =====================
    // update des obstacles
    // =====================
    
    const mininimum = {
      min:0.2,
      max:0.35
    }
    const maximum = {
      min:0.4,
      max:0.5
    }
    const change = 0.4
    
    let min = mininimum.min
    let max  = mininimum.max
    let veloz:any
    function updateObstacles() {
        for(let i = 0 ; i< obstacleList.length; i++){

          const mesh = obstacleList[i].mesh;
          const rotationV =  obstacleList[i].rotationVelocity

          // Mise à jour de la rotation
          mesh.rotation.x += rotationV.x;
          mesh.rotation.y += rotationV.y;
          mesh.rotation.z += rotationV.z;
    
          // Mise à jour de la chute
      
          const fallV = getRandomFallVelocity(min , max );
    
          if(fallV < change ){
            min = maximum.min
            max = maximum.max
            veloz = velocity.z
            if(veloz != 0){
              obstacleList[i].fallVelocity = fallV* (veloz*-1)
            }else{
              obstacleList[i].fallVelocity = fallV
            }
           
          }else{
            min = mininimum.min
            max  = mininimum.max
            if(veloz != 0){
              obstacleList[i].fallVelocity = fallV* (veloz*-1)*1.2
            }else{
              obstacleList[i].fallVelocity = fallV
            }
          }

          mesh.position.z += obstacleList[i].fallVelocity;

      }
    }

// =====================
// Création du cube (sa hitbox) et du joueur
// =====================

const cubeGeometry = new THREE.BoxGeometry(1, 10, 1);
const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000,
  transparent:true,
  opacity:0

 });
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.set(0, 0.5, 0);
scene.add(cube);

let player:any

const p1 = Asset.fromModule(require('../../assets/gameAsset/objs/ovni.glb'));
await p1 .downloadAsync();
loader.load(p1.uri, (gltf:any) => {
  player = gltf.scene;
  player.rotation.x = -1.6
  player.rotation.y = -3.2
  player.scale.set(1, 1 ,1);
  scene.add(player);

}, undefined, (error:any) => {
  console.error('Erreur de chargement du modèle GLB:', error);
});
// =====================
// collision
// =====================
function checkCubePlatformCollision() {
  const cubeBox = new THREE.Box3().setFromObject(cube);
  for (const segment of platformSegments) {
    const platformBox = new THREE.Box3().setFromObject(segment.platformMesh);
    if (cubeBox.intersectsBox(platformBox)) {
      if (velocity.y < 0) {
        cube.position.y = platformBox.max.y + 4; // Ajuste la hauteur si besoin
        velocity.y = 0;
      }
      break; // On a trouvé une plateforme, pas besoin de continuer
    }
  }
  let i = 0
   for (const obstacle of obstacleList){
      const box = new THREE.Box3().setFromObject(obstacle.mesh)
      if (cubeBox.intersectsBox(box)){
        if(obstacle.type == "malus"){
          if(bonus.ShieldBonusAvailable()){
             bonus.reduceShieldBonus()
            obstacle.mesh.scale.set(0, 0, 0);
          }else{
            gameOver = true
          }
        }else if(obstacle.type == "bonus"){
          //appliquer le bonus
            bonus.applybonus(obstacle,i)
          if(obstacle.name != "shield"){
            obstacle.mesh.scale.set(0, 0, 0);
          }
        }
        break
      }
      i++
    }

}

// =====================
// Mise à jour et nettoyage des segments de plateformes
// =====================

function updatePlatformSegments() {
  // Suppression des segments derrière le cube
  while (platformSegments.length > 0 && !platformSegments[0].isVisible()) {
    const oldSegment = platformSegments.shift();
    oldSegment.dispose();
  }
  for (let i = 0 ; i< obstacleList.length ;i++){
      if(obstacleList[i].mesh.position.z >  cube.position.z + offset+10){
        const obs = obstacleList.splice(i,1)
         scene.remove(obs[0].mesh)
      }else{break}
  }

  while (
    platformSegments.length === 0 ||
    platformSegments[platformSegments.length - 1].z > cube.position.z - generationDistance
  ) {
    createPlatformSegment(lastPlatformZ - PLATFORM_DEPTH);
  }
}


// =====================
// fonction d update des valeurs
// =====================
function valueUpdate(delta:any){
    // Appliquer les mouvements
    if(velocity.z < maxspeed){
      velocity.z -= acuSpeed
    }
  velocity.y += GRAVITY;
  velocity.z*delta
  velocity.x*delta
  cube.position.add(velocity)
  skySphere.position.z = cube.position.z + skyDistance
    // relier le joueur  a la hitbox cube
      if(player){
        player.position.z = cube.position.z
        player.position.y = cube.position.y+playerY
        player.position.x = cube.position.x
        player.rotation.y += 0.01
      }
      if(shieldmesh){
        shieldmesh.position.z = cube.position.z
        shieldmesh.position.y = cube.position.y+playerY
        shieldmesh.position.x = cube.position.x
        shieldmesh.rotation.z = 0
        shieldmesh.rotation.y = 0
        shieldmesh.rotation.x = -11.8
      }
  if(gameOver){
   return
  }
}

// =====================
// valeur a init
// =====================

skySphere.rotation.y = 20
velocity.z -= SPEED
const clock = new THREE.Clock();
let delta = 0;

// =====================
// Fonction d'animation
// =====================

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      delta = clock.getDelta();
       //update de la rotation des obstacles
      updateObstacles()
      //on update des valeurs génériques
      valueUpdate(delta)
      // verification des bonus
      bonus.checkBonusLifetime()
      //Mise à jour des segments : suppression de ceux qui sont hors vue et ajout de nouveaux segments
      updatePlatformSegments();
     // Vérification des collisions avec les plateformes
     checkCubePlatformCollision()
  // Positionnement de la caméra pour suivre le cube
  camera.position.set(
    cube.position.x,
    cube.position.y+10+playerY ,
    cube.position.z
   );

  camera.lookAt(
    cube.position.x,
    cube.position.y ,
    cube.position.z
  );
    camera.rotation.x = 5.59
    camera.position.z += 5
      // Rendu
      renderer.render(scene, camera);
      gl.endFrameEXP(); // Terminer le rendu
    };
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