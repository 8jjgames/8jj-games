// api/fetchH5Games.js

const BLOCKED_GAME_KEYWORDS = [
  "unhook",
  "bra",
  "adult",
  "sex",
  "kiss",
  "poop",
];


export async function fetchH5Games() {
  const res = await fetch(
    `/api/proxy?url=${encodeURIComponent(
      "https://h5games.online/freegames.json"
    )}`
  );

  const data = await res.json();

  return data
    // 🚫 BLOCK UNWANTED GAMES FIRST
    .filter(g => {
      const title = g.title?.toLowerCase() || "";
      return !BLOCKED_GAME_KEYWORDS.some(keyword =>
        title.includes(keyword)
      );
    })

    // ✅ MAP CLEAN DATA
    .map((g, i) => ({
      id: g.guid || `h5-${i}`,
      title: g.title,

      image: `/api/proxy?url=${encodeURIComponent(g.thumb)}`,

      embed: g.link,
      description: g.description,

      category: g.category === "puzzle" ? "puzzles" : g.category,
      tagList: g.tags?.toLowerCase().split(",") || [],

      source: "h5games",
    }));
}
