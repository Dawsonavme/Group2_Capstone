import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { IonApp, IonHeader, IonToolbar, IonTitle, IonContent } from "@ionic/angular/standalone";

@Component({
  selector: 'app-root',

  // RouterOutlet displays the selected tab page
  // RouterLink and RouterLinkActive support tab navigation
  imports: [IonContent, IonTitle, IonToolbar, IonHeader, IonApp, RouterOutlet, RouterLink, RouterLinkActive],

  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  // Root component for the Driver Safety Analytics frontend
}