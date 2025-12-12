import React, { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { TreeState } from '../types';
import { CONFIG, COLORS } from '../constants';
import { getTreePoint, getRandomSpherePoint } from '../utils/math';
import './shaders/FoliageMaterial'; // Register the material

interface TreeParticlesProps {
  treeState: TreeState;
}

const TreeParticles: React.FC<TreeParticlesProps> = ({ treeState }) => {
  const materialRef = useRef<any>(null);
  const { viewport } = useThree();

  // Target morph factor (0 for scattered, 1 for tree)
  const targetFactor = treeState === TreeState.TREE_SHAPE ? 1 : 0;

  // Generate Geometry Data once
  const { positions, scatterPositions, sizes, speeds } = useMemo(() => {
    const pos = new Float32Array(CONFIG.PARTICLE_COUNT * 3);
    const scat = new Float32Array(CONFIG.PARTICLE_COUNT * 3);
    const sz = new Float32Array(CONFIG.PARTICLE_COUNT);
    const sp = new Float32Array(CONFIG.PARTICLE_COUNT);

    for (let i = 0; i < CONFIG.PARTICLE_COUNT; i++) {
      // Tree position (Target)
      const tP = getTreePoint(CONFIG.TREE_HEIGHT, CONFIG.TREE_RADIUS);
      pos[i * 3] = tP[0];
      pos[i * 3 + 1] = tP[1];
      pos[i * 3 + 2] = tP[2];

      // Scatter position (Source)
      const sP = getRandomSpherePoint(CONFIG.SCATTER_RADIUS);
      scat[i * 3] = sP[0];
      scat[i * 3 + 1] = sP[1];
      scat[i * 3 + 2] = sP[2];

      // Attributes
      sz[i] = Math.random() * 0.5 + 0.5; // Size variation
      sp[i] = Math.random() * 1.0 + 0.2; // Speed/Frequency variation
    }

    return {
      positions: pos,
      scatterPositions: scat,
      sizes: sz,
      speeds: sp
    };
  }, []);

  useFrame((state, delta) => {
    if (materialRef.current) {
      // Smoothly interpolate current factor to target factor
      materialRef.current.uMorphFactor = THREE.MathUtils.damp(
        materialRef.current.uMorphFactor,
        targetFactor,
        2.0, // Lambda (speed)
        delta
      );

      materialRef.current.uTime = state.clock.elapsedTime;
      materialRef.current.uPixelRatio = Math.min(window.devicePixelRatio, 2);
    }
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aPosScatter"
          count={scatterPositions.length / 3}
          array={scatterPositions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aSize"
          count={sizes.length}
          array={sizes}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-aSpeed"
          count={speeds.length}
          array={speeds}
          itemSize={1}
        />
      </bufferGeometry>
      <foliageMaterial
        ref={materialRef}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uColorBase={COLORS.EMERALD_DEEP}
        uColorHighlight={COLORS.GOLD}
      />
    </points>
  );
};

export default TreeParticles;