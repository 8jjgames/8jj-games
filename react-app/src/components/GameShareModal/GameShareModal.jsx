import "./GameShareModal.css";

export default function GameShareModal({ open, onClose, title, url }) {
  if (!open) return null;

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    alert("Link copied!");
  };

  return (
    <div className="game-share-overlay" onClick={onClose}>
      <div
        className="game-share-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="game-share-header">
          <h3>Share this game</h3>
          <button
            className="game-share-close"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* ICONS */}
        <div className="game-share-icons">
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
              url
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="game-share-icon facebook"
            aria-label="Share on Facebook"
          >
            <img src="/images/social-share/fb.png" alt="Facebook" />
          </a>

          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
              url
            )}&text=${encodeURIComponent(title)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="game-share-icon twitter"
            aria-label="Share on X"
          >
            <img src="/images/social-share/X.png" alt="X / Twitter" />
          </a>

          <a
            href={`https://wa.me/?text=${encodeURIComponent(
              title + " " + url
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="game-share-icon whatsapp"
            aria-label="Share on WhatsApp"
          >
            <img src="/images/social-share/whatsapp.png" alt="WhatsApp" />
          </a>
        </div>

        {/* COPY LINK */}
        <div className="game-share-link">
          <input value={url} readOnly />
          <button onClick={copyLink}>Copy</button>
        </div>
      </div>
    </div>
  );
}
