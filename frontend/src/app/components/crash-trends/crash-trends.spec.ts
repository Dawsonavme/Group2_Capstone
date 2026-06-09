import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrashTrends } from './crash-trends';

describe('CrashTrends', () => {
  let component: CrashTrends;
  let fixture: ComponentFixture<CrashTrends>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrashTrends],
    }).compileComponents();

    fixture = TestBed.createComponent(CrashTrends);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
