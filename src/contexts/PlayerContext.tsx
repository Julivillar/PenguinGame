import React, { createContext, useContext, useState, ReactNode } from 'react';

type PlayerContextType = {
  localPlayerId: string;
  setLocalPlayerId: (id: string) => void;
};

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const [localPlayerId, setLocalPlayerId] = useState('1'); // valor inicial de pruebas

  return (
    <PlayerContext.Provider value={{ localPlayerId, setLocalPlayerId }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) throw new Error('usePlayer debe usarse dentro de <PlayerProvider>');
  return context;
};
