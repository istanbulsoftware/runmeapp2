import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarRegisteration2Page } from './car-registeration2.page';

describe('CarRegisteration2Page', () => {
  let component: CarRegisteration2Page;
  let fixture: ComponentFixture<CarRegisteration2Page>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CarRegisteration2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
