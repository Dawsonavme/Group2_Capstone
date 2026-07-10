import { Injectable } from '@angular/core';

export interface Trip {
  id: number;
  startTime: Date;
  endTime?: Date;
  duration?: string;
  gpsPoints: any[];
  speedReadings: any[];
  status: 'active' | 'completed';
}

export type TripStatus = 'notStarted' | 'active' | 'completed';

@Injectable({
  providedIn: 'root'
})
export class TripService {

  tripStatus: TripStatus = 'notStarted';
  activeTrip: Trip | null = null;
  completedTrip: Trip | null = null;

  startTrip(): boolean {
    if (this.tripStatus === 'active') return false;

    this.activeTrip = {
      id: Date.now(),
      startTime: new Date(),
      gpsPoints: [],
      speedReadings: [],
      status: 'active'
    };

    this.tripStatus = 'active';
    this.completedTrip = null;
    return true;
  }

  endTrip(): boolean {
    if (!this.activeTrip || this.tripStatus !== 'active') {
      return false;
    }

    this.activeTrip.endTime = new Date();
    this.activeTrip.status = 'completed';
    this.activeTrip.duration = this.calculateDuration(this.activeTrip.startTime, this.activeTrip.endTime);

    this.completedTrip = { ...this.activeTrip };
    this.tripStatus = 'completed';

    return true;
  }

  private calculateDuration(start: Date, end: Date): string {
    const diffMs = end.getTime() - start.getTime();
    const minutes = Math.floor(diffMs / 60000);
    const seconds = Math.floor((diffMs % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  }

  reset() {
    this.tripStatus = 'notStarted';
    this.activeTrip = null;
    this.completedTrip = null;
  }
}