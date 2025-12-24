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

  return (
    <div className="game-card" onClick={openGame}>
      {/* Wrap image in container for overflow control */}
      <div className="game-image-container">
        <img 
          src={imgSrc}
          alt={game.title}
          className="game-image"
          onError={() => setImgSrc(game.image)}   // ✅ fallback
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