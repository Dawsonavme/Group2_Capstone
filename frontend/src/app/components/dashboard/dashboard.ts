// Imports Angular core features
import { Component } from '@angular/core';

// Imports child dashboard components
import { Navbar } from '../navbar/navbar';
import { SummaryCards } from '../summary-cards/summary-cards';
import { CrashTrends } from '../crash-trends/crash-trends';
import { TripAnalytics } from '../trip-analytics/trip-analytics';
import { RiskDistribution } from '../risk-distribution/risk-distribution';
import { RecentTrips } from '../recent-trips/recent-trips';

@Component({
  selector: 'app-dashboard',

  // Standalone component imports used inside dashboard.html
  imports: [
    Navbar,
    SummaryCards,
    CrashTrends,
    TripAnalytics,
    RiskDistribution,
    RecentTrips
  ],

  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  // Main dashboard parent component
}