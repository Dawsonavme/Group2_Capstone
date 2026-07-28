import { Injectable } from '@angular/core';
import type {
  GPSPoint,
  TripLocation
} from './trip';

export interface PendingTripPayload {
  endTime: string;
  endLocation: TripLocation;
  gpsPoints: GPSPoint[];
  gpsPointCount: number;
}

export interface PendingTrip {
  localId: string;
  backendTripId: number;
  payload: PendingTripPayload;
  savedAt: string;
  retryCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class PendingTripService {

  private readonly storageKey =
    'pendingTrips';

  getPendingTrips(): PendingTrip[] {
    const storedTrips =
      localStorage.getItem(this.storageKey);

    if (!storedTrips) {
      return [];
    }

    try {
      const parsedTrips =
        JSON.parse(storedTrips);

      if (!Array.isArray(parsedTrips)) {
        return [];
      }

      return parsedTrips as PendingTrip[];

    } catch (error) {
      console.error(
        'Could not read pending trips:',
        error
      );

      return [];
    }
  }

  savePendingTrip(
    backendTripId: number,
    payload: PendingTripPayload
  ): PendingTrip {

    const pendingTrips =
      this.getPendingTrips();

    const existingTrip =
      pendingTrips.find(
        trip =>
          trip.backendTripId ===
          backendTripId
      );

    if (existingTrip) {
      console.log(
        'Trip is already stored locally:',
        existingTrip
      );

      return existingTrip;
    }

    const pendingTrip: PendingTrip = {
      localId: this.createLocalId(),
      backendTripId,
      payload,
      savedAt: new Date().toISOString(),
      retryCount: 0
    };

    pendingTrips.push(pendingTrip);

    this.storePendingTrips(pendingTrips);

    console.log(
      'Trip saved locally for later synchronization:',
      pendingTrip
    );

    return pendingTrip;
  }

  removePendingTrip(
    localId: string
  ): void {

    const remainingTrips =
      this.getPendingTrips().filter(
        trip => trip.localId !== localId
      );

    this.storePendingTrips(
      remainingTrips
    );
  }

  incrementRetryCount(
    localId: string
  ): void {

    const pendingTrips =
      this.getPendingTrips();

    const trip =
      pendingTrips.find(
        pendingTrip =>
          pendingTrip.localId === localId
      );

    if (!trip) {
      return;
    }

    trip.retryCount++;

    this.storePendingTrips(
      pendingTrips
    );
  }

  getPendingTripCount(): number {
    return this.getPendingTrips().length;
  }

  private storePendingTrips(
    pendingTrips: PendingTrip[]
  ): void {

    try {
      localStorage.setItem(
        this.storageKey,
        JSON.stringify(pendingTrips)
      );

    } catch (error) {
      console.error(
        'Could not save pending trips:',
        error
      );
    }
  }

  private createLocalId(): string {
    if (
      typeof crypto !== 'undefined' &&
      typeof crypto.randomUUID ===
        'function'
    ) {
      return crypto.randomUUID();
    }

    return [
      'pending',
      Date.now(),
      Math.random()
        .toString(36)
        .substring(2, 10)
    ].join('-');
  }
}