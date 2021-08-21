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
		if(this.cod_company == '002' && (course['STRM'] == '1072' || course['STRM'] == '1073' || course['STRM'] == '1117' || course['STRM'] == '1118' || course['STRM'] == '1156' || course['STRM'] == '1157' || course['STRM'] == '2220' || course['STRM'] == '2222' || course['STRM'] == '2225' || course['STRM'] == '2228' || course['STRM'] == '2235' || course['STRM'] == '2237' || course['STRM'] == '2238')){
			url = 'http://aulavirtualcpe.cientifica.edu.pe/local/wseducad/auth/sso.php?strm=' + course.STRM + '&class=' + (course.CLASS_NBR2?course.CLASS_NBR2:course.CLASS_NBR) + '&course=' + (course.CRES_ID?course.CRES_ID:course.CRSE_ID) + '&emplid=' + crypto + '&token=DOCENTE';
		}
		else if(this.cod_company == '002' && (course.INSTITUTION == 'PSTGR' || course.INSTITUTION == 'ESPEC')){
			url = 'https://aulavirtualposgrado.cientifica.edu.pe/local/wseducad/auth/sso.php?strm=' + course.STRM + '&class=' + (course.CLASS_NBR2?course.CLASS_NBR2:course.CLASS_NBR) + '&course=' + (course.CRES_ID?course.CRES_ID:course.CRSE_ID) + '&emplid=' + this.emplid_real + '&token=DOCENTE';
		}
		else if(this.cod_company == '002'){
			url = 'https://cientificavirtual.cientifica.edu.pe/local/wseducad/auth/sso.php?strm=' + course.STRM + '&class=' + (course.CLASS_NBR2?course.CLASS_NBR2:course.CLASS_NBR) + '&course=' + (course.CRES_ID?course.CRES_ID:course.CRSE_ID) + '&emplid=' + crypto + '&token=DOCENTE';
		}
		else if(this.cod_company != '002' && (course['STRM'] == '0499' || course['STRM'] == '1000' || course['STRM'] == '2010' || course['STRM'] == '2011' || course['STRM'] == '2201' || course['STRM'] == '2211' || course['STRM'] == '2499' || course['STRM'] == '2727' || course['STRM'] == '2802' || course['STRM'] == '2803' || course['STRM'] == '2804' || course['STRM'] == '2812' || course['STRM'] == '2813' || course['STRM'] == '2814' || course['STRM'] == '2901' || course['STRM'] == '2902' || course['STRM'] == '2903' || course['STRM'] == '2904' || course['STRM'] == '2905' || course['STRM'] == '2906' || course['STRM'] == '2907' || course['STRM'] == '2908' || course['STRM'] == '2909' || course['STRM'] == '2910' || course['STRM'] == '2911' || course['STRM'] == '2912' || course['STRM'] == '2913' || course['STRM'] == '2914' || course['STRM'] == '2915' || course['STRM'] == '2916' || course['STRM'] == '2918' || course['STRM'] == '2920' || course['STRM'] == '2921' || course['STRM'] == '2922' || course['STRM'] == '2923' || course['STRM'] == '2924' || course['STRM'] == '2932' || course['STRM'] == '2933' || course['STRM'] == '2934' || course['STRM'] == '2935' || course['STRM'] == '2936' || course['STRM'] == '2937' || course['STRM'] == '2938' || course['STRM'] == '2939' || course['STRM'] == '2940' || course['STRM'] == '2941' || course['STRM'] == '2942' || course['STRM'] == '2943' || course['STRM'] == '2944' || course['STRM'] == '2945' || course['STRM'] == '2987' || course['STRM'] == '2988' || course['STRM'] == '2989' || course['STRM'] == '2990' || course['STRM'] == '2991' || course['STRM'] == '3101' || course['STRM'] == '3102' || course['STRM'] == '3103' || course['STRM'] == '3104' || course['STRM'] == '3105' || course['STRM'] == '9290')){
			url = 'http://aulavirtual.sise.edu.pe/local/wseducad/auth/sso.php?strm=' + course.STRM + '&class=' + (course.CLASS_NBR2?course.CLASS_NBR2:course.CLASS_NBR) + '&course=' + (course.CRES_ID?course.CRES_ID:course.CRSE_ID) + '&emplid=' + crypto + '&token=DOCENTE';
		}
		else{
			url = 'http://new-aulavirtual.sise.edu.pe/local/wseducad/auth/sso.php?strm=' + course.STRM + '&class=' + course.CLASS_NBR + '&course=' + (course.CRES_ID?course.CRES_ID:course.CRSE_ID) + '&emplid=' + crypto + '&token=DOCENTE';
		}
		url = url 
		window.open(url, '_blank');
	}

}
