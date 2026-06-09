import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripAnalytics } from './trip-analytics';

describe('TripAnalytics', () => {
  let component: TripAnalytics;
  let fixture: ComponentFixture<TripAnalytics>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TripAnalytics],
    }).compileComponents();

    fixture = TestBed.createComponent(TripAnalytics);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
