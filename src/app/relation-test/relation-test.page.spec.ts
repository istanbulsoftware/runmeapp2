import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RelationTestPage } from './relation-test.page';

describe('RelationTestPage', () => {
  let component: RelationTestPage;
  let fixture: ComponentFixture<RelationTestPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelationTestPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RelationTestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
