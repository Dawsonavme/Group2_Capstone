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

  constructor(
    private tripService: TripService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    await this.loadTrips();
  }

  async loadTrips(): Promise<void> {
    this.isLoading = true;
    this.errorMessage = '';

    try {
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