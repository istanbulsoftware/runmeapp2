import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WatchAdsPage } from './watch-ads.page';

describe('WatchAdsPage', () => {
  let component: WatchAdsPage;
  let fixture: ComponentFixture<WatchAdsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WatchAdsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WatchAdsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
