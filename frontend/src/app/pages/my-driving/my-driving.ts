import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TripService } from '../../services/trip';
import { IonContent, IonButton, IonHeader, IonToolbar, IonTitle } from "@ionic/angular/standalone";

@Component({
  selector: 'app-my-driving',

  // Import CommonModule so we can use *ngFor and other directives
  imports: [ IonContent, IonButton, IonHeader, IonToolbar, IonTitle,CommonModule],

  templateUrl: './my-driving.html',
  styleUrl: './my-driving.css'
})
export class MyDriving {
  constructor(
    public tripService: TripService,
    private router: Router
  ) {}

  startTrip() {
  if (this.tripService.tripStatus === 'active') {
    alert('Trip already active');
    return;
  }

  const success = this.tripService.startTrip();
  if (success) {
    this.router.navigate(['/active-trip']);
  } else {
    alert('Failed to start trip');
  }
}
  // ==========================================================
  // USER RISK SUMMARY
  // ==========================================================

  // Overall driver risk score
  driverRiskScore = 68;

  // Risk category
  riskLevel = 'Moderate Risk';

  // Weekly improvement message
  weeklyImprovement = '+8 points improved vs last 7 days';

  // ==========================================================
  // DRIVING BEHAVIOUR METRICS
  // ==========================================================

  speeding = 14;

  harshBraking = 18;

  rapidAcceleration = 22;

  nightDriving = 35;

  tripsThisWeek = 12;

  phoneUsage = 2;

  // ==========================================================
  // RECENT TRIPS
  // These are displayed using Angular's *ngFor directive
  // ==========================================================

  recentTrips = [

    {
      date: 'May 15, 2024',

      time: '6:45 PM',

      distance: '21 km',

      duration: '28 min',

      type: 'Night Trip',

      summary:
        'Speeding: High • Braking: High • Acceleration: Moderate',

      score: 62
    },

    {
      date: 'May 14, 2024',

      time: '4:20 PM',

      distance: '14 km',

      duration: '19 min',

      type: 'City Trip',

      summary:
        'Speeding: Low • Braking: Moderate • Acceleration: Good',

      score: 78
    },

    {
      date: 'May 13, 2024',

      time: '8:10 AM',

      distance: '32 km',

      duration: '36 min',

      type: 'Highway Trip',

      summary:
        'Speeding: Moderate • Braking: Low • Acceleration: Moderate',

      score: 71
    }

  ];

}