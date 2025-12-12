import React, { useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Float } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { KernelSize, Resolution } from 'postprocessing';
import * as THREE from 'three';
import { TreeState } from '../types';
import TreeParticles from './TreeParticles';
import Ornaments from './Ornaments';

interface ExperienceProps {
  treeState: TreeState;
}

const Experience: React.FC<ExperienceProps> = ({ treeState }) => {
  const { camera } = useThree();
  const groupRef = useRef<THREE.Group>(null);

  // Slow rotation of the entire tree group for cinematic feel
  useFrame((state, delta) => {
    if (groupRef.current) {
        // Rotate faster when scattered, slower when settled
        const speed = treeState === TreeState.TREE_SHAPE ? 0.1 : 0.05;
        groupRef.current.rotation.y += delta * speed;
    }
  });

  return (
    <>
      <color attach="background" args={['#000504']} />
      
      <OrbitControls 
        makeDefault 
        minPolarAngle={0} 
        maxPolarAngle={Math.PI / 1.5}
        enablePan={false}
        minDistance={8}
        maxDistance={30}
      />

      {/* Lighting Setup */}
      <ambientLight intensity={0.2} color="#002A1F" />
      <pointLight position={[10, 10, 10]} intensity={1} color="#FFD700" />
      <pointLight position={[-10, 5, -10]} intensity={0.5} color="#ffffff" />
      <spotLight 
        position={[0, 20, 0]} 
        intensity={2} 
        angle={0.5} 
        penumbra={1} 
        color="#FFFDD0" 
        castShadow
      />

      {/* 
        Tree Geometry is centered at local 0 (extends from -6 to +6).
        Moving group to y=1 puts bottom at -5 and top at +7.
        This centers the visual mass better on mobile screens.
      */}
      <group ref={groupRef} position={[0, 1, 0]}>
        <TreeParticles treeState={treeState} />
        <Ornaments treeState={treeState} />
      </group>

      {/* Floor Shadows adjusted to match the new tree base height */}
      <ContactShadows 
        opacity={0.5} 
        scale={30} 
        blur={2} 
        far={10} 
        resolution={256} 
        color="#000000" 
        position={[0, -5.5, 0]}
      />

      {/* Environment for reflections */}
      <Environment preset="city" />

      {/* Post Processing for the "Arix Signature" Look */}
      <EffectComposer multisampling={0} disableNormalPass>
        <Bloom 
          intensity={1.5} 
          luminanceThreshold={0.6} // Only bright gold/white will bloom
          luminanceSmoothing={0.9} 
          kernelSize={KernelSize.LARGE}
        />
        <Vignette eskil={false} offset={0.1} darkness={0.6} />
      </EffectComposer>
    </>
  );
};

export default Experience;