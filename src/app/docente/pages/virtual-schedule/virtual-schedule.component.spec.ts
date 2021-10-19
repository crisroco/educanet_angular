import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VirtualScheduleComponent } from './virtual-schedule.component';

describe('VirtualScheduleComponent', () => {
  let component: VirtualScheduleComponent;
  let fixture: ComponentFixture<VirtualScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VirtualScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VirtualScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
