import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ActivatedRoute,
  Router
} from '@angular/router';
import {
  BackendTripResponse,
  TripService
} from '../../services/trip';

@Component({
  selector: 'app-trip-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trip-details.html',
  styleUrl: './trip-details.css'
})
export class TripDetails implements OnInit {

  tripId: number | null = null;

  trip: BackendTripResponse | null = null;

  isLoading = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tripService: TripService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    const tripIdValue =
      this.route.snapshot.paramMap.get('tripId');

    if (tripIdValue === null) {
      this.errorMessage =
        'No trip ID was provided.';

      return;
    }

    const parsedTripId =
      Number(tripIdValue);

    if (
      !Number.isInteger(parsedTripId) ||
      parsedTripId <= 0
    ) {
      this.errorMessage =
        'The trip ID is invalid.';

      return;
    }

    this.tripId = parsedTripId;

    await this.loadTrip();
  }

  async loadTrip(): Promise<void> {
    if (this.tripId === null) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      this.trip =
        await this.tripService.getTripById(
          this.tripId
        );

      if (!this.trip) {
        this.errorMessage =
          'The selected trip could not be found.';
      }

      console.log(
        'Trip details loaded:',
        this.trip
      );
    } catch (error) {
      console.error(
        'Could not load trip details:',
        error
      );

      this.errorMessage =
        'Could not load trip details.';

      this.trip = null;
    } finally {
      this.isLoading = false;

      this.changeDetectorRef.detectChanges();
    }
  }

  goBack(): void {
    this.router.navigate(
      ['/trip-history']
    );
  }
}