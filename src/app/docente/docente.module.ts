import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
import { VirtualScheduleComponent } from './pages/virtual-schedule/virtual-schedule.component';

@NgModule({
  declarations: [DocenteComponent, MarkingComponent, VirtualScheduleComponent, CourseManagementComponent, StudentGradesComponent, StudentAssistanceComponent, VirtualClassroomComponent, HistoricalMarkingComponent, PaymentHistoryComponent, WeeklyScheduleComponent, LibraryComponent],
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
    DocenteRoutingModule
  ],
  providers: [
    DocenteService
  ],
})
export class DocenteModule { }
