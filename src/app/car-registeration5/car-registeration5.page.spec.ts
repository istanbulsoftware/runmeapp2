import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarRegisteration5Page } from './car-registeration5.page';

describe('CarRegisteration5Page', () => {
  let component: CarRegisteration5Page;
  let fixture: ComponentFixture<CarRegisteration5Page>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CarRegisteration5Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
