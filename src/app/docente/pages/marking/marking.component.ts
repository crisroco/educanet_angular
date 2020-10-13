import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
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
	data_browser: any;
	loading: boolean = false;

	constructor( private session: SessionService,
		private docenteS: DocenteService,
		private deviceS: DeviceDetectorService,
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
		this.data_browser = this.deviceS.getDeviceInfo();
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
			}
			this.checkNextClass();
		}, error => { });
	}

	checkNextClass(){
		console.log('test');
		var dt = new Date();
  		var secs = dt.getSeconds() + (60 * dt.getMinutes()) + (60 * 60 * dt.getHours());
		for (let i = 0; i < this.classrooms.length; i++) {
			let actualC = this.classrooms[i];
			var hour = actualC['MEETING_TIME_START'].split(':')[0]*60*60;
			var minute = actualC['MEETING_TIME_START'].split(':')[1]*60;
			var total = hour + minute;
			if (total-600 < secs && secs < total) {
				actualC['nextClass'] = true;
			} else {
				actualC['nextClass'] = false;
			}
		}
		setTimeout(() => {
			this.checkNextClass();
		}, 60000);
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

	sendLog(url, req, res){
		let data_log = {
			INSTITUTION: this.config_initial.institution,
			METHOD: url,
			EMPLID: this.cod_company == '002'?this.emplid:this.emplid_real,
			NAVEGADOR: this.data_browser.browser,
			SISTEMA_OP : this.data_browser.os,
			PARAMETER: JSON.stringify(req),
			IP_SERVIDOR: this.ip,
			RESPT: JSON.stringify(res)
		}
		this.loginS.log_sise(JSON.stringify(data_log)).then(
			result =>{  },
			error => {  }
		);
	}

	registerMarking(){
		var uri = '';
        if(this.cod_company == '002') uri = AppSettings.BASE_UCSUR_LARAVEL + '/marcar_asistencia_docente_cientifica';
        else uri = AppSettings.BASE_SISE_LARAVEL + '/actualizar_marcacion_docente';

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
			if (this.typeMessage == 'Y') {
				this.goToZoom();
			}
			this.getListClassroom();
			this.sendLog(uri, data.datos, res);
			this.loading = false;
		}, error => { this.loading = false;  this.sendLog(uri, data.datos, error); });
	}

	goToZoom(){
		let clase = this.realClassroom;
		let d = new Date();
		var hour = clase.MEETING_TIME_START.split(':')[0];
		var minute = clase.MEETING_TIME_START.split(':')[1];
		d.setHours(hour);
		d.setMinutes(minute);
		d.setSeconds(0);
		let timeStamp = d.getTime().toString().slice(0, -3);
		if (clase.INSTITUTION != 'PSTRG') {
			this.docenteS.getLinkZoom(clase['STRM'], clase['CLASS_NBR2'], Number(timeStamp))
			.then((res) => {
				let link = res.replace(/<\/?[^>]+(>|$)/g, "");
				window.open(link, '_blank');
			});
		}
	}

}
