import { Routes } from '@angular/router';

// Import all tab/page components
import { MyDriving } from './pages/my-driving/my-driving';
import { CrashAnalytics } from './pages/crash-analytics/crash-analytics';
import { Trends } from './pages/trends/trends';
import { Recommendations } from './pages/recommendations/recommendations';

// Application routes for tab navigation
export const routes: Routes = [
  // Default route opens the user-specific tab first
  {
    path: '',
    redirectTo: 'my-driving',
    pathMatch: 'full'
  },

  // Tab 1: User-specific driving data
  {
    path: 'my-driving',
    component: MyDriving
  },

  // Tab 2: Generalized crash analytics
  {
    path: 'crash-analytics',
    component: CrashAnalytics
  },

  // Tab 3: Generalized trend data
  {
    path: 'trends',
    component: Trends
  },

  // Tab 4: Safety recommendations
  {
    path: 'recommendations',
    component: Recommendations
  }
];