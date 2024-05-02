import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SetoptPage } from './setopt.page';

describe('SetoptPage', () => {
  let component: SetoptPage;
  let fixture: ComponentFixture<SetoptPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetoptPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SetoptPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
