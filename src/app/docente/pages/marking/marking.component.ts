import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppSettings } from '../../../app.settings';
import { Decrypt } from '../../../helpers/general';
import { RealDate } from '../../../helpers/dates';
import { SessionService } from '../../../services/session.service';
import { DocenteService } from '../../../services/docente.service';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-marking',
  templateUrl: './marking.component.html',
  styleUrls: ['./marking.component.scss']
})
export class MarkingComponent implements OnInit {
	cod_company: any;
	config_initial: any;
	user = this.session.getObject('user');
	emplid = Decrypt(this.user['emplid']);
	emplid_real = Decrypt(this.user['emplid_real']);
	oprid = atob(this.user['oprid']);
	classrooms: any;
	realClassroom: any = {};
	message: string = '';
	typeMessage: string = '';
	realDate = {
		year: '',
		month: '',
		day: '',
		hour: '',
		minute: '',
		second: '',
		nmonth: '',
		nday: '',
	};
	changeRealDate = false;
	realModal: any;
	ip: string = '';
	loading: boolean = false;

	constructor( private session: SessionService,
		private docenteS: DocenteService,
		private loginS: LoginService,
		private router: Router ) {
		this.cod_company = this.session.getItem('cod_company');
		this.config_initial = AppSettings.CONFIG[this.cod_company];
	}

	ngOnInit() {
		this.getRealDate();
		this.getListClassroom();
		this.loginS.getIPAddress()
		.then(res => {
			this.ip = res.ip;
		}, error => {
			this.ip = '0.0.0.0';
		});
	}

	getRealDate(){
		this.realDate = RealDate();
	}

	getListClassroom(){
		this.docenteS.listClassroom({emplid: (this.cod_company == '002'?this.emplid:this.emplid_real), institucion: this.config_initial.institution})
		.then(res => {
			this.classrooms = res.UCS_REST_MARCACION_RES && res.UCS_REST_MARCACION_RES.UCS_REST_MARCACION_COM?res.UCS_REST_MARCACION_RES.UCS_REST_MARCACION_COM:[];
			if(this.realClassroom.EMPLID){
				var tClassroom = this.classrooms.Filter(item => item.LVF_NUM_MARC == this.realClassroom.LVF_NUM_MARC);
				this.realClassroom = tClassroom[0]?tClassroom[0]:this.realClassroom;
				console.log(tClassroom);
			}
		}, error => { });
	}

	setRealDate(){
		this.getRealDate();
		setTimeout(() => {
			if(this.realModal && this.realModal.openedClass){
				this.setRealDate();
			}
		}, 500);
	}

	openRegisterMarking(modal, classroom){
		this.message = '';
		this.typeMessage = '';
		this.realModal = modal;
		this.realClassroom = classroom; //JSON.parse(JSON.stringify(classroom));
		modal.open();
		this.setRealDate();
	}

	registerMarking(){
		this.loading = true;
		var data = {
			action: "marcacion",
			datos: {
				LVF_STATUS_MTG: this.realClassroom.LVF_STATUS_MTG,
				acad_carrer: this.realClassroom.ACAD_CAREER,
				cod_marcacion: this.realClassroom.LVF_NUM_MARC,
				emplid: (this.cod_company == '002'?this.emplid:this.emplid_real),
				institucion: this.realClassroom.INSTITUTION,
				ip_privada: this.ip,
			}
		}
		this.docenteS.registerMarking(data)
		.then( res => {
			this.message = res.UCS_REST_MARCA_RES && res.UCS_REST_MARCA_RES.UCS_REST_MARCA_COM && res.UCS_REST_MARCA_RES.UCS_REST_MARCA_COM[0]?res.UCS_REST_MARCA_RES.UCS_REST_MARCA_COM[0].MENSAJE:'';
			this.typeMessage = res.UCS_REST_MARCA_RES && res.UCS_REST_MARCA_RES.UCS_REST_MARCA_COM && res.UCS_REST_MARCA_RES.UCS_REST_MARCA_COM[0]?res.UCS_REST_MARCA_RES.UCS_REST_MARCA_COM[0].RESTRINGE:'';
			this.getListClassroom();
			this.loading = false;
		}, error => { this.loading = false; });
	}

}
