import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricalMarkingComponent } from './historical-marking.component';

describe('HistoricalMarkingComponent', () => {
  let component: HistoricalMarkingComponent;
  let fixture: ComponentFixture<HistoricalMarkingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoricalMarkingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoricalMarkingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
