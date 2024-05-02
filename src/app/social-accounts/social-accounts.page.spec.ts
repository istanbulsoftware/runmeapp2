import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SocialAccountsPage } from './social-accounts.page';

describe('SocialAccountsPage', () => {
  let component: SocialAccountsPage;
  let fixture: ComponentFixture<SocialAccountsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SocialAccountsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SocialAccountsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
