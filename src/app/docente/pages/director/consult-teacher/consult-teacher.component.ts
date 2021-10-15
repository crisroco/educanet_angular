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
	loading: boolean = false;
	public user = this.session.getObject('user');
	public allDocentes:Array<any> = [];
	public allDocentesReal:Array<any> = [];
	public allCarrers:Array<any> = [];
	public type = '';
	public carrer = '';

  	constructor(private session: SessionService,
		private toastr: ToastrService,
		private dispoS: DisponibilityService) { }

	ngOnInit() {
		this.loading = true;
	  	this.dispoS.getAllDocentes()
	  		.then((res:any) => {
	  			this.allDocentesReal = res.data;
	  			this.loading = false;
	  		});
	}

	loadCarrers(e){
		if (!e) {
			this.allDocentes = JSON.parse(JSON.stringify(this.allDocentesReal));
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
	    let data = JSON.parse(JSON.stringify(this.allDocentesReal));
	    if (this.type) {
	    	// let type = this.type=='PREG'?'PRGS':this.type;
				let type = this.type; 
	    	data = data.filter(el => el.grado == type);
	    }
	    if (this.carrer) {
	    	data = data.filter(el => el.codigo_carrera == this.carrer);
	    }
    	this.allDocentes = this.alphabeticalOrder(data);
	    this.loading = false;
	}

	removeDuplicates(arr) {
    	return arr.filter((value, index) => arr.indexOf(value) === index);
  	}

  	alphabeticalOrder(arr){
  		return arr.sort(function(a, b){
		    if(a.docente < b.docente) { return -1; }
		    if(a.docente > b.docente) { return 1; }
		    return 0;
		})
  	}
}