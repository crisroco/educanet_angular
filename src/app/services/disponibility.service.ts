import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AppSettings } from '../app.settings';

@Injectable({
  providedIn: 'root'
})
export class DisponibilityService {

  constructor(private http: HttpClient) {}
  public login(data: any): Promise<any> {
    return this.http.post(AppSettings.DISPO + 'login', data).toPromise();
  }

  public checkDirector(oprid:any):Promise<any> {
    return this.http.post(AppSettings.BASE_UCSUR_LARAVEL + '/checkDirector', {oprid}).toPromise();
  }

  public getAllCourses(){
    return this.http.get(AppSettings.DISPO + 'getAllCourses').toPromise();
  }

  public getAllDocentes(){
    return this.http.get(AppSettings.DISPO + 'getAllDocentes').toPromise();
  }

  public getCarrerabyEmplid(data:any): Promise<any> {
  	return this.http.post(AppSettings.DISPO + 'getCarrerabyEmplid', data).toPromise();
  }

  public getCursosCarrerabyEmplid(data:any): Promise<any> {
  	return this.http.post(AppSettings.DISPO + 'getCursosCarrerabyEmplid', data).toPromise();
  }

  public saveCursoDocente(data:any): Promise<any> {
    return this.http.post(AppSettings.DISPO + 'saveCursoDocente', data).toPromise();
  }

  public getdisponibilidadByEmplid(emplid){
    return this.http.get(AppSettings.DISPO + 'getdisponibilidadByEmplid?description=' + emplid).toPromise();
  }

  public getcampus(){
    return this.http.get(AppSettings.DISPO + 'getcampus').toPromise();
  }

  public getgrado(){
    return this.http.get(AppSettings.DISPO + 'getgrado').toPromise();
  }

  public getCourses(data:any): Promise<any> {
    return this.http.post(AppSettings.DISPO + 'getCourses', data).toPromise();
  }

  public getCarrers(data:any): Promise<any> {
    return this.http.post(AppSettings.DISPO + 'getCarrers', data).toPromise();
  }

  public savedisponibilidad(data:any): Promise<any> {
    return this.http.post(AppSettings.DISPO + 'savedisponibilidad', data).toPromise();
  }

  public upddisponibilidad(data:any): Promise<any> {
    return this.http.post(AppSettings.DISPO + 'upddisponibilidad', data).toPromise();
  }

  public deletedisponibilidad(data:any): Promise<any> {
    return this.http.post(AppSettings.DISPO + 'deletedisponibilidad', data).toPromise();
  }

  public addToCourses(data:any): Promise<any> {
    return this.http.post(AppSettings.DISPO + 'addToCourses', data).toPromise();
  }

  public removeFromCourses(data:any): Promise<any> {
    return this.http.post(AppSettings.DISPO + 'removeFromCourses', data).toPromise();
  }

  public getDocente(data:any): Promise<any> {
    return this.http.post(AppSettings.DISPO + 'getDocente', data).toPromise();
  }

  public addDocente(data:any): Promise<any> {
    return this.http.post(AppSettings.DISPO + 'addDocente', data).toPromise();
  }

  public removeDocente(data:any): Promise<any> {
    return this.http.post(AppSettings.DISPO + 'removeDocente', data).toPromise();
  }

  // Formulas 
  public getFormulas(data:any): Promise<any> {
    return this.http.post(AppSettings.DISPO + 'getFormulas', data).toPromise();
  }

  public formulaDetail(data:any): Promise<any> {
    return this.http.post(AppSettings.DISPO + 'formulaDetail', data).toPromise();
  }

  public saveFormula(data:any): Promise<any> {
    return this.http.post(AppSettings.DISPO + 'saveFormula', data).toPromise();
  }

  public getformulasbyemplid(emplid:any): Promise<any> {
    return this.http.get(AppSettings.DISPO + 'getformulasbyemplid/' + emplid).toPromise();
  }

  public deleteformula(data:any): Promise<any> {
    return this.http.post(AppSettings.DISPO + 'deleteformula', data).toPromise();
  }

  public deleteAllFormulas(data:any): Promise<any> {
    return this.http.post(AppSettings.DISPO + 'deleteAllFormulas', data).toPromise();
  }
}