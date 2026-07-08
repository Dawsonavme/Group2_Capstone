import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TripService } from '../../services/trip';

@Component({
  selector: 'app-trip-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trip-summary.html',
  styleUrl: './trip-summary.css'
})
export class TripSummary {

  constructor(
    public tripService: TripService,
    private router: Router
  ) {}

  startNewTrip() {
    this.tripService.reset();
    this.router.navigate(['/my-driving']);
  }

  goToMyDriving() {
    this.router.navigate(['/my-driving']);
  }
}