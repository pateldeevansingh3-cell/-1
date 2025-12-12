import React, { useMemo, useRef, useLayoutEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TreeState, DualPosition } from '../types';
import { COLORS, CONFIG } from '../constants';
import { generateOrnamentData } from '../utils/math';

interface OrnamentGroupProps {
  treeState: TreeState;
  type: 'sphere' | 'box';
  color: THREE.Color;
  count: number;
}

const OrnamentGroup: React.FC<OrnamentGroupProps> = ({ treeState, type, color, count }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Generate static data for this group
  const data = useMemo(() => generateOrnamentData(count), [count]);

  // Current morph factor state (0 to 1)
  const currentFactor = useRef(0);

  useLayoutEffect(() => {
    // Initial position set to prevent frame 0 glitch
    if (meshRef.current) {
        data.forEach((item, i) => {
            dummy.position.set(item.scatter[0], item.scatter[1], item.scatter[2]);
            dummy.scale.setScalar(item.scale);
            dummy.updateMatrix();
            meshRef.current!.setMatrixAt(i, dummy.matrix);
        });
        meshRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [data, dummy]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const targetFactor = treeState === TreeState.TREE_SHAPE ? 1 : 0;
    
    // Smooth damping for the global morph factor
    currentFactor.current = THREE.MathUtils.damp(
      currentFactor.current,
      targetFactor,
      type === 'box' ? 1.5 : 2.5, // Heavy boxes move slower than spheres
      delta
    );

    const time = state.clock.elapsedTime;
    const factor = currentFactor.current;

    data.forEach((item, i) => {
      // 1. Calculate blended position
      const px = THREE.MathUtils.lerp(item.scatter[0], item.tree[0], factor);
      const py = THREE.MathUtils.lerp(item.scatter[1], item.tree[1], factor);
      const pz = THREE.MathUtils.lerp(item.scatter[2], item.tree[2], factor);

      // 2. Add floating noise
      // Less floating when in tree shape (factor 1), more when scattered (factor 0)
      const floatIntensity = (1 - factor) * 0.5 + 0.05; 
      const noiseY = Math.sin(time * item.speed + i) * floatIntensity;
      const noiseRot = Math.cos(time * 0.5 + i) * 0.2 * (1 - factor);

      dummy.position.set(px, py + noiseY, pz);

      // 3. Rotation
      // Spin gently when scattered, align/stabilize when in tree
      dummy.rotation.set(
        item.rotation[0] + time * 0.1 * (1 - factor) + noiseRot,
        item.rotation[1] + time * 0.15 * (1 - factor),
        item.rotation[2] + time * 0.05 * (1 - factor) + noiseRot
      );

      // 4. Scale animation (pop in/out slightly on transition could be added, but keeping simple)
      dummy.scale.setScalar(item.scale);

      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} castShadow receiveShadow>
      {type === 'sphere' ? (
        <sphereGeometry args={[1, 32, 32]} />
      ) : (
        <boxGeometry args={[1.5, 1.5, 1.5]} />
      )}
      <meshStandardMaterial
        color={color}
        roughness={0.2}
        metalness={0.9}
        emissive={color}
        emissiveIntensity={0.2}
      />
    </instancedMesh>
  );
};

const Ornaments: React.FC<{ treeState: TreeState }> = ({ treeState }) => {
  return (
    <group>
      {/* Gold Baubles */}
      <OrnamentGroup 
        treeState={treeState} 
        type="sphere" 
        color={COLORS.GOLD} 
        count={80} 
      />
      {/* Warm White Lights/Spheres */}
      <OrnamentGroup 
        treeState={treeState} 
        type="sphere" 
        color={COLORS.WHITE_WARM} 
        count={50} 
      />
      {/* Emerald Gift Boxes */}
      <OrnamentGroup 
        treeState={treeState} 
        type="box" 
        color={COLORS.EMERALD_LIGHT} 
        count={40} 
      />
       {/* Dark Gold Gift Boxes */}
       <OrnamentGroup 
        treeState={treeState} 
        type="box" 
        color={COLORS.GOLD_WARM} 
        count={30} 
      />
    </group>
  );
};

export default Ornaments;
