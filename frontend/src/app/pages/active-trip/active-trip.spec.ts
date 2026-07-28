import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveTrip } from './active-trip';

describe('ActiveTrip', () => {
  let component: ActiveTrip;
  let fixture: ComponentFixture<ActiveTrip>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActiveTrip],
    }).compileComponents();

    fixture = TestBed.createComponent(ActiveTrip);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
