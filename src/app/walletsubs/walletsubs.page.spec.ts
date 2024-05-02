import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WalletsubsPage } from './walletsubs.page';

describe('WalletsubsPage', () => {
  let component: WalletsubsPage;
  let fixture: ComponentFixture<WalletsubsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WalletsubsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WalletsubsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
