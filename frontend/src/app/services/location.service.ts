import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { GPSPoint } from './trip';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  private watchId: string | null = null;
  private lastUpdate = 0;

  // Request location permission
  async requestPermission(): Promise<boolean> {
    try {
      const status = await Geolocation.checkPermissions();
      if (status.location === 'granted') return true;

      const permission = await Geolocation.requestPermissions();
      return permission.location === 'granted';
    } catch (e) {
      console.error('Permission error:', e);
      return false;
    }
  }

  // Get single current location (used for start & end)
  async getCurrentLocation(): Promise<GPSPoint | null> {
    try {
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      });

      return {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        timestamp: position.timestamp,
        accuracy: position.coords.accuracy,
        speed: position.coords.speed ?? undefined,
        lowAccuracy: position.coords.accuracy == null || position.coords.accuracy > 50
      };
    } catch (error) {
      console.error("getCurrentLocation error:", error);
      return null;
    }
  }

  // Start continuous GPS tracking
  async startTracking(callback: (point: GPSPoint) => void): Promise<void> {
    if (this.watchId) await this.stopTracking();

    this.lastUpdate = Date.now();

    try {
      this.watchId = await Geolocation.watchPosition(
        {
          enableHighAccuracy: true,
          timeout: 3000,
          maximumAge: 1000
        },
        (position, err) => {
          if (err || !position) return;

          // Validation: must have lat/lon
          if (position.coords.latitude == null || position.coords.longitude == null) {
            console.warn('Received invalid GPS point (missing lat/lon)');
            return;
          }

          const point: GPSPoint = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            timestamp: position.timestamp,
            accuracy: position.coords.accuracy,
            speed: position.coords.speed ?? undefined,
            lowAccuracy: !position.coords.accuracy || position.coords.accuracy > 50
          };

          const now = Date.now();
          if (now - this.lastUpdate > 2000) {  // Throttle
            this.lastUpdate = now;
            console.log("📍 GPS Point collected:", point);
            callback(point);
          }
        }
      );
      console.log('✅ GPS tracking started');
    } catch (error) {
      console.error('Failed to start GPS tracking:', error);
    }
  }

  // Stop GPS tracking
  async stopTracking(): Promise<void> {
    if (!this.watchId) return;

    try {
      await Geolocation.clearWatch({ id: this.watchId });
      console.log('✅ GPS tracking stopped');
    } catch (e) {
      console.error("Error stopping watch:", e);
    } finally {
      this.watchId = null;
      this.lastUpdate = 0;
    }
  }
}