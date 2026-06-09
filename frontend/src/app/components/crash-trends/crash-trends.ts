// Imports Angular core features
import { Component } from '@angular/core';

// Imports chart component and chart configuration types
import { BaseChartDirective } from 'ng2-charts';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

// Imports the dashboard service
import { DashboardService } from '../../services/dashboard.service';

// Registers all Chart.js chart types, scales, and plugins
Chart.register(...registerables);

@Component({
  selector: 'app-crash-trends',

  // Allows this component to use the chart directive in HTML
  imports: [BaseChartDirective],

  templateUrl: './crash-trends.html',
  styleUrl: './crash-trends.css'
})
export class CrashTrends {

  // Line chart data populated from DashboardService
  public lineChartData: ChartConfiguration<'line'>['data'];

  // Line chart display options
  public lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false
  };

  // Injects DashboardService into this component
  constructor(private dashboardService: DashboardService) {

    // Gets crash trend mock data from the service
    const crashTrendData = this.dashboardService.getCrashTrends();

    // Converts service data into Chart.js format
    this.lineChartData = {
      labels: crashTrendData.map(item => item.month),
      datasets: [
        {
          data: crashTrendData.map(item => item.incidents),
          label: 'Crash Incidents'
        }
      ]
    };

  }

}