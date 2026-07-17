import {
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
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
export class ActiveTrip implements OnInit, OnDestroy {

  isEnding = false;

  elapsedTime = '0m 0s';

  private timerId:
    ReturnType<typeof setInterval> | null = null;

  constructor(
    public tripService: TripService,
    private router: Router,
    private locationService: LocationService
  ) {}

  ngOnInit(): void {
    this.updateElapsedTime();

    this.timerId = setInterval(() => {
      this.updateElapsedTime();
    }, 1000);
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  get latestGPSPoint() {
    const activeTrip =
      this.tripService.activeTrip;

    if (
      !activeTrip ||
      activeTrip.gpsPoints.length === 0
    ) {
      return null;
    }

    return activeTrip.gpsPoints[
      activeTrip.gpsPoints.length - 1
    ];
  }

  get currentSpeedKmh(): number | null {
    const latestPoint =
      this.latestGPSPoint;

    if (
      !latestPoint ||
      latestPoint.speedKmh === undefined
    ) {
      return null;
    }

    return latestPoint.speedKmh;
  }

  private updateElapsedTime(): void {
    const activeTrip =
      this.tripService.activeTrip;

    if (!activeTrip) {
      this.elapsedTime = '0m 0s';
      return;
    }

    const now = Date.now();

    const startTime =
      activeTrip.startTime.getTime();

    const elapsedMilliseconds =
      Math.max(0, now - startTime);

    const totalSeconds =
      Math.floor(
        elapsedMilliseconds / 1000
      );

    const hours =
      Math.floor(totalSeconds / 3600);

    const minutes =
      Math.floor(
        (totalSeconds % 3600) / 60
      );

    const seconds =
      totalSeconds % 60;

    if (hours > 0) {
      this.elapsedTime =
        `${hours}h ${minutes}m ${seconds}s`;

      return;
    }

    this.elapsedTime =
      `${minutes}m ${seconds}s`;
  }

  private stopTimer(): void {
    if (this.timerId === null) {
      return;
    }

    clearInterval(this.timerId);

    this.timerId = null;
  }

  private restartTimerIfTripStillActive(): void {
    if (
      this.tripService.activeTrip &&
      this.tripService.tripStatus === 'active' &&
      this.timerId === null
    ) {
      this.timerId = setInterval(() => {
        this.updateElapsedTime();
      }, 1000);
    }
  }

  async endTrip(): Promise<void> {
    if (
      this.isEnding ||
      !this.tripService.activeTrip
    ) {
      return;
    }

    this.isEnding = true;

    this.stopTimer();

    try {
      const activeTrip =
        this.tripService.activeTrip;

      console.log(
        'Requesting final trip location'
      );

      let endLocation =
        await this.locationService
          .getCurrentLocation();

      if (!endLocation) {
        const gpsPoints =
          activeTrip.gpsPoints;

        endLocation =
          gpsPoints.length > 0
            ? gpsPoints[
                gpsPoints.length - 1
              ]
            : activeTrip.startLocation ?? null;

        console.warn(
          'Final GPS request failed. Using the latest available trip location.',
          endLocation
        );
      }

      if (!endLocation) {
        alert(
          'Unable to determine an ending location.'
        );

        return;
      }

      await this.locationService
        .stopTracking();

      const success =
        await this.tripService.endTrip(
          endLocation
        );

      if (!success) {
        alert(
          'The trip could not be completed.'
        );

        return;
      }

      console.log(
        'Trip ended successfully'
      );

      await this.router.navigate(
        ['/trip-summary']
      );
    } catch (error) {
      console.error(
        'End trip error:',
        error
      );

      alert(
        'An error occurred while ending the trip.'
      );
    } finally {
      this.isEnding = false;

      this.restartTimerIfTripStillActive();
    }
  }
}