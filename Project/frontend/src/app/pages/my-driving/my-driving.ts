import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  BackendTripResponse,
  Trip,
  TripService
} from '../../services/trip';
import { LocationService } from '../../services/location.service';

@Component({
  selector: 'app-my-driving',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-driving.html',
  styleUrl: './my-driving.css'
})
export class MyDriving implements OnInit {

  isStartingTrip = false;

  // Dashboard analytics
  driverRiskScore = 100;
  riskLevel = 'Low Risk';
  weeklyImprovement =
    'No completed trip analytics available.';

  speeding = 0;
  harshBraking = 0;
  rapidAcceleration = 0;
  nightDriving = 0;
  tripsThisWeek = 0;
  phoneUsage = 0;

  // Recent Trips
  recentTrips: BackendTripResponse[] = [];

  isLoadingTrips = false;
  tripHistoryError = '';

  constructor(
  public tripService: TripService,
  private router: Router,
  private locationService: LocationService,
  private changeDetectorRef: ChangeDetectorRef
) {}

  async ngOnInit(): Promise<void> {
    await this.loadRecentTrips();
  }

  async loadRecentTrips(): Promise<void> {
    this.isLoadingTrips = true;
    this.tripHistoryError = '';

    try {
      const trips =
        await this.tripService.getAllTrips();

      this.recentTrips =
        trips.slice(0, 3);

      console.log(
        'Recent trips displayed:',
        this.recentTrips
      );

      this.loadLatestTripAnalytics();
    } catch (error) {
      console.error(
        'Could not load recent trips:',
        error
      );

      this.tripHistoryError =
        'Could not load recent trips.';

      this.recentTrips = [];
    } finally {
      this.isLoadingTrips = false;

  this.changeDetectorRef.detectChanges();
    }
  }

  loadLatestTripAnalytics(): void {
    const completedTrip =
      this.tripService.completedTrip;

    if (completedTrip) {
      this.speeding =
        completedTrip.thresholdExceededCount ?? 0;

      this.driverRiskScore =
        this.calculateRiskScore(
          completedTrip
        );

      this.riskLevel =
        this.getRiskLevel(
          this.driverRiskScore
        );

      this.weeklyImprovement =
        completedTrip.postTripMessage ??
        'Trip analytics were calculated successfully.';

      this.tripsThisWeek =
        this.recentTrips.length;

      return;
    }

    const latestCompletedTrip =
      this.recentTrips.find(
        trip => trip.status === 'completed'
      );

    if (!latestCompletedTrip) {
      this.tripsThisWeek =
        this.recentTrips.length;

      return;
    }

    this.speeding =
      latestCompletedTrip
        .thresholdExceededCount ?? 0;

    this.driverRiskScore =
      this.calculateBackendRiskScore(
        latestCompletedTrip
      );

    this.riskLevel =
      this.getRiskLevel(
        this.driverRiskScore
      );

    this.weeklyImprovement =
      latestCompletedTrip.postTripMessage ??
      'No persisted speed analytics are available for this trip.';

    this.tripsThisWeek =
      this.recentTrips.length;
  }

  calculateBackendRiskScore(
    trip: BackendTripResponse
  ): number {
    let score = 100;

    score -=
      (trip.thresholdExceededCount ?? 0) * 5;

    if ((trip.maximumSpeedKmh ?? 0) > 100) {
      score -= 10;
    }

    if (score < 0) {
      score = 0;
    }

    return score;
  }

  calculateRiskScore(
    trip: Trip
  ): number {
    let score = 100;

    score -=
      (trip.thresholdExceededCount ?? 0) * 5;

    if ((trip.maximumSpeed ?? 0) > 100) {
      score -= 10;
    }

    if (score < 0) {
      score = 0;
    }

    return score;
  }

  getRiskLevel(
    score: number
  ): string {
    if (score >= 80) {
      return 'Low Risk';
    }

    if (score >= 50) {
      return 'Moderate Risk';
    }

    return 'High Risk';
  }

  // ========================
  // START TRIP
  // ========================
  async startTrip(): Promise<void> {
    if (this.isStartingTrip) {
      return;
    }

    this.isStartingTrip = true;

    try {
      console.log(
        'Step 1 - Requesting permission'
      );

      const granted =
        await this.locationService
          .requestPermission();

      console.log(
        'Permission result:',
        granted
      );

      if (!granted) {
        alert(
          'Location permission is required to start a trip.'
        );

        return;
      }

      console.log(
        'Step 2 - Getting location'
      );

      const startLocation =
        await this.locationService
          .getCurrentLocation();

      console.log(
        'Start location:',
        startLocation
      );

      if (!startLocation) {
        alert(
          'Unable to get current location. Please enable GPS and try again.'
        );

        return;
      }

      console.log(
        'Step 3 - Calling backend'
      );

      const success =
        await this.tripService
          .startTrip(startLocation);

      console.log(
        'Backend returned:',
        success
      );

      if (
        !success ||
        !this.tripService.activeTrip
      ) {
        alert(
          'Could not start trip. Please try again.'
        );

        return;
      }

      console.log(
        'Step 4 - Starting GPS tracking'
      );

      await this.locationService.startTracking(
        (point) => {
          if (this.tripService.activeTrip) {
            this.tripService.activeTrip
              .gpsPoints
              .push(point);

            this.tripService.activeTrip
              .gpsPointCount =
              this.tripService.activeTrip
                .gpsPoints.length;
          }
        }
      );

      console.log(
        'GPS tracking started'
      );

      console.log(
        'Step 5 - Navigating'
      );

      await this.router.navigate(
        ['/active-trip']
      );
    } catch (error) {
      console.error(
        'Start trip failed:',
        error
      );

      alert(
        'Failed to start trip. Please check your GPS settings.'
      );
    } finally {
      this.isStartingTrip = false;
    }
  }

  viewAllTrips(event: Event): void {
  event.preventDefault();

  this.router.navigate(
    ['/trip-history']
  );
}

  trackTrip(
    index: number,
    trip: BackendTripResponse
  ): number {
    return trip.id ?? index;
  }
}