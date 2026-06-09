// Imports Angular core functionality
import { Component } from '@angular/core';

// Imports CommonModule so *ngFor works
import { CommonModule } from '@angular/common';

// Imports dashboard service
import { DashboardService } from '../../services/dashboard.service';

// Imports recent trip model
import { RecentTrip } from '../../models/dashboard.model';

@Component({
  selector: 'app-recent-trips',

  // CommonModule is needed for *ngFor in the HTML
  imports: [CommonModule],

  templateUrl: './recent-trips.html',
  styleUrl: './recent-trips.css'
})
export class RecentTrips {

  recentTrips: RecentTrip[];

  constructor(private dashboardService: DashboardService) {
    this.recentTrips = this.dashboardService.getRecentTrips();
  }

}