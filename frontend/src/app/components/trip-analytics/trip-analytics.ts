// Imports Angular core features
import { Component } from '@angular/core';

// Imports Chart.js directive
import { BaseChartDirective } from 'ng2-charts';

// Imports Chart.js configuration types
import { Chart, ChartConfiguration, registerables } from 'chart.js';

// Imports dashboard service
import { DashboardService } from '../../services/dashboard.service';

// Registers Chart.js modules
Chart.register(...registerables);

@Component({
  selector: 'app-trip-analytics',

  // Enables chart directive inside HTML
  imports: [BaseChartDirective],

  templateUrl: './trip-analytics.html',
  styleUrl: './trip-analytics.css'
})
export class TripAnalytics {

  // Stores bar chart data
  public barChartData: ChartConfiguration<'bar'>['data'];

  // Chart display options
  public barChartOptions: ChartConfiguration<'bar'>['options'] = {

    responsive: true,

    maintainAspectRatio: false

  };

  // Injects DashboardService
  constructor(private dashboardService: DashboardService) {

    // Gets weekly trip data from service
    const tripData = this.dashboardService.getTripAnalytics();

    // Converts service data into Chart.js format
    this.barChartData = {

      labels: tripData.map(item => item.day),

      datasets: [

        {

          label: 'Trips',

          data: tripData.map(item => item.trips)

        }

      ]

    };

  }

}