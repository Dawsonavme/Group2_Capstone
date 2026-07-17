import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { GPSPoint } from './trip';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  private watchId: string | null = null;
  private lastUpdate = 0;

  async requestPermission(): Promise<boolean> {
    try {
      const status = await Geolocation.checkPermissions();

      if (status.location === 'granted') {
        return true;
      }

      const permission = await Geolocation.requestPermissions();

      return permission.location === 'granted';
    } catch (error) {
      console.error('Permission error:', error);
      return false;
    }
  }

  async getCurrentLocation(): Promise<GPSPoint | null> {
    try {
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      });

      const rawSpeed = position.coords.speed;

      const validSpeed =
        rawSpeed !== null &&
        rawSpeed !== undefined &&
        !Number.isNaN(rawSpeed) &&
        rawSpeed >= 0;

      return {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        timestamp: position.timestamp,
        accuracy: position.coords.accuracy,
        speed: validSpeed ? rawSpeed : undefined,
        speedKmh: validSpeed ? rawSpeed * 3.6 : undefined,
        lowAccuracy:
          position.coords.accuracy == null ||
          position.coords.accuracy > 50
      };
    } catch (error) {
      console.error('getCurrentLocation error:', error);
      return null;
    }
  }

  async startTracking(
    callback: (point: GPSPoint) => void
  ): Promise<void> {

    if (this.watchId) {
      await this.stopTracking();
    }

    this.lastUpdate = Date.now();

    try {
      this.watchId = await Geolocation.watchPosition(
        {
          enableHighAccuracy: true,
          timeout: 3000,
          maximumAge: 1000
        },
        (position, error) => {

          if (error || !position) {
            return;
          }

          if (
            position.coords.latitude == null ||
            position.coords.longitude == null
          ) {
            console.warn('Invalid GPS point received');
            return;
          }

          const rawSpeed = position.coords.speed;

          const validSpeed =
            rawSpeed !== null &&
            rawSpeed !== undefined &&
            !Number.isNaN(rawSpeed) &&
            rawSpeed >= 0;

          const point: GPSPoint = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            timestamp: position.timestamp,
            accuracy: position.coords.accuracy,
            speed: validSpeed ? rawSpeed : undefined,
            speedKmh: validSpeed ? rawSpeed * 3.6 : undefined,
            lowAccuracy:
              position.coords.accuracy == null ||
              position.coords.accuracy > 50
          };

          console.log('GPS point collected:', {
            latitude: point.latitude,
            longitude: point.longitude,
            accuracy: point.accuracy,
            speedMps: point.speed,
            speedKmh: point.speedKmh,
            lowAccuracy: point.lowAccuracy
          });

          const now = Date.now();

          if (now - this.lastUpdate >= 2000) {
            this.lastUpdate = now;
            callback(point);
          }
        }
      );

      console.log('GPS tracking started');
    } catch (error) {
      console.error('Failed to start tracking:', error);
    }
  }

  async stopTracking(): Promise<void> {
    if (!this.watchId) {
      return;
    }

    try {
      await Geolocation.clearWatch({
        id: this.watchId
      });

      console.log('GPS tracking stopped');
    } catch (error) {
      console.error('Stop tracking error:', error);
    } finally {
      this.watchId = null;
      this.lastUpdate = 0;
    }
  }
}