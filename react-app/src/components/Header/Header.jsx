import "./Header.css";
import { useLanguage } from "../../context/LanguageContext";
import { translate } from "../../data/translations";
import { useState, useRef, useEffect } from "react";
import ShareModal from "../ShareModal/ShareModal";
import { useSearch } from "../../context/SearchContext";

export default function Header() {
  const { lang, changeLanguage } = useLanguage();
  const { search, setSearch } = useSearch();
  const [shareOpen, setShareOpen] = useState(false);
  const [sidebarHidden, setSidebarHidden] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const clearSearch = () => {
    setSearch("");
  };

  const toggleSidebar = () => {
    setSidebarHidden((prev) => !prev);
    document.dispatchEvent(new CustomEvent("toggleSidebar"));
  };

  const toggleLangDropdown = () => {
    setLangDropdownOpen((prev) => !prev);
  };

  const handleLanguageChange = (newLang) => {
    changeLanguage(newLang);
    setLangDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setLangDropdownOpen(false);
      }
    };

    if (langDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [langDropdownOpen]);

  const languages = [
    { code: "en", name: "English" },
    { code: "hi", name: "हिन्दी" },
    { code: "ta", name: "தமிழ்" },
    { code: "ml", name: "മലയാളം" },
    { code: "kn", name: "ಕನ್ನಡ" },
    { code: "bn", name: "বাংলা" }
  ];

  
  return (
    <>
      <header className="header">
        <div className="header-categories">
          <button
            className={`sidebar-toggle-btn ${sidebarHidden ? 'open' : ''}`}
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            <svg 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg" 
              aria-hidden="true" 
              focusable="false" 
              className="menu-icon"
            >
              <rect x="3" y="3" width="18" height="2" rx="0.5" className="bar" />
              <rect x="3" y="11" width="10" height="2" rx="0.5" className="bar" />
              <rect x="3" y="19" width="18" height="2" rx="0.5" className="bar" />
              <polygon 
                points="15.36,11.15 20.47,7.96 20.47,16.04 15.36,12.85" 
                className="play" 
              />
            </svg>
          </button>
        </div>

        <div className="header-container">
          <div className="brand">
             <button
              className="icon-btn menu-toggle"
              type="button"
              aria-label="Open menu"
              onClick={() =>
                document.dispatchEvent(new CustomEvent("openDrawer"))
              }
            >
              <svg 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg" 
              aria-hidden="true" 
              focusable="false" 
              className="menu-icon"
            >
              <rect x="3" y="3" width="18" height="2" rx="0.5" className="bar" />
              <rect x="3" y="11" width="10" height="2" rx="0.5" className="bar" />
              <rect x="3" y="19" width="18" height="2" rx="0.5" className="bar" />
              <polygon 
                points="15.36,11.15 20.47,7.96 20.47,16.04 15.36,12.85" 
                className="play" 
              />
            </svg>
            </button>


            <a href="/" aria-label="8JJ Home">
              <img
                className="brand-logo"
                src="/images/8JJ_games.png"
                alt="8JJ Games"
              />
            </a>
          </div>

          <div className="header-actions">
            <div className="search MarginLeftRight">
              <input
                type="text"
                placeholder={translate("searchHeader", lang)}
                aria-label="Search games"
                value={search}
                onChange={handleSearch}
              />
              <button
                className="search-icon-btn"
                onClick={search ? clearSearch : undefined}
              >
                {search ? "✖" : "🔍"}
              </button>
            </div>

            <div className="lang-dropdown-container MarginLeftRight" ref={dropdownRef}>
              <button 
                className="icon-btn lang-icon-btn" 
                onClick={toggleLangDropdown}
                aria-label="Select language"
              >
                🌐
              </button>
              <div className={`lang-dropdown ${langDropdownOpen ? 'open' : ''}`}>
                {languages.map((language) => (
                  <button
                    key={language.code}
                    className={`lang-option ${lang === language.code ? 'active' : ''}`}
                    onClick={() => handleLanguageChange(language.code)}
                  >
                    {language.name}
                  </button>
                ))}
              </div>
            </div>

            <button className="icon-btn" onClick={() => setShareOpen(true)}>
              <img
                src="/images/shared.png"
                alt="Share"
                className="share-header-icon"
              />
            </button>
          </div>

        
        </div>
          {/* Sidebar toggle button */}
        <div className="header-categories" id="HIDEHIDEHIDE">
          <button
            className={`sidebar-toggle-btn ${sidebarHidden ? 'open' : ''}`}
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            <svg 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg" 
              aria-hidden="true" 
              focusable="false" 
              className="menu-icon"
            >
              <rect x="3" y="3" width="18" height="2" rx="0.5" className="bar" />
              <rect x="3" y="11" width="10" height="2" rx="0.5" className="bar" />
              <rect x="3" y="19" width="18" height="2" rx="0.5" className="bar" />
              <polygon 
                points="15.36,11.15 20.47,7.96 20.47,16.04 15.36,12.85" 
                className="play" 
              />
            </svg>
          </button>
        </div>
      </header>

      <ShareModal open={shareOpen} onClose={() => setShareOpen(false)} />
    </>
  );
}