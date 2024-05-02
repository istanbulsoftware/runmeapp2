import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarRegisteration4Page } from './car-registeration4.page';

describe('CarRegisteration4Page', () => {
  let component: CarRegisteration4Page;
  let fixture: ComponentFixture<CarRegisteration4Page>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CarRegisteration4Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
