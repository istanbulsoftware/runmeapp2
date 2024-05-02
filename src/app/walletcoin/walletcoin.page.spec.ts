import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WalletcoinPage } from './walletcoin.page';

describe('WalletcoinPage', () => {
  let component: WalletcoinPage;
  let fixture: ComponentFixture<WalletcoinPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WalletcoinPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WalletcoinPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
