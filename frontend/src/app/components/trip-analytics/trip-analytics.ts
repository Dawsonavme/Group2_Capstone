// Imports Angular core features
import { Component } from '@angular/core';

// Imports Chart.js support
import { BaseChartDirective } from 'ng2-charts';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

// Registers Chart.js components
Chart.register(...registerables);

@Component({
  selector: 'app-trip-analytics',

  // Makes the chart directive available
  imports: [BaseChartDirective],

  templateUrl: './trip-analytics.html',
  styleUrl: './trip-analytics.css'
})
export class TripAnalytics {

  // Sample trip analytics data
  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Trips',
        data: [5, 8, 6, 7, 9, 4, 3]
      }
    ]
  };

  // Chart configuration
  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false
  };

}