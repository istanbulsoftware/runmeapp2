import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BestListPage } from './best-list.page';

describe('BestListPage', () => {
  let component: BestListPage;
  let fixture: ComponentFixture<BestListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BestListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BestListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
