import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyDriving } from './my-driving';

describe('MyDriving', () => {
  let component: MyDriving;
  let fixture: ComponentFixture<MyDriving>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyDriving],
    }).compileComponents();

    fixture = TestBed.createComponent(MyDriving);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
