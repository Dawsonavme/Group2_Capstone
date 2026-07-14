import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TripService } from '../../services/trip';
import { LocationService } from '../../services/location.service';

@Component({
  selector: 'app-my-driving',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-driving.html',
  styleUrl: './my-driving.css'
})
export class MyDriving {

  isStartingTrip = false;

  // Risk Score
  driverRiskScore = 68;
  riskLevel = 'Moderate Risk';
  weeklyImprovement = '+8 points improved vs last 7 days';

  // Driving Metrics
  speeding = 14;
  harshBraking = 18;
  rapidAcceleration = 22;
  nightDriving = 35;
  tripsThisWeek = 12;
  phoneUsage = 2;

  // Recent Trips
  recentTrips = [
    {
      id: 1,
      date: 'May 15, 2024',
      time: '6:45 PM',
      distance: '21 km',
      duration: '28 min',
      type: 'Night Trip',
      summary: 'Speeding: High • Braking: High • Acceleration: Moderate',
      score: 62
    },
    {
      id: 2,
      date: 'May 14, 2024',
      time: '4:20 PM',
      distance: '14 km',
      duration: '19 min',
      type: 'City Trip',
      summary: 'Speeding: Low • Braking: Moderate • Acceleration: Good',
      score: 78
    },
    {
      id: 3,
      date: 'May 13, 2024',
      time: '8:10 AM',
      distance: '32 km',
      duration: '36 min',
      type: 'Highway Trip',
      summary: 'Speeding: Moderate • Braking: Low • Acceleration: Moderate',
      score: 71
    }
  ];

  constructor(
    public tripService: TripService,
    private router: Router,
    private locationService: LocationService
  ) {}

  // ========================
  // START TRIP
  // ========================
  async startTrip() {
    if (this.isStartingTrip) return;

    this.isStartingTrip = true;

    try {
      // 1. Request permission
      const granted = await this.locationService.requestPermission();
      if (!granted) {
        alert("Location permission is required to start a trip.");
        return;
      }

      // 2. Get starting location
      const startLocation = await this.locationService.getCurrentLocation();
      if (!startLocation) {
        alert("Unable to get current location. Please enable GPS and try again.");
        return;
      }

      // 3. Start the trip in service
      const success = this.tripService.startTrip();
      if (!success || !this.tripService.activeTrip) {
        alert("Could not start trip. Please try again.");
        return;
      }

      // 4. Save start location
      this.tripService.activeTrip.startLocation = startLocation;

      // 5. Start continuous GPS tracking
      await this.locationService.startTracking((point) => {
        if (this.tripService.activeTrip) {
          this.tripService.activeTrip.gpsPoints.push(point);
          this.tripService.activeTrip.gpsPointCount = this.tripService.activeTrip.gpsPoints.length;
        }
      });

      // 6. Navigate to active trip screen
      await this.router.navigate(['/active-trip']);

    } catch (error) {
      console.error("Start trip failed:", error);
      alert("Failed to start trip. Please check your GPS settings.");
    } finally {
      this.isStartingTrip = false;
    }
  }

  // TrackBy for *ngFor performance
  trackTrip(index: number, trip: any): number {
    return trip.id ?? index;
  }
}