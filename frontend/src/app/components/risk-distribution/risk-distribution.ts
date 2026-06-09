// Imports Angular core functionality
import { Component } from '@angular/core';

// Imports Chart.js support
import { BaseChartDirective } from 'ng2-charts';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

// Imports dashboard service
import { DashboardService } from '../../services/dashboard.service';

// Registers all Chart.js components
Chart.register(...registerables);

@Component({
  selector: 'app-risk-distribution',

  // Enables Chart.js inside this component
  imports: [BaseChartDirective],

  templateUrl: './risk-distribution.html',
  styleUrl: './risk-distribution.css'
})
export class RiskDistribution {

  // Stores pie chart data
  public pieChartData: ChartConfiguration<'pie'>['data'];

  // Chart display options
  public pieChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    maintainAspectRatio: false
  };

  // Injects DashboardService
  constructor(private dashboardService: DashboardService) {

    // Gets risk distribution data from service
    const riskData = this.dashboardService.getRiskDistribution();

    // Converts service data into Chart.js pie chart format
    this.pieChartData = {
      labels: riskData.map(item => item.riskLevel),
      datasets: [
        {
          data: riskData.map(item => item.percentage)
        }
      ]
    };

  }

}