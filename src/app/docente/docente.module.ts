import { NgModule } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LOCALE_ID } from '@angular/core';

import { NgxSmartModalModule } from 'ngx-smart-modal';
import { ToastrModule } from 'ngx-toastr';
import { NgxLoadingModule } from 'ngx-loading';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { DocenteRoutingModule } from './docente-routing.module';
import { DocenteComponent } from './docente.component';
import { MarkingComponent } from './pages/marking/marking.component';
import { DocenteService } from '../services/docente.service';
import { CourseManagementComponent } from './pages/course-management/course-management.component';
import { StudentGradesComponent } from './pages/student-grades/student-grades.component';
import { StudentAssistanceComponent } from './pages/student-assistance/student-assistance.component';
import { VirtualClassroomComponent } from './pages/virtual-classroom/virtual-classroom.component';
import { HistoricalMarkingComponent } from './pages/historical-marking/historical-marking.component';
import { PaymentHistoryComponent } from './pages/payment-history/payment-history.component';
import { WeeklyScheduleComponent } from './pages/weekly-schedule/weekly-schedule.component';
import { LibraryComponent } from './pages/library/library.component';

import localePE from '@angular/common/locales/es-PE';
import { DenunciaComponent } from './pages/denuncia/denuncia.component';
import { VacacionesComponent } from './pages/vacaciones/vacaciones.component';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { ResultadosEvaluacionComponent } from './pages/resultados-evaluacion/resultados-evaluacion.component';
import { VirtualScheduleComponent } from './pages/virtual-schedule/virtual-schedule.component';
import { CoursesandclassesComponent } from './pages/coursesandclasses/coursesandclasses.component';
import { AddTeacherComponent } from './pages/director/add-teacher/add-teacher.component';
import { AddCourseComponent } from './pages/director/add-course/add-course.component';
import { ConsultTeacherComponent } from './pages/director/consult-teacher/consult-teacher.component';
import { ConsultCourseComponent } from './pages/director/consult-course/consult-course.component';
import { ReunionesDocenteComponent } from './pages/reuniones-docente/reuniones-docente.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from "@angular/material/icon";
import { MatExpansionModule } from '@angular/material/expansion';
import { MatRippleModule } from '@angular/material/core';

registerLocaleData(localePE, 'es-PE');
@NgModule({
  declarations: [DocenteComponent, MarkingComponent, CourseManagementComponent, StudentGradesComponent, StudentAssistanceComponent, VirtualClassroomComponent, HistoricalMarkingComponent, PaymentHistoryComponent, WeeklyScheduleComponent, LibraryComponent, DenunciaComponent, VacacionesComponent, ResultadosEvaluacionComponent, VirtualScheduleComponent, CoursesandclassesComponent, AddTeacherComponent, AddCourseComponent, ConsultTeacherComponent, ConsultCourseComponent, ReunionesDocenteComponent],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    NgxSmartModalModule.forRoot(),
    ToastrModule.forRoot(),
    NgxLoadingModule.forRoot({}),
    NgxDaterangepickerMd.forRoot(),
    DocenteRoutingModule,
    MatMenuModule,
    MatDividerModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatExpansionModule,
    MatRippleModule
  ],
  providers: [
    DocenteService,
    { provide: LOCALE_ID, useValue: "es-PE" } //replace "en-US" with your locale
  ],
})
export class DocenteModule { }
