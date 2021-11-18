import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Decrypt } from '../../../helpers/general';
import { AppSettings } from '../../../app.settings';
import { SessionService } from '../../../services/session.service';
import { LoginService } from '../../../services/login.service';
import { DocenteService } from '../../../services/docente.service';

@Component({
  selector: 'app-student-assistance',
  templateUrl: './student-assistance.component.html',
  styleUrls: ['./student-assistance.component.scss']
})
export class StudentAssistanceComponent implements OnInit {
	user = this.session.getObject('user');
	emplid = Decrypt(this.user['emplid']);
	emplid_real = Decrypt(this.user['emplid_real']);
	cod_company: string;
	config_initial: any;
	course:any;
	classrooms:any;
	students:any;
	realStudent:any = {};
	realClassroom: any = {};
	realAssistanceDay: any = {};
	history: any;
	assistaneDays: any;
	studentsDetail: any;
	haveChanges: boolean = false;
	data_delegates: any = {
		"ACAD_CAREER": '',
		"ASSOCIATED_CLASS": "1",
		"CLASS_NBR": '',
		"CRSE_ID": '',
		"EMPLID1": '',
		"EMPLID2": '',
		"INSTITUTION": '',
		"SESSION_CODE": '',
		"STRM": '',
		"emplid": '',
	}
	objDataAssistance: any = {};
	message: string = '';
	disabledMarking:boolean = false;
	loading: boolean = false;
	data_browser: any;
	ip: any;

	constructor( private realRoute: ActivatedRoute, 
		private toastr: ToastrService,
		private docenteS: DocenteService,
    	private deviceS: DeviceDetectorService,
		private loginS: LoginService,
		private session: SessionService ) {
		this.cod_company = this.session.getItem('cod_company');
		this.config_initial = AppSettings.CONFIG[this.cod_company];
		this.realRoute.paramMap.subscribe((query: any) => {
			var parts = decodeURIComponent(query.params.parts).split('|');
			this.course = {
				CICLO: parts[5],
				CLASS_NBR: parts[2],
				COD_CURSE: parts[6],
				CURSE_DESC: parts[7],
				EMPLID: (this.cod_company == '002'?'':this.emplid_real),//parts[3]
				INSTITUTION: parts[0],
				SECTION: parts[4],
				SESSION_CODE: parts[8],
				STRM: parts[1],
				T_CLASS: parts[3],
			}
			this.data_delegates.INSTITUTION = this.course.INSTITUTION;
			this.data_delegates.CLASS_NBR = this.course.CLASS_NBR;
			this.data_delegates.STRM = this.course.STRM;
			this.data_delegates.CRSE_ID = this.course.COD_CURSE;
			this.data_delegates.SESSION_CODE = this.course.SESSION_CODE;
			this.data_delegates.emplid = this.emplid;
			console.log(this.course);
		});
		this.data_browser = this.deviceS.getDeviceInfo();
		this.loginS.getIPAddress()
		.then(res => {
			this.ip = res.ip;
		}, error => {
			this.ip = '0.0.0.0';
		});
	}

	ngOnInit() {
		this.docenteS.getClassAssistance(this.course)
		.then(res => {
			this.classrooms = res.UCS_REST_ASISTALUMOD_RES && res.UCS_REST_ASISTALUMOD_RES.UCS_REST_ASISTALUMOD_COM?res.UCS_REST_ASISTALUMOD_RES.UCS_REST_ASISTALUMOD_COM:[];
			this.listStudentClass();
		}, error => { });
	}

	listStudentClass(){
		this.docenteS.listStudentClass(this.course)
		.then(res => {
			this.students = res.UCS_REST_LSTALU_RES && res.UCS_REST_LSTALU_RES.UCS_REST_LSTALU_COM?res.UCS_REST_LSTALU_RES.UCS_REST_LSTALU_COM:[];
		}, error => { });
	}

	goAssistanceDays(modal, classroom){
		modal.open();
		this.assistaneDays = null;
		this.realClassroom = classroom;
		this.docenteS.getAssistanceDays(this.realClassroom)
		.then(res => {
			this.assistaneDays = res.UCS_REST_ASISTALUFEC_RES && res.UCS_REST_ASISTALUFEC_RES.UCS_REST_ASISTALUFEC_COM? res.UCS_REST_ASISTALUFEC_RES.UCS_REST_ASISTALUFEC_COM: [];
		}, error => { });
	}

	goAssistanceHistory(modal, student){
		modal.open();
		var course = JSON.parse(JSON.stringify(this.course));
		course.EMPLID_ALUMNO = student.EMPLID;
		this.realStudent = student;
		this.history = null;
		this.docenteS.getAssistanceHistory(course)
		.then(res => {
			this.history = res.UCS_REST_LSTALU_ASIS_RES && res.UCS_REST_LSTALU_ASIS_RES.UCS_REST_LSTALU_ASIS_COM? res.UCS_REST_LSTALU_ASIS_RES.UCS_REST_LSTALU_ASIS_COM: [];
		}, error => { });
	}

	goTakeAssistance(modal, assistanceDay){
		modal.open();
		this.realAssistanceDay = JSON.parse(JSON.stringify(assistanceDay));
		if(this.cod_company != '002'){
			let startDate = new Date(this.realAssistanceDay.CLASS_ATTEND_DT+' '+this.realClassroom.MEETING_TIME_START);
			let endDate  = new Date(this.realAssistanceDay.CLASS_ATTEND_DT+' '+this.realClassroom.MEETING_TIME_END);
			startDate.setMinutes(startDate.getMinutes() - 10);
			endDate.setMinutes(endDate.getMinutes() + 10);
			let realDate = (new Date()).getTime();
			if(startDate.getTime() <= realDate && realDate <= endDate.getTime())this.disabledMarking = false;
			else this.disabledMarking = true;
		}
		this.realAssistanceDay.emplid = (this.cod_company == '002'?'':this.emplid_real);
		this.studentsDetail = null;
		this.haveChanges = false;
		this.docenteS.getDetailClassroomStudent(this.realAssistanceDay)
		.then(res => {
			this.studentsDetail = res.SISE_ASSISTANCE_CLASS_RES && res.SISE_ASSISTANCE_CLASS_RES.SISE_ASSISTANCE_CLASS_COM? res.SISE_ASSISTANCE_CLASS_RES.SISE_ASSISTANCE_CLASS_COM: [];
			for (var i = this.studentsDetail.length - 1; i >= 0; i--) {
				if(this.studentsDetail[i].DELEGADO == 'S'){
					this.data_delegates.ACAD_CAREER = this.studentsDetail[i].ACAD_CAREER;
					this.data_delegates.EMPLID2 = this.studentsDetail[i].EMPLID;
				}
				if(this.studentsDetail[i].DELEGADO == 'D'){
					this.data_delegates.ACAD_CAREER = this.studentsDetail[i].ACAD_CAREER;
					this.data_delegates.EMPLID1 = this.studentsDetail[i].EMPLID;
				}
			}
		}, error => { });
	}

	updateDelegate(studentD){
		this.haveChanges = true;
		for (var i = this.studentsDetail.length - 1; i >= 0; i--) {
			this.studentsDetail[i].DELEGADO = this.studentsDetail[i].DELEGADO == 'S'?'S':'';
		}
		studentD.DELEGADO = 'D';
		this.data_delegates.ACAD_CAREER = studentD.ACAD_CAREER;
		this.data_delegates.EMPLID1 = studentD.EMPLID;
	}

	updateSubdelegate(studentD){
		this.haveChanges = true;
		for (var i = this.studentsDetail.length - 1; i >= 0; i--) {
			this.studentsDetail[i].DELEGADO = this.studentsDetail[i].DELEGADO == 'D'?'D':'';
		}
		studentD.DELEGADO = 'S';
		this.data_delegates.ACAD_CAREER = studentD.ACAD_CAREER;
		this.data_delegates.EMPLID2 = studentD.EMPLID;
	}

	markingStudents(t){
		this.haveChanges = true;
		for (var i = this.studentsDetail.length - 1; i >= 0; i--) {
			if(this.studentsDetail[i].ESTADO != 'D'){
				this.studentsDetail[i].ATTEND_PRESENT = t?'Y':'N';
				this.objDataAssistance[this.studentsDetail[i].EMPLID] = JSON.parse(JSON.stringify(this.studentsDetail[i]));
			}
		}
	}

	check_assistance(student){
		this.haveChanges = true;
		student.ATTEND_PRESENT = student.ATTEND_PRESENT == 'N'?'Y':'N';
		this.objDataAssistance[student.EMPLID] = JSON.parse(JSON.stringify(student));
	}

	allMarkedStudents(){
		var allMarked = true;
		for (var i = this.studentsDetail.length - 1; i >= 0; i--) {
			if(this.studentsDetail[i].ESTADO != 'D'){
				if(this.studentsDetail[i].ATTEND_PRESENT=='N') allMarked = false;
			}
		}
		return allMarked;
	}

	saveAssistance(){
		if(this.cod_company == '002' && this.studentsDetail.length > 1 && ((this.data_delegates['EMPLID1'] && !this.data_delegates['EMPLID2']) || (!this.data_delegates['EMPLID1'] && this.data_delegates['EMPLID2'])) ){
			this.toastr.error('Atención! Recuerde que debe seleccionar al delegado y subdelegado.');
			return;
		}
		if (this.studentsDetail.length == 1) {
			this.data_delegates['EMPLID1'] = this.data_delegates['EMPLID2']?this.data_delegates['EMPLID2']:this.data_delegates['EMPLID1'];
			this.data_delegates['EMPLID2'] = '';
		}
		var url = '';
		if(this.cod_company == '002') url = AppSettings.BASE_UCSUR_LARAVEL + '/guardar_asistencia_alumnos_cientifica';
		else url = AppSettings.BASE_SISE_LARAVEL + '/guardar_asistencia';
		var data = [];
		for(var kobj in this.objDataAssistance){
			data.push(this.objDataAssistance[kobj]);
		}
		this.loading = true;
		this.docenteS.saveAssistance({data: JSON.stringify(data)})
		.then(res => {
			if(this.cod_company == '002'){
				this.docenteS.updateDelegate(this.data_delegates)
				.then(res => {
					this.loading = false;
					this.toastr.success('Se registró la asistencia correctamente.');
				}, error => {
					this.loading = false;
					this.toastr.error('Atención! Recuerde que debe seleccionar al delegado y subdelegado.');
				});
			}
			else{
				this.loading = false;
				this.toastr.success('Se registró la asistencia correctamente.');
			}
			this.sendLog(url, data, res);
		}, error => {
			this.loading = false;
			this.toastr.error('Atención! Hubo un problema al registrar la asistencia.');
			this.sendLog(url, data, error);
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

}
