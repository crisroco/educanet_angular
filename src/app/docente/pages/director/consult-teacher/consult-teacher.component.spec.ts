import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultTeacherComponent } from './consult-teacher.component';

describe('ConsultTeacherComponent', () => {
  let component: ConsultTeacherComponent;
  let fixture: ComponentFixture<ConsultTeacherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultTeacherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
