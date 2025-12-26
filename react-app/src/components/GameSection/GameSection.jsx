import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GameCard from "../GameCard/GameCard";
import { useLanguage } from "../../context/LanguageContext";
import { translate } from "../../data/translations";
import "./GameSection.css";

export default function GameSection({ title, games, id, categoryId, allGamesPage = false, slider = false }) {
  const { lang } = useLanguage();
  const trackRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const firstSetWidth = useRef(0);
  const [showAll, setShowAll] = useState(false);
  const [deviceType, setDeviceType] = useState('desktop');
  const navigate = useNavigate();

  // Sections that should have horizontal scroll
  const horizontalScrollSections = [
    'platformer',
    'halloween_games',
    'card_games',
    'football_games',
    'basketball_games',
    'simulation_games',
    'skill_games',
    'horror_games',
    'endless_runner',
    'puzzles',
    'gamesAll',
    'christmas',
    'makeup',
    'driving',
    'action'
  ];

  const isHorizontalScroll = horizontalScrollSections.includes(id);

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
    if (!slider) return;

    const track = trackRef.current;
    if (!track) return;

    let x = 0;
    let rafId;
    let paused = false;
    const speed = 0.4;

    // 🔥 Measure width of FIRST set only
    requestAnimationFrame(() => {
      firstSetWidth.current = track.scrollWidth / 2;
    });

    const animate = () => {
      if (!paused) {
        x -= speed;

        // ✅ PERFECT reset point
        if (Math.abs(x) >= firstSetWidth.current) {
          x = 0;
        }

        track.style.transform = `translate3d(${x}px, 0, 0)`;
      }

      rafId = requestAnimationFrame(animate);
    };

    const pause = () => (paused = true);
    const play = () => (paused = false);

    track.addEventListener("mouseenter", pause);
    track.addEventListener("mouseleave", play);

    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      track.removeEventListener("mouseenter", pause);
      track.removeEventListener("mouseleave", play);
    };
  }, [slider, games]);

  // Scroll functions for horizontal scroll sections
  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 400;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  // Handle "See All" navigation
  const handleSeeAllClick = () => {
    if (allGamesPage) {
      navigate("/all-mosaic-games");
    } else {
      navigate(`/categories/${categoryId}`);
    }
  };

  // Determine the limit based on screen size
  const gameLimit = deviceType === 'desktop' ? 14 : 6;
  
  // For horizontal scroll: limit to 21 games, add "See All" card if more games exist
  const HORIZONTAL_GAME_LIMIT = 21;

  const visibleGames = slider
    ? [...games, ...games] // ✅ duplication for infinite slider
    : showAll
      ? games
      : isHorizontalScroll
        ? games.slice(0, HORIZONTAL_GAME_LIMIT) // Limit to 21 for horizontal scroll
        : games.slice(0, gameLimit);

  // Check if we need to show "See All" card in horizontal scroll
  // Only show if there are MORE than 21 games (not equal to or less than 21)
  const showSeeAllCard = isHorizontalScroll && games.length > HORIZONTAL_GAME_LIMIT;

  return (
    <section className="game-section" id={id}>
      <div className="content-anim">
        <div className="section-header">
          <h2 className="section-title">{title}</h2>

          <div className="BoxButtons">
            {isHorizontalScroll && (
              <div className="HoriSlide">
                <button
                  className="HoriSlideBtn"
                  onClick={handleSeeAllClick}
                >
                  <span className="">
                    {translate("seeAll", lang)}
                  </span>
                </button>
              </div>
            )}

            {isHorizontalScroll && games.length > 5 && (
              <div className="scroll-controls">
                <button className="scroll-btn left" onClick={() => scroll('left')}>
                  ←
                </button>
                <button className="scroll-btn right" onClick={() => scroll('right')}>
                  →
                </button>
              </div>
            )}
          </div>
        </div>

        {slider ? (
          <div className="slider-wrapper">
            <div className="slider-track" ref={trackRef}>
              {visibleGames.map((g, i) => (
                <GameCard key={`${g.id}-${i}`} game={g} />
              ))}
            </div>
          </div>
        ) : isHorizontalScroll ? (
          <div className="horizontal-scroll-wrapper">
            <div className="horizontal-scroll-container" ref={scrollContainerRef}>
              {visibleGames.map((g) => (
                <GameCard key={g.id} game={g} />
              ))}
              
              {/* "See All" card at the end if there are more than 21 games */}
              {showSeeAllCard && (
                <div 
                  className="see-all-card game-card" 
                  onClick={handleSeeAllClick}
                >
                  <div className="see-all-content">
                    <div className="see-all-icon">→</div>
                    <div className="see-all-text">{translate("seeAll", lang)}</div>
                    <div className="see-all-count">+{games.length - HORIZONTAL_GAME_LIMIT}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="games-grid">
            {visibleGames.map((g) => (
              <GameCard key={g.id} game={g} />
            ))}
          </div>
        )}

        {!slider && !isHorizontalScroll && games.length > gameLimit && (
          <div className="container nohori">
            <button
              className="btn"
              onClick={handleSeeAllClick}
            >
              <span className="btnInner">
                {translate("viewMore", lang)}
              </span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}