import {
  ChangeDetectorRef,
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

  private timerId: ReturnType<typeof setInterval> | null = null;

  constructor(
    public tripService: TripService,
    private router: Router,
    private locationService: LocationService,
    private changeDetectorRef: ChangeDetectorRef
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
    const points = this.tripService.activeTrip?.gpsPoints ?? [];

    return points.length > 0
      ? points[points.length - 1]
      : null;
  }

  get currentSpeedKmh(): number | null {
    return this.latestGPSPoint?.speedKmh ?? null;
  }

  private updateElapsedTime(): void {
    const startTime =
      this.tripService.activeTrip?.startTime;

    if (!startTime) {
      this.elapsedTime = '0m 0s';
      return;
    }

    const totalSeconds = Math.floor(
      (Date.now() - startTime.getTime()) / 1000
    );

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    this.elapsedTime =
      hours > 0
        ? `${hours}h ${minutes}m ${seconds}s`
        : `${minutes}m ${seconds}s`;

    this.changeDetectorRef.detectChanges();
  }

  private stopTimer(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  async endTrip(): Promise<void> {
    if (this.isEnding || !this.tripService.activeTrip) {
      return;
    }

    this.isEnding = true;
    this.stopTimer();

    try {
      const activeTrip = this.tripService.activeTrip;

      let endLocation =
        await this.locationService.getCurrentLocation();

      if (!endLocation) {
        endLocation =
          this.latestGPSPoint ??
          activeTrip.startLocation ??
          null;
      }

      if (!endLocation) {
        alert('Unable to determine an ending location.');
        return;
      }

      await this.locationService.stopTracking();

      const success =
        await this.tripService.endTrip(endLocation);

      if (!success) {
        alert('The trip could not be completed.');
        return;
      }

      await this.router.navigate(['/trip-summary']);

    } catch (error) {
      console.error('End trip error:', error);
      alert('An error occurred while ending the trip.');

    } finally {
      this.isEnding = false;

      if (this.tripService.tripStatus === 'active') {
        this.ngOnInit();
      }
    }
  }
}