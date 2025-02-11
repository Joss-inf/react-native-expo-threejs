import React, { useRef, useEffect, useState } from "react";
import { View, PanResponder, GestureResponderEvent, PanResponderGestureState } from "react-native";
import { Canvas, useFrame } from "@react-three/fiber/native";
import * as THREE from "three";

type Position = [number, number, number];

type PlatformProps = {
  position: Position;
  color: number;
};

type PlayerProps = {
  position: Position;
};

const speed = 0.4;
const platformWidth = 10;
const platformDepth = 10;

const Platform: React.FC<PlatformProps> = ({ position, color }) => (
  <mesh position={position}>
    <boxGeometry args={[platformWidth, 1, platformDepth]} />
    <meshStandardMaterial color={color} />
  </mesh>
);

const Windows: React.FC<PlatformProps> = ({ position, color }) => (
  <mesh position={position}>
    <boxGeometry args={[platformWidth, 0.2, platformDepth / 3]} />
    <meshStandardMaterial color={color} />
  </mesh>
);

const Player: React.FC<PlayerProps> = ({ position }) => {
  const ref = useRef<THREE.Mesh>(null);
  const velocity = useRef(new THREE.Vector3()).current;
  let lastSwipeX: number | null = null;

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_: GestureResponderEvent, gestureState: PanResponderGestureState) => {
      if (lastSwipeX !== null) {
        const deltaX = gestureState.moveX - lastSwipeX;
        if (deltaX > 10) velocity.x = speed;
        else if (deltaX < -10) velocity.x = -speed;
      }
      lastSwipeX = gestureState.moveX;
    },
    onPanResponderRelease: () => {
      velocity.x = 0;
      lastSwipeX = null;
    }
  });

  useFrame(() => {
    velocity.z = -speed;
    if (ref.current) {
      ref.current.position.add(velocity);
    }
  });

  return (
    <View {...panResponder.panHandlers} style={{ flex: 1, position: 'absolute', width: '100%', height: '100%' }}>
      <mesh ref={ref} position={position}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={0xff0000} />
      </mesh>
    </View>
  );
};

const Scene: React.FC = () => {
  const [platforms, setPlatforms] = useState<PlatformProps[]>([]);
  const [windows, setWindows] = useState<PlatformProps[]>([]);
  let lastPlatformZ = 0;

  useEffect(() => {
    const newPlatforms: PlatformProps[] = [];
    const newWindows: PlatformProps[] = [];
    for (let i = 0; i < 10; i++) {
      newPlatforms.push({ position: [0, -0.5, -i * platformDepth], color: 0x808080 });
      if (i % 4 === 0) newWindows.push({ position: [0, 0.1, -i * platformDepth - platformDepth], color: 0x00ff00 });
    }
    setPlatforms(newPlatforms);
    setWindows(newWindows);
  }, []);

  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 7.5]} />
      {platforms.map((p, i) => (
        <Platform key={i} position={p.position} color={p.color} />
      ))}
      {windows.map((w, i) => (
        <Windows key={i} position={w.position} color={w.color} />
      ))}
      <Player position={[0, 0.5, 0]} />
    </Canvas>
  );
};

const App: React.FC = () => {
  return (
    <View style={{ flex: 1 }}>
      <Scene />
    </View>
  );
};

export default App;