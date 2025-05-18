import type { SearchResult } from "../types/SearchResult";

export const imageAltGenerator = (item: SearchResult) => {
  let imgAlt = "Placeholder image";

  switch (item.type.name) {
    case "Player":
    case "PlayerInTeam":
      imgAlt = `Picture of ${item.name}`;
      break;
    case "Team":
    case "League":
      imgAlt = `Logo of ${item.name}`;
      break;
  }

  return imgAlt;
};
