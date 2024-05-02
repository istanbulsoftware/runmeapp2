import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchListPage } from './search-list.page';

describe('SearchListPage', () => {
  let component: SearchListPage;
  let fixture: ComponentFixture<SearchListPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(SearchListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
