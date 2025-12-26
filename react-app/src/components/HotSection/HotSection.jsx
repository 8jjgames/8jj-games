// HotSection.jsx
import { useEffect, useState } from "react";
import GameCard from "../GameCard/GameCard";
import "./HotSection.css";

// Skeleton Card Component
function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-image"></div>
      <div className="skeleton-content">
        <div className="skeleton-title"></div>
        <div className="skeleton-subtitle"></div>
      </div>
    </div>
  );
}

export default function HotSection({ games, id, lang, translate }) {
  const [hotGames, setHotGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deviceType, setDeviceType] = useState('desktop');

  // Detect screen size
  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setDeviceType('mobile');
      } else if (width >= 768 && width <= 1024) {
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }
    };
    
    checkDevice();
    window.addEventListener("resize", checkDevice);
    
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  useEffect(() => {
    if (games && Array.isArray(games)) {
      // Determine the limit based on screen size
      const gameLimit = deviceType === 'mobile' ? 6 : deviceType === 'tablet' ? 9 : 14;
      // Keep only limited games based on screen size
      const limitedGames = games.slice(0, gameLimit);
      setHotGames(limitedGames);
    }
    setLoading(false);
  }, [games, deviceType]);

  // Calculate skeleton count based on device type
  const getSkeletonCount = () => {
    if (deviceType === 'mobile') return 6;
    if (deviceType === 'tablet') return 9;
    return 14;
  };

  if (loading) {
    return (
      <section className="hot-section game-section" id={id}>
        <div className="content-anim">
          <div className="hot-header">
            <h2 className="section-title">🔥 {translate("hotGames", lang)}</h2>
          </div>
          <div className="HotSkeleton">
            {Array.from({ length: getSkeletonCount() }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="hot-section game-section" id={id}>
      <div className="content-anim">
        <h2 className="section-title">🔥 {translate("hotGames", lang)}</h2>
       
        {hotGames && hotGames.length > 0 ? (
          <div className="games-grid">
            {hotGames.map((game, index) => (
              <GameCard
                key={`${game.id}-${index}`}
                game={game}
                index={index}
                isHot
              />
            ))}
          </div>
        ) : (
          <div className="empty-message">
            <p>No hot games available</p>
          </div>
        )}
      </div>
    </section> 
  );
}