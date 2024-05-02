import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FilterResultPage } from './filter-result.page';

describe('FilterResultPage', () => {
  let component: FilterResultPage;
  let fixture: ComponentFixture<FilterResultPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterResultPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FilterResultPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
