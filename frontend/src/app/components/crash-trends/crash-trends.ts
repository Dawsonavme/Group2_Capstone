// Imports Angular core features
import { Component } from '@angular/core';

// Imports chart component and chart configuration types
import { BaseChartDirective } from 'ng2-charts';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

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

  // Line chart data showing sample monthly crash trend values
  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [12, 9, 14, 7, 10, 6],
        label: 'Crash Incidents'
      }
    ]
  };

  // Line chart display options
  public lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false
  };
}