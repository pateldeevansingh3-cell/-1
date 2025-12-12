import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Loader } from '@react-three/drei';
import Experience from './components/Experience';
import UIOverlay from './components/UIOverlay';
import { TreeState } from './types';

const App: React.FC = () => {
  const [treeState, setTreeState] = useState<TreeState>(TreeState.TREE_SHAPE);

  const toggleState = () => {
    setTreeState((prev) => 
      prev === TreeState.TREE_SHAPE ? TreeState.SCATTERED : TreeState.TREE_SHAPE
    );
  };

  return (
    <div className="relative w-full h-screen bg-black">
      <Suspense fallback={null}>
        <Canvas
          shadows
          dpr={[1, 2]}
          camera={{ position: [0, 0, 20], fov: 45 }}
          gl={{ antialias: false, toneMappingExposure: 1.2 }}
        >
          <Experience treeState={treeState} />
        </Canvas>
      </Suspense>
      
      <UIOverlay treeState={treeState} onToggle={toggleState} />
      
      <Loader 
        containerStyles={{ background: '#000504' }}
        innerStyles={{ width: '40vw', height: '2px', background: '#333' }}
        barStyles={{ height: '2px', background: '#D4AF37' }}
        dataInterpolation={(p) => `Loading Signature Collection ${p.toFixed(0)}%`}
        dataStyles={{ color: '#D4AF37', fontFamily: 'serif', fontSize: '14px', letterSpacing: '0.2em' }}
      />
    </div>
  );
};

export default App;
