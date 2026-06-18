export type Business = {
  id: string;
  name: string;
  category: string;
  municipality: string;
  lat: number;
  lng: number;
  story: string;
  tags: string[];
  synthetic: boolean;
};

export type DashboardMetrics = {
  disclaimer: string;
  period: string;
  qr_scans: number;
  stamps: number;
  routes_started: number;
  routes_completed: number;
  action_rate: number;
  top_transition: string;
  low_flow_category: string;
  recommendation: string;
};

export type PassportState = {
  active: boolean;
  timeMinutes: number;
  interests: string[];
  generated: boolean;
};
