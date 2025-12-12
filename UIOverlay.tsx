import React from 'react';
import { TreeState } from '../types';

interface UIOverlayProps {
  treeState: TreeState;
  onToggle: () => void;
}

const UIOverlay: React.FC<UIOverlayProps> = ({ treeState, onToggle }) => {
  const isTree = treeState === TreeState.TREE_SHAPE;

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-8 z-10">
      {/* Header */}
      <header className="flex flex-col items-center pt-4">
        <h1 className="text-arix-gold font-serif text-3xl md:text-5xl tracking-widest uppercase drop-shadow-lg">
          Arix Signature
        </h1>
        <div className="h-[1px] w-24 bg-arix-gold mt-4 opacity-70"></div>
      </header>

      {/* Footer Controls */}
      <footer className="flex flex-col items-center pb-12">
        <button
          onClick={onToggle}
          aria-label={isTree ? "Scatter Elements" : "Assemble Tree"}
          className={`
            pointer-events-auto
            group relative
            w-16 h-16 rounded-full
            flex items-center justify-center
            transition-all duration-500 ease-out
            border border-arix-gold/40
            hover:border-arix-gold
            hover:scale-110
            backdrop-blur-md
            bg-arix-emerald/20
          `}
        >
          <div className={`
            absolute inset-0 w-full h-full rounded-full bg-arix-gold/10 
            transform transition-transform duration-500 scale-0 group-hover:scale-100
          `}></div>
          
          <span className="relative z-10 text-arix-gold text-2xl transition-transform duration-500">
             {/* Simple Icon Logic: Star/Burst when tree (to scatter), Triangle/Tree when scattered (to assemble) */}
            {isTree ? '✦' : '▲'}
          </span>
        </button>

        <div className="mt-6 text-arix-gold/30 text-[10px] tracking-[0.3em] font-sans">
          EST. 2024
        </div>
      </footer>
    </div>
  );
};

export default UIOverlay;