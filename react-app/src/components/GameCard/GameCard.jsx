import "./GameCard.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { translate } from "../../data/translations";
import { pushRecent } from "../../utils/localStorage";
import { trackGameClick } from "../../utils/popularGamesUtils";
import { getGameThumb } from "../../utils/getGameThumb";


export default function GameCard({ game, index, isHot }) {
  const navigate = useNavigate();
  const { lang } = useLanguage();

  const [imgSrc, setImgSrc] = useState(getGameThumb(game));
  const [imageLoaded, setImageLoaded] = useState(false);

  const openGame = () => {
    if (!game || !game.id) return;

    pushRecent({
      id: game.id,
      title: game.title,
      image: game.image,
      category: game.category || "",
      gameId: game.gameId || game.id,
      externalUrl: game.externalUrl || game.link,
    });

    trackGameClick({
      id: game.id,
      title: game.title,
      image: game.image,
      category: game.category || "",
      gameId: game.gameId || game.id,
      externalUrl: game.externalUrl || game.link,
    });

    navigate(`/game/${game.id}`, { state: { game, index } });
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImgSrc(game.image);
    setImageLoaded(true);
  };

  return (
    <div className="game-card" onClick={openGame}>
      {/* Wrap image in container for overflow control */}
      <div className="game-image-container">
        {!imageLoaded && <div className="game-card-skeleton" />}
        <img 
          src={imgSrc}
          alt={game.title}
          className={`game-image ${imageLoaded ? 'loaded' : ''}`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          style={{ opacity: imageLoaded ? 1 : 0 }}
        />
      </div>

      <div className="play-button">
        {translate("playNow", lang)}
      </div>

      {isHot && (
        <div className="hot-badge">
          <img
            src="/images/game.png"
            className="game-image-hot"
            alt="Hot"
          />
          {translate("hot", lang)}
        </div>
      )}

      <div className="game-overlay">
        <div className="game-title">{game.title}</div>
        {game.category && (
          <div className="game-category">{game.category}</div>
        )}
      </div>
    </div>
  );
}