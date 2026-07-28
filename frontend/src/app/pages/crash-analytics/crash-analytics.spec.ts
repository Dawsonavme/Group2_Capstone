import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrashAnalytics } from './crash-analytics';

describe('CrashAnalytics', () => {
  let component: CrashAnalytics;
  let fixture: ComponentFixture<CrashAnalytics>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrashAnalytics],
    }).compileComponents();

    fixture = TestBed.createComponent(CrashAnalytics);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
