import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ShowimagePage } from './showimage.page';

describe('ShowimagePage', () => {
  let component: ShowimagePage;
  let fixture: ComponentFixture<ShowimagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowimagePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ShowimagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
