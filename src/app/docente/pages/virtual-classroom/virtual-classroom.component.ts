import { Component, OnInit, ViewChild } from '@angular/core';
import { AppSettings } from '../../../app.settings';
import { Decrypt } from '../../../helpers/general';
import { RealDate } from '../../../helpers/dates';
import { SessionService } from '../../../services/session.service';
import { DocenteService } from '../../../services/docente.service';
import { GeneralService } from '../../../services/general.service';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-virtual-classroom',
  templateUrl: './virtual-classroom.component.html',
  styleUrls: ['./virtual-classroom.component.scss']
})
export class VirtualClassroomComponent implements OnInit {
	cod_company: any;
	config_initial: any;
	user = this.session.getObject('user');
	emplid = Decrypt(this.user['emplid']);
	emplid_real = Decrypt(this.user['emplid_real']);
	oprid = atob(this.user['oprid']);
	realDate: any;
	classrooms: any;

	constructor(private session: SessionService,
		private generalS: GeneralService,
		private docenteS: DocenteService) { 
		this.cod_company = this.session.getItem('cod_company');
		this.config_initial = AppSettings.CONFIG[this.cod_company];
	}

	ngOnInit() {
		this.realDate = RealDate();
		this.docenteS.getVirtualClassroowm({emplid: (this.cod_company == '002'?this.emplid:this.emplid_real), institucion: this.config_initial.institution, unidad: this.cod_company})
		.then(res => {
			console.log(res);
			this.classrooms = res.SISE_CLASE_DOCENTE_RES && res.SISE_CLASE_DOCENTE_RES.UCS_CLASE_DOCENTE_COM?res.SISE_CLASE_DOCENTE_RES.UCS_CLASE_DOCENTE_COM:[];
			for (var i = this.classrooms.length - 1; i >= 0; i--) {
				var CLASS_NBR = this.classrooms[i].CLASS_NBR.split('.');
				this.classrooms[i].CLASS_NBR = CLASS_NBR[0];
				this.classrooms[i].CLASS_NBR2 = CLASS_NBR[1];
			}
		}, error => { });
	}

	goMoodle(course){
		var url = '';
		var rdate = Math.floor(Date.now() / 1000);
		var crypto = encodeURIComponent(CryptoJS.AES.encrypt(JSON.stringify(this.emplid_real + '//' + rdate), 'Educad123', {format: this.generalS.formatJsonCrypto}).toString());
		if(this.cod_company == '002' && (course.INSTITUTION != 'PSTGR' && course.INSTITUTION != 'ESPEC')) {
			url = 'https://dev3-aulavirtualcpe.cientifica.edu.pe/local/wseducad/auth/sso.php?strm=' + course.STRM + '&class=' + (course.CLASS_NBR2?course.CLASS_NBR2:course.CLASS_NBR) + '&course=' + (course.CRES_ID?course.CRES_ID:course.CRSE_ID) + '&emplid=' + crypto + '&token=DOCENTE';
		}
		else if(this.cod_company == '002' && (course.INSTITUTION == 'PSTGR' || course.INSTITUTION == 'ESPEC')){
			url = 'https://dev3-aulavirtualcpe.cientifica.edu.pe/local/wseducad/auth/sso.php?strm=' + course.STRM + '&class=' + (course.CLASS_NBR2?course.CLASS_NBR2:course.CLASS_NBR) + '&course=' + (course.CRES_ID?course.CRES_ID:course.CRSE_ID) + '&emplid=' + this.emplid_real + '&token=DOCENTE';
		}
		else{
			url = 'https://dev3-aulavirtualcpe.cientifica.edu.pe/local/wseducad/auth/sso.php?strm=' + course.STRM + '&class=' + course.CLASS_NBR + '&course=' + (course.CRES_ID?course.CRES_ID:course.CRSE_ID) + '&emplid=' + crypto + '&token=DOCENTE';
		}
		url = url 
		window.open(url, '_blank');
	}

}
