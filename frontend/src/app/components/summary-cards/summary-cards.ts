// Imports Angular core functionality
import { Component } from '@angular/core';

// Imports Angular Material icon module
import { MatIconModule } from '@angular/material/icon';

// Imports the dashboard service
import { DashboardService } from '../../services/dashboard.service';

// Imports the summary data structure
import { DashboardSummary } from '../../models/dashboard.model';

@Component({
  selector: 'app-summary-cards',

  // Makes Material icons available in this component
  imports: [MatIconModule],

  templateUrl: './summary-cards.html',
  styleUrl: './summary-cards.css'
})
export class SummaryCards {

  // Stores summary card values from the service
  summaryData: DashboardSummary;

  // Injects DashboardService into this component
  constructor(private dashboardService: DashboardService) {

    // Gets mock summary data from the service
    this.summaryData = this.dashboardService.getSummaryData();

  }

}