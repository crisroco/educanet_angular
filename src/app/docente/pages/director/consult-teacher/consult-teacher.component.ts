import { Component, OnInit, ViewChild } from '@angular/core';
import { AppSettings } from '../../../../app.settings';
import { ToastrService } from 'ngx-toastr';
import { SessionService } from '../../../../services/session.service';
import { DisponibilityService } from '../../../../services/disponibility.service';

@Component({
  selector: 'app-consult-teacher',
  templateUrl: './consult-teacher.component.html',
  styleUrls: ['./consult-teacher.component.scss']
})
export class ConsultTeacherComponent implements OnInit {
  user = this.session.getObject('user');
  allDocentes:Array<any> = [];
  allCarrers:Array<any> = [];
  loading: boolean = false;
  public carrer:String = '';
  public type:String = '';
  public currentCarrer = {
    ACAD_PROG: '',
    DETALLE_PROGR: ''
  };
  public searchFields = {
    code: '',
    name: '',
    lastname: ''
  }
  constructor(private session: SessionService,
  private toastr: ToastrService,
  private dispoS: DisponibilityService) {}

  ngOnInit() {
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
	}

	search(){
		if (this.validateFields()) {
			this.loading = true;
			this.dispoS.getDocente({ emplid: this.searchFields.code, nombre: this.searchFields.lastname?this.searchFields.name + ' ' + this.searchFields.lastname:this.searchFields.name})
				.then((res) => {
					if (!res.RES_DISP_DOC.COM_DISP_DOC) {
						this.toastr.warning('No se encontro ningún docente');
						this.loading = false;
					}
					this.allDocentes = this.alphabeticalOrder(res.RES_DISP_DOC.COM_DISP_DOC);
					this.loading = false;
				});
		} else {
			this.toastr.error('Tienes que elegir tipo , carrera y al menos un nombre');
		}
	}

	validateFields(){
		if (!this.type || !this.carrer) {
			return false
		}
		return true
	}

	addDocente(doc){
		this.loading = true;
		let data = {
			institucion :'UCS',
      emplid: doc.EMPLID,
      docente: doc.NAME_COMPLETO,
      grado: this.type, //this.type=='PREG'?'PRGS':this.type,
      codigo_carrera: this.currentCarrer.ACAD_PROG,
      carrera: this.currentCarrer.DETALLE_PROGR
		};
		this.dispoS.addDocente(data)
			.then((res) => {
				if (res.status) {
					this.toastr.success(res.msg);
				} else {
					this.toastr.warning(res.msg);
				}
				this.loading = false;
			});
	}

	removeDocente(doc){
		this.loading = true;
		this.dispoS.removeDocente({emplid: doc.EMPLID, grado: this.type, carrera: this.currentCarrer.DETALLE_PROGR})
			.then((res) => {
				if (res.status) {
					this.toastr.success(res.msg);
				} else {
					this.toastr.warning(res.msg);
				}
				this.loading = false;
			});
	}

  alphabeticalOrder(arr){
    return arr.sort(function(a, b){
      if(a.NAME_COMPLETO < b.NAME_COMPLETO) { return -1; }
      if(a.NAME_COMPLETO > b.NAME_COMPLETO) { return 1; }
      return 0;
    });
  }
}