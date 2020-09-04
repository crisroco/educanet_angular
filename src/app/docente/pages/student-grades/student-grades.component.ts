import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DeviceDetectorService } from 'ngx-device-detector';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Decrypt } from '../../../helpers/general';
import { OnlyNumbers, MinMaxNumber, MaxLengthString, UpperCase } from '../../../helpers/inputs';
import { DocenteService } from '../../../services/docente.service';
import { SessionService } from '../../../services/session.service';
import { LoginService } from '../../../services/login.service';
import { AppSettings } from '../../../app.settings';
import { UpperFirstLetter } from '../../../helpers/strings';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-student-grades',
  templateUrl: './student-grades.component.html',
  styleUrls: ['./student-grades.component.scss']
})
export class StudentGradesComponent implements OnInit {
	tokenForm: FormGroup;
	class: string;
	career: string;
	strm: string;
	idclass: string;
	course: any = {};
	gradeNames: any;
	gradeName: string = '';
	message: string = '';
	messageError: string = '';
	user = this.session.getObject('user');
	emplid = Decrypt(this.user['emplid']);
	emplid_real = Decrypt(this.user['emplid_real']);
	courseFormule: string;
	cod_company: string;
	config_initial: any;
	allStudents: any;
	students: any = [];
	onlyNumbers = OnlyNumbers;
	minMaxNumber = MinMaxNumber;
	maxLengthString = MaxLengthString;
	upperCase = UpperCase;
	token: string;
	tokenObtained = 0;
	closeRecord: string = '';
	courses: any = [];
	data: any = {};
	loading: boolean = false;
	data_browser: any;
	ip: any;

	constructor(private realRoute: ActivatedRoute, 
		private docenteS: DocenteService,
    	private toastr: ToastrService,
    	private deviceS: DeviceDetectorService,
    	private loginS: LoginService,
		private session: SessionService ) {
		this.cod_company = this.session.getItem('cod_company');
		this.config_initial = AppSettings.CONFIG[this.cod_company];
		this.realRoute.paramMap.subscribe((query: any) => {
			var parts = decodeURIComponent(query.params.idclass).split('|');
			this.class = parts[0];
			this.career = parts[1];
			this.strm = parts[2];
			this.idclass = this.class + '-' + this.career + '-' + this.strm;
			this.closeRecord = parts[3];
		});
		this.loginS.getIPAddress()
		.then(res => {
			this.ip = res.ip;
		}, error => {
			this.ip = '0.0.0.0';
		});
		this.data_browser = this.deviceS.getDeviceInfo();
		this.data[AppSettings.STRINGS_COMPANY[this.cod_company].institution] = this.config_initial.institution;
		this.data[AppSettings.STRINGS_COMPANY[this.cod_company].emplid] = this.cod_company == '002'?this.emplid:this.emplid_real;
	}

	ngOnInit() {
		this.getClassDocentes();
	}

	getClassDocentes() {
		this.loading = true;
		this.docenteS.getClassDocentes(this.data)
		.then(res => {
			this.courses = res.SISE_CLASE_DOCENTE_RES && res.SISE_CLASE_DOCENTE_RES.SISE_CLASE_DOCENTE_COM?res.SISE_CLASE_DOCENTE_RES.SISE_CLASE_DOCENTE_COM:(res.SISE_REST_CLASE_DOCENTE_RES && res.SISE_REST_CLASE_DOCENTE_RES.SISE_REST_CLASE_DOCENTE_COM?res.SISE_REST_CLASE_DOCENTE_RES.SISE_REST_CLASE_DOCENTE_COM:[]);
			for (var i = this.courses.length - 1; i >= 0; i--) {
				this.courses[i].class = this.courses[i].CLASS_NBR.split('.')[0];
				if(this.courses[i].class == this.class && this.courses[i].STRM == this.strm && this.courses[i].ACAD_CAREER == this.career){
					this.course = this.courses[i];
				}
			}
			this.getCourseFormule();
			this.getGradeRecordClass();
		}, error => { });
	}

	getCourseFormule(){
		this.docenteS.getCourseFormule({'CLASS_NBR': this.class, 'STRM': this.strm})
		.then(res => {
			var preFormule = res.UCS_REST_FORMULA_RES &&  res.UCS_REST_FORMULA_RES.UCS_REST_FORMULA_COM && res.UCS_REST_FORMULA_RES.UCS_REST_FORMULA_COM.length? res.UCS_REST_FORMULA_RES.UCS_REST_FORMULA_COM : [{'FORMULA': '-'}];
			this.courseFormule = preFormule[0].FORMULA;
		}, error => { });
	}

	getGradeRecordClass(){
		this.docenteS.getGradeRecordClass({'acad_career': this.career, 'class_nbr': this.class, 'emplid': (this.cod_company == '002'?this.emplid:this.emplid_real), 'institucion': this.course.INSTITUTION, 'strm': this.strm})
		.then(res => {
			this.students = res.SISE_REST_CONSNOTREG_RES && res.SISE_REST_CONSNOTREG_RES.SISE_REST_CONSNOTREG_COM && res.SISE_REST_CONSNOTREG_RES.SISE_REST_CONSNOTREG_COM.length? res.SISE_REST_CONSNOTREG_RES.SISE_REST_CONSNOTREG_COM : [];
			this.allStudents = JSON.parse(JSON.stringify(this.students));
			if(this.students.length){
				this.gradeNames = JSON.parse(JSON.stringify(this.students[0].SISE_REST_CONSNOTREG_NOT));
			}

			// (['dsadas', 'dsadas']).forEach()
			this.students.forEach((student) => {
				// console.log(student);
				if(student.SISE_REST_CONSNOTREG_NOT.length){
					student.SISE_REST_CONSNOTREG_NOT.forEach((grade) => {
						grade.ACTN_TYPE_CD = grade.ACTN_TYPE_CD.replace(/[^0-9]&*\./g, "");
						grade.ACTN_TYPE_CD = Number(grade.ACTN_TYPE_CD);
					});
				}
			})

			if(this.course.CIERRE == 'Y'){
				this.getClassroomAverage();
			}
			this.loading = false;
		}, error => {
			this.loading = false;
		});
	}

	getClassroomAverage(){
		var data = JSON.parse(JSON.stringify(this.course));
		data.emplid = this.emplid;
		data.EMPLID = this.emplid;
		data.CLASS_NBR = data.class;
		delete data.class;
		this.docenteS.classroomAverage(data)
		.then(res => {
			var students = res.SISE_REST_CONSNOTREG_RES && res.SISE_REST_CONSNOTREG_RES.SISE_REST_CONSNOTREG_COM && res.SISE_REST_CONSNOTREG_RES.SISE_REST_CONSNOTREG_COM.length? res.SISE_REST_CONSNOTREG_RES.SISE_REST_CONSNOTREG_COM : [];
			this.gradeNames.push(students[0].SISE_REST_CONSNOTREG_NOT[0]);
			for (var i = students.length - 1; i >= 0; i--) {
				var student = this.students.filter(item => item.EMPLID == students[i].EMPLID);
				if(student){
					student[0].SISE_REST_CONSNOTREG_NOT.push(students[i].SISE_REST_CONSNOTREG_NOT[0]);
				}
			}
		}, error => { });
	}

	cancelRecord(){
		this.students = JSON.parse(JSON.stringify(this.allStudents));
		this.gradeName = '';
	}

	getToken(){
		this.docenteS.getToken({ 'emplid': this.emplid,  'numero': this.course.PHONE})
		.then(res => {
			if(res.data){
				this.message = 'Token enviado al teléfono: *** *** ' + (this.course.PHONE + '').substring(this.course.PHONE.length - 3);
				this.messageError = '',
				this.tokenObtained++;
			}
			else{
				this.message = '';
				this.messageError = 'Vuelva a intentar en unos minutos';
			}
		}, eror => { });
	}

	updateStudentsGrades(){
		for (var i = 0; i < this.students.length; i++) {
			this.students[i].updated = false;
			this.students[i].success = false;
			this.students[i].error = false;
			this.saveGrade(this.students[i]);
		}
	}

	saveGrade(student){
		var grade = student.SISE_REST_CONSNOTREG_NOT.filter(item => item.DESCRSHORT == this.gradeName)[0];
		this.docenteS.updateGrade({
			acad_career: student.ACAD_CAREER,
			class_nbr: student.CLASS_NBR,
			descrshort: grade.DESCRSHORT,
			emplid: student.EMPLID,
			institucion: student.INSTITUTION,
			lam_type: grade.LAM_TYPE,
			strm: student.STRM,
			student_grade: grade.ACTN_TYPE_CD,
			oprid: atob(this.user.oprid),
		})
		.then(res => {
			student.updated = true;
			student.success = true;
			this.endUpdateStudentGrades();
			this.sendLog(AppSettings.BASE_UCSUR_LARAVEL + '/actulizar-cientifica-notas', student, res);
		}, error => {
			student.updated = true;
			student.error = true;
			this.endUpdateStudentGrades();
			this.sendLog(AppSettings.BASE_UCSUR_LARAVEL + '/actulizar-cientifica-notas', student, error);
		});
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

	endUpdateStudentGrades(){
		var errors = 0;
		for (var i = 0; i < this.students.length; i++) {
			if(!this.students[i].updated) return;
			if(this.students[i].error) errors++;
		}
		if(errors > 0) { this.toastr.error('Hubo uno o varios errores al registrar las calificaciones, vuelva a intentarlo.'); this.loading = false; }
		else { this.getGradeRecordClass(); this.toastr.success('Se registraron las calificaciones correctamente.'); this.loading = false; }
	}

	startUpdateStudentGrades(){
		this.loading = true;
		if(this.cod_company == '002'){
			this.docenteS.putToken({ 'emplid': this.emplid,  'numero': this.course.PHONE, 'token': this.token})
			.then(res => {
				if(res.data && res.data.status == 'ok'){
					this.updateStudentsGrades();
					this.token = '';
					this.message = '';
				}
				else{
					this.message = '';
					this.toastr.error('Vuelva a intentar en unos minutos.');
				}
			}, error => {
				this.loading = false;
				console.log(error);
				this.toastr.error(error && error.error && error.error.message?error.error.message:'Vuelva a intentar en unos minutos.');
			});
		}
		else{
			var dataListStudentGrades = [];
			this.students.forEach((student, key) => {
				var grade = student.SISE_REST_CONSNOTREG_NOT.filter(item => item.DESCRSHORT == this.gradeName)[0];
				var realStudent = this.allStudents.filter(item => item.EMPLID == student.EMPLID)[0];
				var realGrade = realStudent.SISE_REST_CONSNOTREG_NOT.filter(item => item.DESCRSHORT == this.gradeName)[0];
				if(grade.ACTN_TYPE_CD != realGrade.ACTN_TYPE_CD){
					let data = {
						acad_career: student.ACAD_CAREER,
						class_nbr: student.CLASS_NBR,
						descrshort: grade.DESCRSHORT,
						emplid: student.EMPLID,
						institucion: student.INSTITUTION,
						lam_type: grade.LAM_TYPE,
						strm: student.STRM,
						student_grade: grade.ACTN_TYPE_CD,
						emplid1: this.emplid_real
					}
					dataListStudentGrades.push(data);
				}
		    });
		    this.allStudents = JSON.parse(JSON.stringify(this.students));
		    this.docenteS.updateGrade({ 'data': JSON.stringify(dataListStudentGrades) })
			.then(res => {
				console.log(res.length);
				this.sendLog(AppSettings.BASE_SISE_LARAVEL + '/actulizar_notas_registradas', JSON.stringify(dataListStudentGrades), res);
				if(res.ok || res.length == 0) { this.getGradeRecordClass(); this.gradeName = ''; this.toastr.success('Se registraron las calificaciones correctamente.'); this.loading = false; }
				else { this.toastr.error('Hubo uno o varios errores al registrar las calificaciones, vuelva a intentarlo.'); this.loading = false; }
			}, error => { this.loading = false;  this.toastr.error('Hubo problemas al momento de grabar las notas, por favor intentar nuevamente');  this.sendLog(AppSettings.BASE_SISE_LARAVEL + '/actulizar_notas_registradas', JSON.stringify(dataListStudentGrades), error); });
		}
	}

	createPDF(){
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
		var courseTitle = this.course.DESCR;
		var gradeClass = this.course.ACAD_CAREER + ' - ' + this.course.CLASS_NBR.split('.')[0] + ' / ' + this.course.SSR_COMPONENT + ' - ' + this.course.CLASS_SECTION;
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
