export enum TreeState {
  SCATTERED = 'SCATTERED',
  TREE_SHAPE = 'TREE_SHAPE',
}

export interface DualPosition {
  tree: [number, number, number];
  scatter: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  speed: number; // For floating animation
}

export interface OrnamentData extends DualPosition {
  type: 'box' | 'sphere';
  color: string;
}
