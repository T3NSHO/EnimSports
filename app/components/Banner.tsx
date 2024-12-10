import React from 'react';
import './Banner.css';

const Banner = () => {
  return (
    <div className="banner">
      <div className="banner-text">
        <h3>Prêt à vous lancer ?</h3>
        <div>Alors essayez EnimSports maintenant</div>
      </div>
      <button className="banner-button">
        <span role="img" aria-label="trophy">🏆</span> Créer gratuitement un tournoi
      </button>
    </div>
  );
};

export default Banner;
