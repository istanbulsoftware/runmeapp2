import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UserPhotosPage } from './user-photos.page';

describe('UserPhotosPage', () => {
  let component: UserPhotosPage;
  let fixture: ComponentFixture<UserPhotosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserPhotosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UserPhotosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
