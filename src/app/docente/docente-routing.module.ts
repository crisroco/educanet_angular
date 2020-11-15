import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DocenteComponent } from './docente.component';
import { MarkingComponent } from './pages/marking/marking.component';
import { CourseManagementComponent } from './pages/course-management/course-management.component';
import { StudentGradesComponent } from './pages/student-grades/student-grades.component';
import { StudentAssistanceComponent } from './pages/student-assistance/student-assistance.component';
import { VirtualClassroomComponent } from './pages/virtual-classroom/virtual-classroom.component';
import { HistoricalMarkingComponent } from './pages/historical-marking/historical-marking.component';
import { PaymentHistoryComponent } from './pages/payment-history/payment-history.component';
import { WeeklyScheduleComponent } from './pages/weekly-schedule/weekly-schedule.component';
import { LibraryComponent } from './pages/library/library.component';
import { VirtualScheduleComponent } from './pages/virtual-schedule/virtual-schedule.component';
import { CoursesandclassesComponent } from './pages/coursesandclasses/coursesandclasses.component';

const routes: Routes = [
	{ 
		path: '', 
		component: DocenteComponent,
		children: [
			{
				path: '', 
				redirectTo: '/docente/docentes-marcacion',
				pathMatch: 'full'
			},
			{
				path: 'docentes-marcacion',
				component: MarkingComponent
			},
			{
				path: 'docentes-cientifica',
				component: CourseManagementComponent
			},
			{
				path: 'docentes-cientifica/notas/:idclass',
				component: StudentGradesComponent
			},
			{
				path: 'docentes-cientifica/asistencia/:parts',
				component: StudentAssistanceComponent
			},
			{
				path: 'docentes',
				component: CourseManagementComponent
			},
			{
				path: 'docentes/notas/:idclass',
				component: StudentGradesComponent
			},
			{
				path: 'docentes/asistencia/:parts',
				component: StudentAssistanceComponent
			},
			{
				path: 'clases-virtuales',
				component: VirtualClassroomComponent
			},
			{
				path: 'horario-virtual',
				component: VirtualScheduleComponent
			},
			{
				path: 'cursos-clases',
				component: CoursesandclassesComponent
			},
			{
				path: 'docentes-historico_marcacion',
				component: HistoricalMarkingComponent
			},
			{
				path: 'historial-boletas',
				component: PaymentHistoryComponent
			},
			{
				path: 'docentes-horario',
				component: WeeklyScheduleComponent
			},
			{
				path: 'biblioteca',
				component: LibraryComponent
			},
			{
				path: '**',
				redirectTo: '/docente/docentes-marcacion',
				pathMatch: 'full'
			}
		],
	},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocenteRoutingModule { }
