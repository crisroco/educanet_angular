import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReunionesDocenteComponent } from './reuniones-docente.component';

describe('ReunionesDocenteComponent', () => {
  let component: ReunionesDocenteComponent;
  let fixture: ComponentFixture<ReunionesDocenteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReunionesDocenteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReunionesDocenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
