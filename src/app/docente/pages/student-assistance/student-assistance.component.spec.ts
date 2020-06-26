import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentAssistanceComponent } from './student-assistance.component';

describe('StudentAssistanceComponent', () => {
  let component: StudentAssistanceComponent;
  let fixture: ComponentFixture<StudentAssistanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentAssistanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentAssistanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
