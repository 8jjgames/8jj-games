import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HeroBanner.css";

export default function HeroBanner({ slides, autoPlay = true, interval = 5000 }) {
  const [index, setIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const navigate = useNavigate();

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  useEffect(() => {
    if (!autoPlay || slides.length <= 1) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, interval);

    return () => clearInterval(timer);
  }, [index, slides, autoPlay, interval]);

  const slide = slides[index];

  const handleClick = () => {
    if (slide.link) {
      navigate(slide.link);
    }
  };

  const prevSlide = (e) => {
    e.stopPropagation();
    setIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = (e) => {
    e.stopPropagation();
    setIndex((prev) => (prev + 1) % slides.length);
  };

  // Touch event handlers
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      // Swipe left = next slide
      setIndex((prev) => (prev + 1) % slides.length);
    }
    if (isRightSwipe) {
      // Swipe right = previous slide
      setIndex((prev) => (prev - 1 + slides.length) % slides.length);
    }
  };

  return (
    <section
      className="hero-banner"
      style={{ backgroundImage: `url(${slide.background})` }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="hero-overlay" />

      {/* LEFT ARROW */}
      {slides.length > 1 && (
        <button className="hero-arrow left" onClick={prevSlide}>
          ‹
        </button>
      )}

      {/* RIGHT ARROW */}
      {slides.length > 1 && (
        <button className="hero-arrow right" onClick={nextSlide}>
          ›
        </button>
      )}

      <div className="hero-content">
        {slide.badge && <span className="hero-badge">{slide.badge}</span>}

        <h1 className="hero-title">
          <span className="highlight">{slide.titleHighlight}</span>
          <br />
          {slide.title}
        </h1>

        {slide.subtitle && (
          <p className="hero-subtitle">{slide.subtitle}</p>
        )}

        {slide.cta && (
          <button className="hero-btn" onClick={handleClick}>
            {slide.cta}
          </button>
        )}
      </div>

      {/* Slide indicators */}
      {slides.length > 1 && (
        <div className="hero-indicators">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`indicator ${i === index ? "active" : ""}`}
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}