import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskDistribution } from './risk-distribution';

describe('RiskDistribution', () => {
  let component: RiskDistribution;
  let fixture: ComponentFixture<RiskDistribution>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RiskDistribution],
    }).compileComponents();

    fixture = TestBed.createComponent(RiskDistribution);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
