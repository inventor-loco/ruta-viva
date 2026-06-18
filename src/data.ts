import businessSource from "./data/businesses.mock.json";
import dashboardSource from "./data/dashboard.mock.json";
import passportSource from "./data/passport.mock.json";
import type { Business, DashboardMetrics } from "./types";

type BusinessesPayload = {
  disclaimer: string;
  businesses: Business[];
};

export const businessesPayload = businessSource as BusinessesPayload;
export const businesses = businessesPayload.businesses;
export const dashboard = dashboardSource as DashboardMetrics;
export const passport = passportSource;

export const categoryLabels: Record<string, string> = {
  bochinche: "Bochinche",
  bodega: "Bodega",
  queseria: "Queseria",
  artesania: "Artesania",
  mercado: "Mercado",
  enoteca: "Enoteca",
};

export const interestOptions = ["vino", "queso", "artesania", "mercado"];
export const timeOptions = [45, 90, 120];
