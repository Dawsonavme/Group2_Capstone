// Defines the structure for dashboard summary card data
export interface DashboardSummary {
  safetyScore: number;
  totalTrips: number;
  crashRisk: string;
}

// Defines the structure for crash trend chart data
export interface CrashTrend {
  month: string;
  incidents: number;
}

// Defines the structure for trip analytics chart data
export interface TripAnalyticsData {
  day: string;
  trips: number;
}

// Defines the structure for risk distribution chart data
export interface RiskDistributionData {
  riskLevel: string;
  percentage: number;
}

// Defines the structure for recent trip table rows
export interface RecentTrip {
  date: string;
  distance: string;
  duration: string;
  risk: 'Low' | 'Medium' | 'High';
}