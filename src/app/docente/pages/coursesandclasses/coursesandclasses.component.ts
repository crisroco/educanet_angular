import { Component, OnInit, ViewChild } from '@angular/core';
import { AppSettings } from '../../../app.settings';
import { ToastrService } from 'ngx-toastr';
import { SessionService } from '../../../services/session.service';
import { DocenteService } from '../../../services/docente.service';
import { GeneralService } from '../../../services/general.service';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-coursesandclasses',
  templateUrl: './coursesandclasses.component.html',
  styleUrls: ['./coursesandclasses.component.scss']
})
export class CoursesandclassesComponent implements OnInit {
	cod_company: any;
	config_initial: any;
	user = this.session.getObject('user');
  allCarrers:Array<any> = [];
  alreadyCheck:Array<any> = [];
  loading: boolean = false;
  constructor(private session: SessionService,
		private generalS: GeneralService,
		private toastr: ToastrService,
		private docenteS: DocenteService) { 
		this.cod_company = this.session.getItem('cod_company');
		this.config_initial = AppSettings.CONFIG[this.cod_company];
	}

  ngOnInit() {
  	this.loadCarrers();
  }

  loadCarrers(){
    this.loading = true;
  	this.docenteS.getCarrer(this.user.emplid_moodle)
  		.then((res) => {
        let carrers = res['data'];
        this.docenteS.getCourses(this.user.emplid_moodle)
        .then((res) => {
          for (let i = 0; i < carrers.length; i++) {
            carrers[i].show = false;
            carrers[i].courses = res['data'].filter(crs => crs.grado == carrers[i].grado && crs.carrera == carrers[i].carrera);
          }
        });
        this.allCarrers = carrers;
        setTimeout(() => {
          this.readAlreadyCheck();
          this.loading = false;
        }, 2000);
  		});
  }

  readAlreadyCheck(){
    for (let o = 0; o < this.allCarrers.length; o++) {
      for (let i = 0; i < this.allCarrers[o].courses.length; i++) {
        if (this.allCarrers[o].courses[i].asignado) {
          this.alreadyCheck.push(this.allCarrers[o].courses[i]);
        }
      }
    }
  }

  sendCourses(){
    this.loading = true;
    let send = [];
    for (let i = 0; i < this.allCarrers.length; i++) {
      for (let o = 0; o < this.allCarrers[i].courses.length; o++) {
        if (this.allCarrers[i].courses[o].asignado) {
          this.allCarrers[i].courses[o].campus = 'CAM01';
          this.allCarrers[i].courses[o].accion = 'I';
          send.push(this.allCarrers[i].courses[o]);
        } else {
          if (this.alreadyCheck.filter(finded => finded.carrera == this.allCarrers[i].courses[o].carrera && finded.dcurso == this.allCarrers[i].courses[o].dcurso)[0]) {
            this.allCarrers[i].courses[o].campus = 'CAM01';
            this.allCarrers[i].courses[o].accion = 'E';
            this.allCarrers[i].courses[o].asignado = 0;
            send.push(this.allCarrers[i].courses[o]);
          }
        }
      }
    }
    this.docenteS.saveCourse(send)
      .then((res) => {
        this.loading = false;
        this.loadCarrers();
        this.toastr.success('Cursos guardados correctamente')
      });
  }

  onChange(course){
    for (let i = 0; i < this.allCarrers.length; i++) {
      for (let o = 0; o < this.allCarrers[i].courses.length; o++) {
        if (this.allCarrers[i].courses[o].dcurso == course.dcurso) {
          this.allCarrers[i].courses[o].asignado = course.asignado;
        }
      }
    }
  }

}
