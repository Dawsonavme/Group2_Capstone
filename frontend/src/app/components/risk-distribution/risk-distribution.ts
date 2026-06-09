// Imports Angular core functionality
import { Component } from '@angular/core';

// Imports Chart.js support
import { BaseChartDirective } from 'ng2-charts';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

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

  // Sample risk distribution data
  public pieChartData: ChartConfiguration<'pie'>['data'] = {

    labels: [
      'Low Risk',
      'Medium Risk',
      'High Risk'
    ],

    datasets: [

      {
        data: [65, 25, 10]
      }

    ]

  };

  // Chart options
  public pieChartOptions: ChartConfiguration<'pie'>['options'] = {

    responsive: true,

    maintainAspectRatio: false

  };

}