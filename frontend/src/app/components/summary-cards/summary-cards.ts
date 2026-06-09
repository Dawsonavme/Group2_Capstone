// Imports Angular core functionality
import { Component } from '@angular/core';

// Imports Angular Material icon module
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-summary-cards',

  // Makes Material icons available in this component
  imports: [MatIconModule],

  templateUrl: './summary-cards.html',
  styleUrl: './summary-cards.css'
})
export class SummaryCards {

  // Static dashboard metrics for now.
  // Later these values will come from the Spring Boot backend.

}