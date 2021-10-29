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
import { DenunciaComponent } from './pages/denuncia/denuncia.component';
import { VacacionesComponent } from './pages/vacaciones/vacaciones.component';
import { ResultadosEvaluacionComponent } from './pages/resultados-evaluacion/resultados-evaluacion.component';
import { VirtualScheduleComponent } from './pages/virtual-schedule/virtual-schedule.component';
import { CoursesandclassesComponent } from './pages/coursesandclasses/coursesandclasses.component';
import { AddCourseComponent } from './pages/director/add-course/add-course.component';
import { AddTeacherComponent } from './pages/director/add-teacher/add-teacher.component';
import { ConsultCourseComponent } from './pages/director/consult-course/consult-course.component';
import { ConsultTeacherComponent } from './pages/director/consult-teacher/consult-teacher.component';
import { ReunionesDocenteComponent } from './pages/reuniones-docente/reuniones-docente.component';


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
				path: 'denuncia',
				component: DenunciaComponent
			},
			{
				path: 'biblioteca',
				component: LibraryComponent
			},
			{
				path: 'vacaciones',
				component: VacacionesComponent
			},
			{
				path: 'resultados-evaluacion',
				component: ResultadosEvaluacionComponent
			},
			{
				path: 'participacion-reuniones',
				component: ReunionesDocenteComponent
			},
			// Director
			{
				path: 'director/anadir_docente',
				component: AddTeacherComponent
			},
			{
				path: 'director/anadir_curso',
				component: AddCourseComponent
			},
			{
				path: 'director/consulta_docente',
				component: ConsultTeacherComponent
			},
			{
				path: 'director/consulta_cursos',
				component: ConsultCourseComponent
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
