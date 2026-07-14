import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TripService } from '../../services/trip';
import { LocationService } from '../../services/location.service';

@Component({
  selector: 'app-active-trip',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './active-trip.html',
  styleUrl: './active-trip.css'
})
export class ActiveTrip {
  isEnding = false;

  constructor(
    public tripService: TripService,
    private router: Router,
    private locationService: LocationService
  ) {}

  async endTrip() {
    if (this.isEnding || !this.tripService.activeTrip) return;
    this.isEnding = true;

    try {
      const endLocation = await this.locationService.getCurrentLocation();
      if (endLocation) {
        this.tripService.activeTrip.endLocation = endLocation;
      }

      await this.locationService.stopTracking();

      const success = this.tripService.endTrip();

      if (success) {
        console.log("✅ Trip ended successfully");
        this.router.navigate(['/trip-summary']);
      } else {
        alert("Failed to end trip");
      }
    } catch (error) {
      console.error("End trip error:", error);
      alert("Error ending trip");
    } finally {
      this.isEnding = false;
    }
  }
}