import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarRegisterationPage } from './car-registeration.page';

describe('CarRegisterationPage', () => {
  let component: CarRegisterationPage;
  let fixture: ComponentFixture<CarRegisterationPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CarRegisterationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
