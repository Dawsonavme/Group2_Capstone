import { Component, OnInit } from '@angular/core';
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
export class TripSummary implements OnInit {

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

  async ngOnInit(): Promise<void> {
  const trips = await this.tripService.getAllTrips();

  console.log('Trip history loaded in component:', trips);
}

getValidSpeedReadingCount(): number {
  const trip = this.tripService.completedTrip;

  if (!trip) {
    return 0;
  }

  return trip.gpsPoints.filter(
    point =>
      point.speedKmh !== undefined &&
      Number.isFinite(point.speedKmh)
  ).length;
}
}