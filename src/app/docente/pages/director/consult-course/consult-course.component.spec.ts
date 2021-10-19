import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultCourseComponent } from './consult-course.component';

describe('ConsultCourseComponent', () => {
  let component: ConsultCourseComponent;
  let fixture: ComponentFixture<ConsultCourseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultCourseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
