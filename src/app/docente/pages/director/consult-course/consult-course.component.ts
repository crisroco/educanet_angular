import { Component, OnInit, ViewChild } from '@angular/core';
import { AppSettings } from '../../../../app.settings';
import { ToastrService } from 'ngx-toastr';
import { SessionService } from '../../../../services/session.service';
import { DisponibilityService } from '../../../../services/disponibility.service';

@Component({
  selector: 'app-consult-course',
  templateUrl: './consult-course.component.html',
  styleUrls: ['./consult-course.component.scss']
})
export class ConsultCourseComponent implements OnInit {

  loading: boolean = false;
  public user = this.session.getObject('user');
  public allCoursesReal:Array<any> = [];
  public allCarrers:Array<any> = [];
  public type = '';
  public carrer = '';
	public allCourses:Array<any> = [];
  constructor(private session: SessionService,
  private toastr: ToastrService,
  private dispoS: DisponibilityService) { }

  ngOnInit() {
  	this.loading = true;
  	this.dispoS.getAllCourses()
  		.then((res:any) => {
  			// this.allCourses = this.alphabeticalOrder(res.data);
        this.allCoursesReal = res.data;
  			this.loading = false;
  		});
  }

  loadCarrers(e){
    if (!e) {
      this.allCourses = JSON.parse(JSON.stringify(this.allCoursesReal));
      this.carrer = '';
    } else {
      this.loading = true;
        this.dispoS.getCarrers({emplid: this.user.emplid_moodle, type: e})
          .then((res) => {
            this.allCarrers = res.RES_CARR_DIREC.COM_CARR_DIREC;
            this.loading = false;
          });
    }
  }

  search(){
    this.loading = true;
    let data = JSON.parse(JSON.stringify(this.allCoursesReal));
    if (this.type) {
      // let type = this.type=='PREG'?'PRGS':this.type;
      let type = this.type;
      data = data.filter(el => el.grado == type);
    }
    if (this.carrer) {
      data = data.filter(el => el.codigo_carrera == this.carrer);
    }
    this.allCourses = this.alphabeticalOrder(data);
    this.loading = false;
  }

  alphabeticalOrder(arr){
    return arr.sort(function(a, b){
      if(a.dcurso < b.dcurso) { return -1; }
      if(a.dcurso > b.dcurso) { return 1; }
      return 0;
    })
  }

}