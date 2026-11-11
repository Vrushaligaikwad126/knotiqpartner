export interface CharterTrip {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  vesselName: string;
  location: string;
  durationHours: number;
  guestCount: number;
  readinessPercentage: number;
  remainingTasksCount: number;
  status: 'Preparing' | 'Ready' | 'In Progress' | 'Completed';
}

export interface WeatherConditions {
  temperatureF: number;
  feelsLikeF: number;
  conditionDescription: string;
  windKnots: number;
  windDirection: string;
  waveHeightFt: number;
  wavePeriodSec: number;
  rainRiskPercentage: number;
  riskLevel: 'Low Risk' | 'Moderate Risk' | 'High Risk';
  passageStatus: 'Optimal' | 'Caution' | 'Restricted';
  lastUpdated: string;
}

export interface VesselQuickStats {
  id: string;
  name: string;
  model: string;
  registrationNumber: string;
  fuelPercentage: number;
  engineHours: number;
  status: 'Ready' | 'Maintenance Required' | 'In Service';
  maintenanceIssuesCount: number;
}

