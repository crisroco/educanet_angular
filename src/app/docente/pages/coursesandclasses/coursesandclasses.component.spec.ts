import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursesandclassesComponent } from './coursesandclasses.component';

describe('CoursesandclassesComponent', () => {
  let component: CoursesandclassesComponent;
  let fixture: ComponentFixture<CoursesandclassesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoursesandclassesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoursesandclassesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
