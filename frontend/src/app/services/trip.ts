import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { PendingTripService } from './pending-trip.service';

export interface GPSPoint {
  latitude: number;
  longitude: number;
  timestamp: number;
  accuracy?: number;
  speed?: number;
  speedKmh?: number;
  lowAccuracy?: boolean;
}

export interface TripLocation extends GPSPoint {}

export interface BackendTripResponse {
  id: number;
  startTime: string;
  endTime?: string | null;

  startLatitude: number;
  startLongitude: number;

  endLatitude?: number | null;
  endLongitude?: number | null;

  gpsPointCount: number;
  distanceKm?: number | null;

  averageSpeedKmh?: number | null;
  maximumSpeedKmh?: number | null;
  thresholdExceededCount?: number | null;
  postTripMessage?: string | null;

  status: 'active' | 'completed';
}

export interface Trip {
  id: number;
  startTime: Date;
  endTime?: Date;
  duration?: string;
  distanceKm?: number;

  startLocation?: TripLocation;
  endLocation?: TripLocation;

  gpsPoints: GPSPoint[];
  gpsPointCount: number;

  averageSpeed?: number;
  maximumSpeed?: number;

  prototypeThreshold?: number;
  thresholdExceededCount?: number;

  postTripMessage?: string;

  status: 'active' | 'completed';
}

export type TripStatus =
  | 'notStarted'
  | 'active'
  | 'completed';

@Injectable({
  providedIn: 'root'
})
export class TripService {

  private readonly apiUrl =
    `${environment.apiUrl}/api/trips`;

  readonly PROTOTYPE_THRESHOLD = 50;

  tripStatus: TripStatus = 'notStarted';
  activeTrip: Trip | null = null;
  completedTrip: Trip | null = null;

  constructor(
    private http: HttpClient,
    private pendingTripService: PendingTripService
  ) {}

  async startTrip(
    startLocation: TripLocation
  ): Promise<boolean> {

    if (this.tripStatus === 'active') {
      return false;
    }

    const startTime = new Date();

    const requestBody = {
      startTime: startTime.toISOString(),
      startLocation
    };

    try {
      const response = await firstValueFrom(
        this.http.post<BackendTripResponse>(
          `${this.apiUrl}/start`,
          requestBody
        )
      );

      this.activeTrip = {
        id: response.id,
        startTime: new Date(response.startTime),
        startLocation,
        gpsPoints: [],
        gpsPointCount: response.gpsPointCount,
        status: response.status
      };

      this.tripStatus = 'active';
      this.completedTrip = null;

      console.log(
        'Trip created by backend:',
        response
      );

      return true;

    } catch (error) {
      console.error(
        'Backend start trip request failed:',
        error
      );

      return false;
    }
  }

  async endTrip(
    endLocation: TripLocation
  ): Promise<boolean> {

    if (
      !this.activeTrip ||
      this.tripStatus !== 'active'
    ) {
      return false;
    }

    const endTime = new Date();

    const requestBody = {
      endTime: endTime.toISOString(),
      endLocation,
      gpsPoints: this.activeTrip.gpsPoints,
      gpsPointCount:
        this.activeTrip.gpsPoints.length
    };

    try {
      const response = await firstValueFrom(
        this.http.put<BackendTripResponse>(
          `${this.apiUrl}/${this.activeTrip.id}/end`,
          requestBody
        )
      );

      this.activeTrip.endTime =
        new Date(response.endTime!);

      this.activeTrip.endLocation =
        endLocation;

      this.activeTrip.gpsPointCount =
        response.gpsPointCount;

      this.activeTrip.distanceKm =
        response.distanceKm ?? 0;

      this.activeTrip.status =
        response.status;

      this.activeTrip.averageSpeed =
        this.calculateAverageSpeed();

      this.activeTrip.maximumSpeed =
        this.calculateMaximumSpeed();

      this.activeTrip.prototypeThreshold =
        this.PROTOTYPE_THRESHOLD;

      this.activeTrip.thresholdExceededCount =
        this.calculateThresholdExceeded();

      this.activeTrip.postTripMessage =
        this.generatePostTripMessage();

      this.activeTrip.duration =
        this.calculateDuration(
          this.activeTrip.startTime,
          this.activeTrip.endTime
        );

      console.log(
        'Calculated frontend trip analytics:',
        {
          averageSpeed:
            this.activeTrip.averageSpeed,
          maximumSpeed:
            this.activeTrip.maximumSpeed,
          thresholdExceededCount:
            this.activeTrip
              .thresholdExceededCount,
          postTripMessage:
            this.activeTrip.postTripMessage
        }
      );

      this.completedTrip = {
        ...this.activeTrip
      };

      this.tripStatus = 'completed';

      console.log(
        'Trip completed by backend:',
        response
      );

      return true;

    } catch (error) {
      console.error(
        'Backend end trip request failed:',
        error
      );

      this.pendingTripService.savePendingTrip(
        this.activeTrip.id,
        requestBody
      );

      this.activeTrip.endTime = endTime;
      this.activeTrip.endLocation = endLocation;
      this.activeTrip.gpsPointCount =
        this.activeTrip.gpsPoints.length;

      this.activeTrip.averageSpeed =
        this.calculateAverageSpeed();

      this.activeTrip.maximumSpeed =
        this.calculateMaximumSpeed();

      this.activeTrip.prototypeThreshold =
        this.PROTOTYPE_THRESHOLD;

      this.activeTrip.thresholdExceededCount =
        this.calculateThresholdExceeded();

      this.activeTrip.postTripMessage =
        'The backend could not be reached. This trip was saved on this device and is pending synchronization.';

      this.activeTrip.duration =
        this.calculateDuration(
          this.activeTrip.startTime,
          endTime
        );

      this.activeTrip.status = 'completed';

      this.completedTrip = {
        ...this.activeTrip
      };

      this.tripStatus = 'completed';

      return true;
    }
  }

  async syncPendingTrips(): Promise<number> {

  const pendingTrips =
    this.pendingTripService.getPendingTrips();

  if (pendingTrips.length === 0) {
    console.log(
      'No pending trips to synchronize.'
    );

    return 0;
  }

  let successfulSyncCount = 0;

  for (const pendingTrip of pendingTrips) {
    try {
      const response = await firstValueFrom(
        this.http.put<BackendTripResponse>(
          `${this.apiUrl}/${pendingTrip.backendTripId}/end`,
          pendingTrip.payload
        )
      );

      this.pendingTripService.removePendingTrip(
        pendingTrip.localId
      );

      successfulSyncCount++;

      console.log(
        'Pending trip synchronized successfully:',
        response
      );

    } catch (error) {
      this.pendingTripService.incrementRetryCount(
        pendingTrip.localId
      );

      console.error(
        `Pending trip ${pendingTrip.backendTripId} could not be synchronized:`,
        error
      );
    }
  }

  return successfulSyncCount;
}

  private calculateAverageSpeed(): number {
    if (!this.activeTrip) {
      return 0;
    }

    const validSpeeds =
      this.activeTrip.gpsPoints
        .map(point => point.speedKmh)
        .filter(
          (speed): speed is number =>
            speed !== undefined &&
            Number.isFinite(speed) &&
            speed >= 0
        );

    if (validSpeeds.length === 0) {
      return 0;
    }

    const totalSpeed =
      validSpeeds.reduce(
        (sum, speed) => sum + speed,
        0
      );

    return Number(
      (
        totalSpeed /
        validSpeeds.length
      ).toFixed(1)
    );
  }

  private calculateMaximumSpeed(): number {
    if (!this.activeTrip) {
      return 0;
    }

    const validSpeeds =
      this.activeTrip.gpsPoints
        .map(point => point.speedKmh)
        .filter(
          (speed): speed is number =>
            speed !== undefined &&
            Number.isFinite(speed) &&
            speed >= 0
        );

    if (validSpeeds.length === 0) {
      return 0;
    }

    return Number(
      Math.max(...validSpeeds).toFixed(1)
    );
  }

  private calculateThresholdExceeded(): number {
    if (!this.activeTrip) {
      return 0;
    }

    return this.activeTrip.gpsPoints.filter(
      point =>
        point.speedKmh !== undefined &&
        Number.isFinite(point.speedKmh) &&
        point.speedKmh >
          this.PROTOTYPE_THRESHOLD
    ).length;
  }

  private generatePostTripMessage(): string {
    if (!this.activeTrip) {
      return '';
    }

    const validSpeedCount =
      this.activeTrip.gpsPoints.filter(
        point =>
          point.speedKmh !== undefined &&
          Number.isFinite(point.speedKmh)
      ).length;

    if (validSpeedCount === 0) {
      return 'Your trip was recorded, but speed data was unavailable for this trip.';
    }

    const exceededCount =
      this.activeTrip
        .thresholdExceededCount ?? 0;

    if (exceededCount > 0) {
      return `Your recorded speed exceeded the prototype threshold ${exceededCount} time(s).`;
    }

    return 'Your trip was recorded successfully. No prototype speed threshold exceedances were detected.';
  }

  private calculateDuration(
    start: Date,
    end: Date
  ): string {

    const diffMs =
      end.getTime() - start.getTime();

    const minutes =
      Math.floor(diffMs / 60000);

    const seconds =
      Math.floor(
        (diffMs % 60000) / 1000
      );

    return `${minutes}m ${seconds}s`;
  }

  reset(): void {
    this.tripStatus = 'notStarted';
    this.activeTrip = null;
    this.completedTrip = null;
  }

  async getAllTrips():
    Promise<BackendTripResponse[]> {

    try {
      const response =
        await firstValueFrom(
          this.http.get<
            BackendTripResponse[]
          >(this.apiUrl)
        );

      console.log(
        'Trips returned by backend:',
        response
      );

      return response;

    } catch (error) {
      console.error(
        'Backend trip history request failed:',
        error
      );

      return [];
    }
  }

  async getTripById(
    tripId: number
  ): Promise<BackendTripResponse | null> {

    try {
      const response =
        await firstValueFrom(
          this.http.get<
            BackendTripResponse
          >(
            `${this.apiUrl}/${tripId}`
          )
        );

      console.log(
        'Historical trip returned by backend:',
        response
      );

      return response;

    } catch (error) {
      console.error(
        `Could not load trip ${tripId}:`,
        error
      );

      return null;
    }
  }
}