import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GameCard from "../GameCard/GameCard";
import { useLanguage } from "../../context/LanguageContext";
import { translate } from "../../data/translations";
import "./GameSection.css";

export default function GameSection({ title, games, id, categoryId, allGamesPage = false, slider = false }) {
  const { lang } = useLanguage();
  const trackRef = useRef(null);
  const firstSetWidth = useRef(0);
  const [showAll, setShowAll] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  // Detect screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    
    return () => window.removeEventListener("resize", checkMobile);
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

  // Determine the limit based on screen size
  const gameLimit = isMobile ? 12 : 14;

  const visibleGames = slider
    ? [...games, ...games] // ✅ duplication
    : showAll
    ? games
    : games.slice(0, gameLimit);

  return (
    <section className="game-section" id={id}>
      <div className="content-anim">
        <h2 className="section-title">{title}</h2>

        {slider ? (
          <div className="slider-wrapper">
            <div className="slider-track" ref={trackRef}>
              {visibleGames.map((g, i) => (
                <GameCard key={`${g.id}-${i}`} game={g} />
              ))}
            </div>
          </div>
        ) : (
          <div className="games-grid">
            {visibleGames.map((g) => (
              <GameCard key={g.id} game={g} />
            ))}
          </div>
        )}

        {!slider && games.length > gameLimit && (
          <div className="container">
            {/* 
              href="#"
              className="btn"
              onClick={(e) => {
                e.preventDefault();
                setShowAll(!showAll);
              }}
            >
              <span className="btnInner">
                {showAll ? translate("viewLess", lang) : translate("viewMore", lang)}
              </span>
            </a> */}

            <button
              className="btn"
              onClick={() => {
                if (allGamesPage) {
                  navigate("/all-mosaic-games");
                } else {
                  navigate(`/categories/${categoryId}`);
                }
              }}
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