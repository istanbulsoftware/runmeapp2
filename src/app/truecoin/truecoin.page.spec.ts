import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TruecoinPage } from './truecoin.page';

describe('TruecoinPage', () => {
  let component: TruecoinPage;
  let fixture: ComponentFixture<TruecoinPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TruecoinPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TruecoinPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
