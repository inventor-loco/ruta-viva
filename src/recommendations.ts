import { businesses } from "./data";
import type { Business } from "./types";

const interestCategoryMap: Record<string, string[]> = {
  vino: ["bodega", "enoteca"],
  queso: ["queseria", "mercado"],
  artesania: ["artesania", "mercado"],
  mercado: ["mercado", "queseria"],
};

const categoryWeight: Record<string, number> = {
  bodega: 4,
  enoteca: 3,
  queseria: 4,
  artesania: 4,
  mercado: 3,
  bochinche: 1,
};

export function getCurrentStop() {
  return businesses[0];
}

export function getRecommendations(interests: string[], currentId = getCurrentStop().id) {
  const desiredCategories = new Set(interests.flatMap((interest) => interestCategoryMap[interest] ?? []));

  const ranked = businesses
    .filter((business) => business.id !== currentId)
    .map((business) => {
      const tagMatch = interests.filter((interest) => business.tags.join(" ").includes(interest)).length;
      const categoryMatch = desiredCategories.has(business.category) ? 2 : 0;
      const score = categoryMatch + tagMatch + (categoryWeight[business.category] ?? 0) / 10;

      return { business, score };
    })
    .sort((a, b) => b.score - a.score || a.business.name.localeCompare(b.business.name));

  return ranked.slice(0, 3).map(({ business }) => business);
}

export function buildRoute(interests: string[]) {
  return [getCurrentStop(), ...getRecommendations(interests).slice(0, 2)];
}

export function formatRecommendationReason(business: Business, interests: string[]) {
  const overlap = business.tags.filter((tag) =>
    interests.some((interest) => tag.toLowerCase().includes(interest.toLowerCase())),
  );

  if (overlap.length > 0) {
    return `Encaja por ${overlap.slice(0, 2).join(" + ")} y queda dentro del catalogo verificado.`;
  }

  return `Amplia la ruta hacia ${business.category} sin salir del catalogo verificado.`;
}
