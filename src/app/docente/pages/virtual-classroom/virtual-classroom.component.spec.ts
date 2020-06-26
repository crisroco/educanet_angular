import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VirtualClassroomComponent } from './virtual-classroom.component';

describe('VirtualClassroomComponent', () => {
  let component: VirtualClassroomComponent;
  let fixture: ComponentFixture<VirtualClassroomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VirtualClassroomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VirtualClassroomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
