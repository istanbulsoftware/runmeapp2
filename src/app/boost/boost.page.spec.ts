import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BoostPage } from './boost.page';

describe('BoostPage', () => {
  let component: BoostPage;
  let fixture: ComponentFixture<BoostPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoostPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BoostPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
