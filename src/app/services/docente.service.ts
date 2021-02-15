import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AppSettings } from '../app.settings';
import { GeneralService } from '../services/general.service';
import { timeout, catchError } from 'rxjs/operators';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root'
})
export class DocenteService {
    cod_company;
	constructor(private http: HttpClient,
        private generalS: GeneralService,
        private session: SessionService) {  }

	public getMenu(cod_empresa: any) {
        return this.http.get(AppSettings.PRODUCTION + '/api/menu_items/' + cod_empresa, { headers: this.generalS.makeHeader() }).pipe(timeout(10000));
    }

    public getBenefits() {
        return this.http.get(AppSettings.BASE_PATH + 'get_beneficios', { headers: this.generalS.makeHeaderNormal() });
    }

    public getClassDocentes(data: any): Promise<any> {
        var uri = '';
        this.cod_company = this.session.getItem('cod_company');
        if(this.cod_company == '002') uri = AppSettings.BASE_UCSUR_LARAVEL + '/clase-cientifica-docentes';
        else uri = AppSettings.BASE_SISE_LARAVEL + '/clase-docentes';
        return this.http.post(uri, data).toPromise();
    }

    public getCourseFormule(data: any): Promise<any>{
        var uri = '';
        this.cod_company = this.session.getItem('cod_company');
        if(this.cod_company == '002') uri = AppSettings.BASE_UCSUR_LARAVEL + '/formula_curso';
        else uri = AppSettings.BASE_SISE_LARAVEL + '/formula_curso';
        return this.http.post(uri, data).toPromise();
    }

    public getGradeRecordClass(data: any): Promise<any>{
        var uri = '';
        this.cod_company = this.session.getItem('cod_company');
        if(this.cod_company == '002') uri = AppSettings.BASE_UCSUR_LARAVEL + '/notas-cientifica-registradas';
        else uri = AppSettings.BASE_SISE_LARAVEL + '/notas_registradas';
        return this.http.post(uri, data).toPromise();
    }

    public getToken(data: any): Promise<any>{
        return this.http.post(AppSettings.BASE_UCSUR_LARAVEL + '/tokens', data).toPromise();
    }

    public putToken(data: any): Promise<any>{
        return this.http.put(AppSettings.BASE_UCSUR_LARAVEL + '/tokens', data).toPromise();
    }

    public updateGrade(data: any): Promise<any>{
        var uri = '';
        this.cod_company = this.session.getItem('cod_company');
        if(this.cod_company == '002') uri = AppSettings.BASE_UCSUR_LARAVEL + '/actulizar-cientifica-notas';
        else uri = AppSettings.BASE_SISE_LARAVEL + '/actulizar_notas_registradas';
        return this.http.post(uri, data).toPromise();
    }

    public getClassAssistance(data: any): Promise<any>{
        var uri = '';
        this.cod_company = this.session.getItem('cod_company');
        if(this.cod_company == '002') uri = AppSettings.BASE_UCSUR_LARAVEL + '/get_asistencia_alumno';
        else uri = AppSettings.BASE_SISE_LARAVEL + '/get_asistencia_alumno_sise';
        return this.http.post(uri, data).toPromise();
    }

    public listStudentClass(data: any): Promise<any>{
        return this.http.post(AppSettings.BASE_UCSUR_LARAVEL + '/lista_alumno_clase', data).toPromise();
    }

    public classroomAverage(data: any): Promise<any>{
        var uri = '';
        this.cod_company = this.session.getItem('cod_company');
        if(this.cod_company == '002') uri = AppSettings.BASE_UCSUR_LARAVEL + '/get_promedio_alumno';
        else uri = AppSettings.BASE_SISE_LARAVEL + '/get_promedio_alumno_sise';
        return this.http.post(uri, data).toPromise();
    }

    public closeRecords(data: any): Promise<any>{
        var uri = '';
        this.cod_company = this.session.getItem('cod_company');
        if(this.cod_company == '002') uri = AppSettings.BASE_UCSUR_LARAVEL + '/cerrar-acta-cientifica';
        else uri = AppSettings.BASE_SISE_LARAVEL + '/cerrar-acta-sise';
        return this.http.post(uri, data).toPromise();
    }

    public getAssistanceDays(data: any): Promise<any>{
        var uri = '';
        this.cod_company = this.session.getItem('cod_company');
        if(this.cod_company == '002') uri = AppSettings.BASE_UCSUR_LARAVEL + '/get_asistencia_alumno_detalle';
        else uri = AppSettings.BASE_SISE_LARAVEL + '/get_lsta_asistencia_alumno_clase';
        return this.http.post(uri, data).toPromise();
    }

    public getAssistanceHistory(data:any): Promise<any>{
        return this.http.post(AppSettings.BASE_UCSUR_LARAVEL + '/lista_x_alumno_clase', data).toPromise();
    }

    public getDetailClassroomStudent(data:any): Promise<any>{
        var uri = '';
        this.cod_company = this.session.getItem('cod_company');
        if(this.cod_company == '002') uri = AppSettings.BASE_UCSUR_LARAVEL + '/lista_alumnos_cientifica';
        else uri = AppSettings.BASE_SISE_LARAVEL + '/lista-alumnos';
        return this.http.post(uri, data).toPromise();
    }

    public updateDelegate(data: any): Promise<any>{
        return this.http.put(AppSettings.BASE_UCSUR_LARAVEL + '/actualizar_delegados', data, {responseType: 'text'}).toPromise();
    }

    public saveAssistance(data: any): Promise<any>{
        var uri = '';
        this.cod_company = this.session.getItem('cod_company');
        if(this.cod_company == '002') uri = AppSettings.BASE_UCSUR_LARAVEL + '/guardar_asistencia_alumnos_cientifica';
        else uri = AppSettings.BASE_SISE_LARAVEL + '/guardar_asistencia';
        return this.http.post(uri, data).toPromise();
    }

    public listClassroom(data: any): Promise<any>{
        var uri = '';
        this.cod_company = this.session.getItem('cod_company');
        if(this.cod_company == '002') uri = AppSettings.BASE_UCSUR_LARAVEL + '/lista_clases_docente';
        else uri = AppSettings.BASE_SISE_LARAVEL + '/marcacion_docente';
        return this.http.post(uri, data).toPromise();
    }

    public registerMarking(data: any): Promise<any>{
        var uri = '';
        this.cod_company = this.session.getItem('cod_company');
        if(this.cod_company == '002') uri = AppSettings.BASE_UCSUR_LARAVEL + '/marcar_asistencia_docente_cientifica';
        else uri = AppSettings.BASE_SISE_LARAVEL + '/actualizar_marcacion_docente';
        return this.http.put(uri, data).toPromise();
    }

    public registerMarking2(data: any): Promise<any>{
        var uri = '';
        this.cod_company = this.session.getItem('cod_company');
        if(this.cod_company == '002') uri = AppSettings.BASE_UCSUR_LARAVEL + '/marcar_asistencia_docente_cientifica2';
        else uri = AppSettings.BASE_SISE_LARAVEL + '/actualizar_marcacion_docente';
        return this.http.put(uri, data).toPromise();
    }

    public registerMarking3(data: any): Promise<any>{
        var uri = '';
        this.cod_company = this.session.getItem('cod_company');
        if(this.cod_company == '002') uri = AppSettings.BASE_UCSUR_LARAVEL + '/marcar_asistencia_docente_cientifica3';
        else uri = AppSettings.BASE_SISE_LARAVEL + '/actualizar_marcacion_docente';
        return this.http.put(uri, data).toPromise();
    }

    public getVirtualClassroowm(data: any): Promise<any>{
        return this.http.post(AppSettings.BASE_UCSUR_LARAVEL + '/clases-virtuales', data).toPromise();
    }

    public getPaymentPeriod(data: any): Promise<any>{
        var uri = '';
        this.cod_company = this.session.getItem('cod_company');
        if(this.cod_company == '002') uri = AppSettings.BASE_UCSUR_LARAVEL + '/get_periodo_pagos';
        else uri = AppSettings.BASE_SISE_LARAVEL + '/get_periodo_pagos_sise';
        return this.http.post(uri, data).toPromise();
    }

    public getHistoricalMarking(data: any): Promise<any>{
        var uri = '';
        this.cod_company = this.session.getItem('cod_company');
        if(this.cod_company == '002') uri = AppSettings.BASE_UCSUR_LARAVEL + '/get_historial_marcacion';
        else uri = AppSettings.BASE_SISE_LARAVEL + '/get_historial_marcacion_sise';
        return this.http.post(uri, data).toPromise();
    }

    public getPayment(data: any): Promise<any>{
        return this.http.get(AppSettings.BASE_PAYMENT_HISTORY, { params: data , responseType: 'blob'/*'arraybuffer'*/ }).toPromise();
    }

    public getTeacherSchedule(data: any): Promise<any>{
        var uri = '';
        this.cod_company = this.session.getItem('cod_company');
        if(this.cod_company == '002') uri = AppSettings.BASE_UCSUR_LARAVEL + '/get_horario_docente';
        else uri = AppSettings.BASE_SISE_LARAVEL + '/get_horario_docente_sise';
        return this.http.post(uri, data).toPromise();
    }

    public saveEthnicity(data: any): Promise<any>{
        var uri = '';
        this.cod_company = this.session.getItem('cod_company');
        if(this.cod_company == '002') uri = AppSettings.BASE_UCSUR_LARAVEL + '/guardar_etnia';
        else uri = AppSettings.BASE_SISE_LARAVEL + '/guardar_etnia';
        return this.http.post(uri, data).toPromise();
    }

    public existEthnicity(data: any): Promise<any>{
        var uri = '';
        this.cod_company = this.session.getItem('cod_company');
        if(this.cod_company == '002') uri = AppSettings.BASE_UCSUR_LARAVEL + '/existe_etnia';
        else uri = AppSettings.BASE_SISE_LARAVEL + '/existe_etnia';
        return this.http.post(uri, data).toPromise();
    }

    public getDataTeacher(data: any): Promise<any>{
        return this.http.get(AppSettings.PRODUCTION + '/docentes/user', {  params: data, headers: this.generalS.makeHeader() }).toPromise();
    }

    public getLinkZoom(cicle, myclass, date, section, teacher): Promise<any> {
        return this.http.get("https://aulavirtualcpe.cientifica.edu.pe/mod/zoom/client/zoom_link_teacher.php?strm=" + cicle + '&nbr=' + myclass + '&date=' + date + '&section=' + section + '&teacher=' + teacher, {responseType: 'text'}).toPromise();
    }

    /* VIRTUAL CLASSES */

    public getVirtualSchedule(emplid){
        return this.http.get(AppSettings.BASE_UCSUR_LARAVEL + '/juanjo/getdisponibilidadByEmplid?description=' + emplid + '&institucion=UCS').toPromise();
    }

    public getVirtualScheduleById(id){
        return this.http.get(AppSettings.BASE_UCSUR_LARAVEL + '/juanjo/getdisponibilidadById?id=' + id + '&institucion=UCS').toPromise();
    }

    public getCampus(){
        return this.http.get(AppSettings.BASE_UCSUR_LARAVEL + '/juanjo/getcampus?institucion=UCS').toPromise();
    }

    public getgrado(){
        return this.http.get(AppSettings.BASE_UCSUR_LARAVEL + '/juanjo/getgrado?institucion=UCS').toPromise();
    }

    public saveDisponibility(data){
        return this.http.post(AppSettings.BASE_UCSUR_LARAVEL + '/juanjo/savedisponibilidad', data).toPromise();
    }

    public updateDisponibility(data){
        return this.http.post(AppSettings.BASE_UCSUR_LARAVEL + '/juanjo/upddisponibilidad', data).toPromise();
    }

    public deleteDisponibility(data){
        return this.http.post(AppSettings.BASE_UCSUR_LARAVEL + '/juanjo/deletedisponibilidad', data).toPromise();
    }

    public getCarrer(emplid){
        return this.http.get(AppSettings.BASE_UCSUR_LARAVEL + '/juanjo/getCarrerabyEmplid?emplid=' + emplid + '&institucion=UCS').toPromise();
    }

    public getCourses(emplid){
        return this.http.get(AppSettings.BASE_UCSUR_LARAVEL + '/juanjo/getCursosCarrerabyEmplid?emplid=' + emplid + '&institucion=UCS').toPromise();
    }

    public saveCourse(data){
        return this.http.post(AppSettings.BASE_UCSUR_LARAVEL + '/juanjo/saveCursoDocente', data).toPromise();
    }

    public savePostulante(data: any): Promise<any>{
        return this.http.post(AppSettings.SERVICES_INCORPORACION + '/api/postulante/savePostulante', data).toPromise();
    } 
    
}
