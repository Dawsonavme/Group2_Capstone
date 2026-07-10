import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TripService } from '../../services/trip';

@Component({
  selector: 'app-active-trip',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './active-trip.html',
  styleUrl: './active-trip.css'
})
export class ActiveTrip {

  constructor(
    public tripService: TripService,
    private router: Router
  ) {}

  endTrip() {
    const success = this.tripService.endTrip();
    if (success) {
      this.router.navigate(['/trip-summary']);
    } else {
      alert('No active trip to end.');
    }
  }
}