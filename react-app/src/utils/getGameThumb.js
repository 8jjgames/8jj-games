export function getGameThumb(game) {
  if (!game?.id) return game?.image;

  const thumbPath = `/game-thumbs/${game.id}.jpg`;

  return thumbPath;
}
