import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppSettings } from '../../../app.settings';
import { Decrypt, Encrypt } from '../../../helpers/general';
import { UpperFirstLetter } from '../../../helpers/strings';
import { Rounded } from '../../../helpers/numbers';
import { SessionService } from '../../../services/session.service';
import { GeneralService } from '../../../services/general.service';
import { DocenteService } from '../../../services/docente.service';
import * as CryptoJS from 'crypto-js';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-course-management',
  templateUrl: './course-management.component.html',
  styleUrls: ['./course-management.component.scss']
})
export class CourseManagementComponent implements OnInit {
	cod_company: any;
	config_initial: any;
	user = this.session.getObject('user');
	emplid = Decrypt(this.user['emplid']);
	emplid_real = Decrypt(this.user['emplid_real']);
	oprid = atob(this.user['oprid']);
	data: any = {};
	courses: any;
	realCourse: any;
	students: any = [];
	message: string = '';
	typeMessage: number = 0;

	constructor( private session: SessionService,
		private docenteS: DocenteService,
		private generalS: GeneralService,
		private router: Router ) { 
		this.cod_company = this.session.getItem('cod_company');
		this.config_initial = AppSettings.CONFIG[this.cod_company];
		this.data[AppSettings.STRINGS_COMPANY[this.cod_company].institution] = this.config_initial.institution;
		this.data[AppSettings.STRINGS_COMPANY[this.cod_company].emplid] = this.cod_company == '002'?this.emplid:this.emplid_real;
	}

	ngOnInit() {
		this.getClassDocentes();
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

	getClassDocentes() {
		this.docenteS.getClassDocentes(this.data)
		.then(res => {
			this.courses = res.SISE_CLASE_DOCENTE_RES && res.SISE_CLASE_DOCENTE_RES.SISE_CLASE_DOCENTE_COM?res.SISE_CLASE_DOCENTE_RES.SISE_CLASE_DOCENTE_COM:(res.SISE_REST_CLASE_DOCENTE_RES && res.SISE_REST_CLASE_DOCENTE_RES.SISE_REST_CLASE_DOCENTE_COM?res.SISE_REST_CLASE_DOCENTE_RES.SISE_REST_CLASE_DOCENTE_COM:[]);
			for (var i = this.courses.length - 1; i >= 0; i--) {
				var class_nbr = this.courses[i].CLASS_NBR.split('.');
				this.courses[i].CLASS_NBR = class_nbr[0];
				this.courses[i].CLASS_NBR2 = class_nbr[1];
			}
		}, error => { });
	}

	closeRecord(modal, course){
		this.message = '';
		this.typeMessage = 0;
		modal.open();
		this.students = [];
		this.realCourse = JSON.parse(JSON.stringify(course));
		this.realCourse.OPRID = this.oprid;
		this.realCourse[AppSettings.STRINGS_COMPANY[this.cod_company].emplid] = this.cod_company == '002'?this.emplid:this.emplid_real;
		this.docenteS.classroomAverage(this.realCourse)
		.then(res => {
			this.students = res.SISE_REST_CONSNOTREG_RES && res.SISE_REST_CONSNOTREG_RES.SISE_REST_CONSNOTREG_COM?res.SISE_REST_CONSNOTREG_RES.SISE_REST_CONSNOTREG_COM:[];
			for (var i = this.students.length - 1; i >= 0; i--) {
				this.students[i].SISE_REST_CONSNOTREG_NOT[0].ACTN_TYPE_CD = Rounded(this.students[i].SISE_REST_CONSNOTREG_NOT[0].ACTN_TYPE_CD, 2);
			}
		}, error => { });
	}

	confirmCloseRecord(){
		this.docenteS.closeRecords(this.realCourse)
		.then(res => {
			if(res.UCS_ACTIV_ACTAS_RES && res.UCS_ACTIV_ACTAS_RES.UCS_ACTIV_ACTAS_COM){
				var response = res.UCS_ACTIV_ACTAS_RES.UCS_ACTIV_ACTAS_COM[0];
				this.getClassDocentes();
				this.typeMessage = parseInt(response.Estado);
				if(this.typeMessage) this.realCourse.CIERRE = 'Y';
				this.message = response.Mensaje;
			}
		}, error => { });
	}

	goStudentGrade(course, cierre){
		this.router.navigate(['/docente/' + (this.cod_company == '002'?'docentes-cientifica':'docentes') + '/notas/' + encodeURIComponent(
		      course.CLASS_NBR + '|' + 
		      course.ACAD_CAREER + '|' + 
		      course.STRM + '|' +
		      cierre
	    )]);
	}

	goStudentAssistance(course: any) {
		this.router.navigate(['/docente/' + (this.cod_company == '002'?'docentes-cientifica':'docentes') + '/asistencia/' + encodeURIComponent(
		      course.INSTITUTION + '|' + 
		      course.STRM + '|' + 
		      course.CLASS_NBR + '|' +
		      // (this.cod_company == '002'?this.emplid:this.emplid_real)+'|'+
		      course.SSR_COMPONENT + '|' + 
		      course.CLASS_SECTION + '|' + 
		      course.STRM + '|' +
		      (course.CRSE_ID?course.CRSE_ID:course.CRES_ID) + '|' +
		      course.DESCR + '|' +
		      course.SESSION_CODE
	    )]);
	}

	createPDF(course){
		var doc = new jsPDF('l', 'pt');
		var currentpage = 0;
		var footer = function (data) {
		  if (currentpage < doc.internal.getNumberOfPages()) {
		      doc.setFontSize(10);
		      doc.setFontStyle('normal');
		      doc.text("Copyright © 2019 Todos los derechos reservados.", 30, doc.internal.pageSize.height - 30);
		      currentpage = doc.internal.getNumberOfPages();
		  }
		};
		var courseTitle = course.DESCR;
		var gradeClass = course.ACAD_CAREER + ' - ' + course.CLASS_NBR + ' / ' + course.SSR_COMPONENT + ' - ' + course.CLASS_SECTION;
		var realDate = new Date();
		var img = new Image()
		img.src = this.config_initial.img_pdf;
		doc.addImage(img, 'png',30, 30, 110, 40)
		doc.setFontSize(10);
		doc.text( 'Docente: '+ UpperFirstLetter(this.user.name + ' ' + this.user.surname), 30, 90);
		doc.setFontSize(10);
		doc.text( 'Fecha: ' + realDate.toLocaleString().split(' ')[0], doc.internal.pageSize.width - 120, 105);
		doc.setFontSize(10);
		doc.text( 'Hora: ' + realDate.toLocaleString().split(' ')[1], doc.internal.pageSize.width - 120, 120);
		doc.setFontSize(10);
		doc.text( 'Emplid: ' + this.emplid, doc.internal.pageSize.width - 120, 90);
		doc.setFontSize(10);
		doc.text('Curso: ' + UpperFirstLetter(courseTitle), 30, 105);
		doc.setFontSize(10);
		doc.text('Grado: '+ gradeClass, 30, 120);
		var res = doc.autoTableHtmlToJson(document.getElementById("table-students"));
		doc.autoTable(res.columns, res.data, {
			startY: 135,
			afterPageContent: footer,
			margin: { horizontal: 30 },
			bodyStyles: { 
			  valign: 'middle',
			  fontSize: 8,
			  halign: 'center'
			},
			styles: { overflow: 'linebreak' },
			headerStyles: {
			    fillColor: [0, 0, 0],
			    textColor: [255],
			    halign: 'center'
			},
			theme: 'striped'
		});
		doc.save(courseTitle + " / " + gradeClass + ".pdf");
	}

}
