import * as THREE from 'three';
import { CONFIG } from '../constants';
import { DualPosition } from '../types';

// Helper to get random point in sphere
export const getRandomSpherePoint = (radius: number): [number, number, number] => {
  const u = Math.random();
  const v = Math.random();
  const theta = 2 * Math.PI * u;
  const phi = Math.acos(2 * v - 1);
  const r = Math.cbrt(Math.random()) * radius;
  const sinPhi = Math.sin(phi);
  return [
    r * sinPhi * Math.cos(theta),
    r * sinPhi * Math.sin(theta),
    r * Math.cos(phi)
  ];
};

// Helper to get random point in cone (Tree shape)
// y goes from -height/2 to height/2 approximately
export const getTreePoint = (height: number, maxRadius: number, verticalBias = 1): [number, number, number] => {
  const y = Math.random() * height; // 0 to height
  // Normalize y to 0-1 (0 is bottom, 1 is top)
  const nY = y / height;
  
  // Radius decreases as we go up. Linear cone.
  const rAtY = maxRadius * (1 - nY);
  
  // Random point inside the circle at height y
  const angle = Math.random() * Math.PI * 2;
  const rRandom = Math.sqrt(Math.random()) * rAtY; // Uniform distribution in circle
  
  const x = Math.cos(angle) * rRandom;
  const z = Math.sin(angle) * rRandom;
  
  // Center the tree vertically
  return [x, y - height / 2, z];
};

export const generateOrnamentData = (count: number): DualPosition[] => {
  const data: DualPosition[] = [];
  for (let i = 0; i < count; i++) {
    data.push({
      tree: getTreePoint(CONFIG.TREE_HEIGHT, CONFIG.TREE_RADIUS * 0.9), // Slightly inside the leaves
      scatter: getRandomSpherePoint(CONFIG.SCATTER_RADIUS),
      rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
      scale: 0.2 + Math.random() * 0.3,
      speed: 0.5 + Math.random() * 1.5,
    });
  }
  return data;
};
