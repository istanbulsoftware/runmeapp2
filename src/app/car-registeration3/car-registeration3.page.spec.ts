import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarRegisteration3Page } from './car-registeration3.page';

describe('CarRegisteration3Page', () => {
  let component: CarRegisteration3Page;
  let fixture: ComponentFixture<CarRegisteration3Page>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CarRegisteration3Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
