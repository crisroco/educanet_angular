import { Component, OnInit, ViewChild } from '@angular/core';
import { AppSettings } from '../../../../app.settings';
import { ToastrService } from 'ngx-toastr';
import { SessionService } from '../../../../services/session.service';
import { DisponibilityService } from '../../../../services/disponibility.service';

@Component({
  selector: 'app-add-course',
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.scss']
})
export class AddCourseComponent implements OnInit {
  user = this.session.getObject('user');
  allCourses:Array<any> = [];
  realAllCourses:Array<any> = [];
  allCarrers:Array<any> = [];
  loading: boolean = false;
  public carrer:String = '';
  public type:String = '';
  public currentCarrer = {
    DETALLE_PROGR: ''
  };
  public searchFields = {
    code: '',
    name: ''
  };
  constructor(private session: SessionService,
		private toastr: ToastrService,
		private dispoS: DisponibilityService) { 
	}

  ngOnInit() {
  	// this.loading = true;
  	// this.getCourses();
  }

  loadCarrers(e){
    this.loading = true;
    this.dispoS.getCarrers({emplid: this.user.emplid_moodle, type: e})
      .then((res) => {
        this.allCarrers = res.RES_CARR_DIREC.COM_CARR_DIREC;
        this.loading = false;
    });
  }

  loadCourses(e){
    this.currentCarrer = e;
    this.loading = true;
    this.dispoS.getCourses({emplid: this.user.emplid_moodle, type: this.type, prog: e.ACAD_PROG})
      .then((res) => {
        if (res.RES_CURSO_DIREC.COM_CURSO_DIREC) {
          this.allCourses = this.alphabeticalOrder(res.RES_CURSO_DIREC.COM_CURSO_DIREC);
          this.realAllCourses = res.RES_CURSO_DIREC.COM_CURSO_DIREC;
        } else {
          this.toastr.warning('No se encontraron Cursos')
        }
        this.loading = false;
    });
  }

  add(crse){
    this.loading = true;
    let data = {
      institucion :'UCS',
      grado: this.type, //this.type=='PREG'?'PRGS':this.type,
      ccurso: crse.CRSE_ID,
      dcurso: crse.DETALLE_CURSO,
      codigo_carrera: crse.ACAD_PROG,
      carrera: this.currentCarrer.DETALLE_PROGR
    }
    this.dispoS.addToCourses(data)
      .then((res) => {
        if (res.status) {
          this.toastr.success(res.msg);
        } else {
          this.toastr.warning(res.msg);
        }
        this.loading = false;
    });
  }

  remove(crse){
    this.loading = true;
    let data = {
      grado: this.type,// this.type=='PREG'?'PRGS':this.type,
      ccurso: crse.CRSE_ID,
      codigo_carrera: crse.ACAD_PROG,
    }
    this.dispoS.removeFromCourses(data)
      .then((res) => {
        if (res.status) {
          this.toastr.success(res.msg);
        } else {
          this.toastr.warning(res.msg);
        }
        this.loading = false;
    });
  }

  search(){
    if (this.realAllCourses) {
      let totalData = JSON.parse(JSON.stringify(this.realAllCourses));
      if (this.validateFields()) {
        this.loading = true;
        totalData = totalData.filter(el => el.CRSE_ID.includes(this.searchFields.code));
        totalData = totalData.filter(el => el.DETALLE_CURSO.includes(this.searchFields.name));
        this.loading = false;
      } else {
        this.toastr.warning('Falta añadir un codigo o nombre del curso');
      }
      this.allCourses = this.alphabeticalOrder(totalData);
    }
  }

  validateFields(){
    if (!this.searchFields.code && !this.searchFields.name) {
      return false
    }
    return true
  }

  alphabeticalOrder(arr){
    return arr.sort(function(a, b){
      if(a.DETALLE_CURSO < b.DETALLE_CURSO) { return -1; }
      if(a.DETALLE_CURSO > b.DETALLE_CURSO) { return 1; }
      return 0;
    });
  }
}