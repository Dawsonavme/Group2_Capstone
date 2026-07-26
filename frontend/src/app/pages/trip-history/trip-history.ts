import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  BackendTripResponse,
  TripService
} from '../../services/trip';
import {
  PendingTripService
} from '../../services/pending-trip.service';

@Component({
  selector: 'app-trip-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trip-history.html',
  styleUrl: './trip-history.css'
})
export class TripHistory implements OnInit {

  trips: BackendTripResponse[] = [];

  isLoading = false;
  errorMessage = '';
  syncMessage = '';
  pendingTripCount = 0;

  constructor(
    private tripService: TripService,
    private pendingTripService: PendingTripService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    await this.loadTrips();
  }

  async loadTrips(): Promise<void> {
    this.isLoading = true;
    this.errorMessage = '';
    this.syncMessage = '';

    this.pendingTripCount =
      this.pendingTripService
        .getPendingTripCount();

    try {
      const syncedCount =
        await this.tripService
          .syncPendingTrips();

      this.pendingTripCount =
        this.pendingTripService
          .getPendingTripCount();

      if (syncedCount === 1) {
        this.syncMessage =
          '1 pending trip synchronized successfully.';
      } else if (syncedCount > 1) {
        this.syncMessage =
          `${syncedCount} pending trips synchronized successfully.`;
      } else if (this.pendingTripCount > 0) {
        this.syncMessage =
          `${this.pendingTripCount} trip(s) are still waiting to synchronize.`;
      } else {
        this.syncMessage =
          'All trips are synchronized.';
      }

      console.log(
        'Pending trips synchronized:',
        syncedCount
      );

      this.trips =
        await this.tripService.getAllTrips();

      console.log(
        'All trip history loaded:',
        this.trips
      );

    } catch (error) {
      console.error(
        'Could not load trip history:',
        error
      );

      this.errorMessage =
        'Could not load trip history.';

      this.trips = [];

    } finally {
      this.isLoading = false;

      this.changeDetectorRef.detectChanges();
    }
  }

  viewTripDetails(
    tripId: number
  ): void {
    this.router.navigate(
      ['/trip-history', tripId]
    );
  }

  goBack(): void {
    this.router.navigate(['/my-driving']);
  }

  trackTrip(
    index: number,
    trip: BackendTripResponse
  ): number {
    return trip.id ?? index;
  }
}