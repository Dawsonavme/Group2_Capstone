// Import Angular core functionality
import { Injectable } from '@angular/core';

// Import interfaces from the models folder
import {
  DashboardSummary,
  CrashTrend,
  TripAnalyticsData,
  RiskDistributionData,
  RecentTrip
} from '../models/dashboard.model';

/*
  DashboardService

  This service is responsible for providing all dashboard data.

  Currently:
  - Returns mock/sample data.

  Future:
  - Will call Spring Boot REST APIs instead.
*/

@Injectable({

  providedIn: 'root'

})

export class DashboardService {

  /*
    Returns summary card information.
  */
  getSummaryData(): DashboardSummary {

    return {

      safetyScore: 72,

      totalTrips: 157,

      crashRisk: 'Low'

    };

  }

  /*
    Returns crash trend chart data.
  */
  getCrashTrends(): CrashTrend[] {

    return [

      { month: 'Jan', incidents: 12 },

      { month: 'Feb', incidents: 9 },

      { month: 'Mar', incidents: 14 },

      { month: 'Apr', incidents: 7 },

      { month: 'May', incidents: 10 },

      { month: 'Jun', incidents: 6 }

    ];

  }

  /*
    Returns weekly trip analytics.
  */
  getTripAnalytics(): TripAnalyticsData[] {

    return [

      { day: 'Mon', trips: 5 },

      { day: 'Tue', trips: 8 },

      { day: 'Wed', trips: 6 },

      { day: 'Thu', trips: 7 },

      { day: 'Fri', trips: 9 },

      { day: 'Sat', trips: 4 },

      { day: 'Sun', trips: 3 }

    ];

  }

  /*
    Returns driver risk distribution.
  */
  getRiskDistribution(): RiskDistributionData[] {

    return [

      {

        riskLevel: 'Low',

        percentage: 65

      },

      {

        riskLevel: 'Medium',

        percentage: 25

      },

      {

        riskLevel: 'High',

        percentage: 10

      }

    ];

  }

  /*
    Returns recent trip records.
  */
  getRecentTrips(): RecentTrip[] {

    return [

      {

        date: 'Jun 9',

        distance: '18 km',

        duration: '32 min',

        risk: 'Low'

      },

      {

        date: 'Jun 8',

        distance: '26 km',

        duration: '45 min',

        risk: 'Medium'

      },

      {

        date: 'Jun 7',

        distance: '12 km',

        duration: '20 min',

        risk: 'Low'

      },

      {

        date: 'Jun 6',

        distance: '34 km',

        duration: '58 min',

        risk: 'High'

      }

    ];

  }

}