import React, { useState } from 'react';

interface PauseMenuProps {
  onResume: () => void;
  onQuit: () => void;
}

const PauseMenu: React.FC<PauseMenuProps> = ({ onResume, onQuit }) => {
  return (
    <div className="pause-menu">
      <h2>Jeu en pause</h2>
      <button onClick={onResume}>Reprendre</button>
      <button onClick={onQuit}>Quitter</button>
    </div>
  );
};

const GameComponent: React.FC = () => {
  const [isPaused, setIsPaused] = useState(false);
  const [showPauseMenu, setShowPauseMenu] = useState(false);

  // Fonction pour mettre en pause le jeu
  const pauseGame = () => {
    setIsPaused(true);
    setShowPauseMenu(true);
    // Ici vous pourriez aussi arrêter le game loop ou les animations
  };

  // Fonction pour reprendre le jeu
  const resumeGame = () => {
    setIsPaused(false);
    setShowPauseMenu(false);
    // Ici vous pourriez relancer le game loop ou les animations
  };

  // Fonction pour quitter
  const quitGame = () => {
    // Logique pour quitter la partie
    console.log("Quitter la partie");
    // Par exemple: navigation vers l'écran d'accueil
  };

  return (
    <div className="game-container">
      {/* Votre jeu ici */}
      <div className="game-content">
        {isPaused && <div className="pause-overlay">PAUSE</div>}
        {/* Contenu du jeu */}
      </div>

      {/* Bouton Pause */}
      <button 
        className="pause-button" 
        onClick={pauseGame}
        disabled={isPaused}
      >
        Pause
      </button>

      {/* Menu Pause */}
      {showPauseMenu && (
        <div className="pause-menu-container">
          <PauseMenu 
            onResume={resumeGame} 
            onQuit={quitGame} 
          />
        </div>
      )}
    </div>
  );
};

export default GameComponent;