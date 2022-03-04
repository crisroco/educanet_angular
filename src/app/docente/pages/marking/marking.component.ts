import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { AppSettings } from '../../../app.settings';
import { Decrypt, Encrypt } from '../../../helpers/general';
import { RealDate } from '../../../helpers/dates';
import { SessionService } from '../../../services/session.service';
import { DocenteService } from '../../../services/docente.service';
import { LoginService } from '../../../services/login.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-marking',
  templateUrl: './marking.component.html',
  styleUrls: ['./marking.component.scss']
})
export class MarkingComponent implements OnInit, AfterViewInit {
	cod_company: any;
	config_initial: any;
	user = this.session.getObject('user');
	emplid = this.user?Decrypt(this.user['emplid']):'';
	emplid_real = this.user?Decrypt(this.user['emplid_real']):'';
	// oprid = atob(this.user['oprid']);
	classrooms: any;
	realClassroom: any = {};
	message: string = '';
	typeMessage: string = '';
	today = new Date()
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
	@ViewChild('myClassesModal') myClassesModal;
	nextClassesLink:Array<any> = [];
	heightViewPx: number
	heightWindowPx: number
	slideIndex = 1;

	constructor( private session: SessionService,
		private docenteS: DocenteService,
		private deviceS: DeviceDetectorService,
		private loginS: LoginService,
		private router: Router,
		private elRef: ElementRef,
		private toastr: ToastrService,
		) {
		this.loading = true;
		this.cod_company = this.session.getItem('cod_company')?this.session.getItem('cod_company'):'002';
		this.config_initial = AppSettings.CONFIG[this.cod_company];
	}
	ngAfterViewInit(): void {
		this.showSlides(this.slideIndex);
		setTimeout(() => {
			this.showSlides(this.slideIndex);
		}, 100);
		
		setInterval(() => {
			this.plusSlides(1);
		}, 30000);

	}

	ngOnInit() {

		this.today = new Date()
		var fecha = new Date();
		fecha.toLocaleString('es-PE');
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
		if(this.cod_company == '002'){
			this.docenteS.listClassroom({})
			.then(res => {
				this.classrooms = res.UCS_REST_MARCACION_RES && res.UCS_REST_MARCACION_RES.UCS_REST_MARCACION_COM?res.UCS_REST_MARCACION_RES.UCS_REST_MARCACION_COM:[];
				if(this.realClassroom.EMPLID){
					var tClassroom = this.classrooms.filter(item => item.LVF_NUM_MARC == this.realClassroom.LVF_NUM_MARC);
					this.realClassroom = tClassroom[0]?tClassroom[0]:this.realClassroom;
				}
				this.checkNextClass();
			}, error => { });
		} else {
			this.docenteS.listClassroom({emplid: this.emplid_real, institucion: this.config_initial.institution})
			.then(res => {
				this.classrooms = res.UCS_REST_MARCACION_RES && res.UCS_REST_MARCACION_RES.UCS_REST_MARCACION_COM?res.UCS_REST_MARCACION_RES.UCS_REST_MARCACION_COM:[];
				if(this.realClassroom.EMPLID){
					var tClassroom = this.classrooms.filter(item => item.LVF_NUM_MARC == this.realClassroom.LVF_NUM_MARC);
					this.realClassroom = tClassroom[0]?tClassroom[0]:this.realClassroom;
				}
				this.checkNextClass();
			}, error => { });
		}
	}

	checkNextClass(){
		var dt = new Date();
  		var secs = dt.getSeconds() + (60 * dt.getMinutes()) + (60 * 60 * dt.getHours());
		for (let i = 0; i < this.classrooms.length; i++) {
			let actualC = this.classrooms[i];
			var hour = actualC['MEETING_TIME_START'].split(':')[0]*60*60;
			var minute = actualC['MEETING_TIME_START'].split(':')[1]*60;
			var total = hour + minute;
			var hour_final = actualC['MEETING_TIME_END'].split(':')[0]*60*60;
			var minute_final = actualC['MEETING_TIME_END'].split(':')[1]*60;
			var total_final = hour_final + minute_final;
			if (total-600 < secs && secs < total_final-600) {
				actualC['nextClass'] = true;
			} else {
				actualC['nextClass'] = false;
			}
		}
		this.loading = false;
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
		this.goToZoom();
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
        if(this.cod_company == '002') uri = AppSettings.BASE_UCSUR_LARAVEL_AUTH + '/marcar_asistencia_docente_cientifica';
        else uri = AppSettings.BASE_SISE_LARAVEL + '/actualizar_marcacion_docente';

		this.loading = true;
		var data = {
			action: "marcacion",
			datos: {
				LVF_STATUS_MTG: this.realClassroom.LVF_STATUS_MTG,
				acad_carrer: this.realClassroom.ACAD_CAREER,
				cod_marcacion: this.realClassroom.LVF_NUM_MARC,
				emplid: (this.cod_company == '002'?'':this.emplid_real),
				institucion: this.realClassroom.INSTITUTION,
				ip_privada: this.ip,
			}
		}
		var partTime = this.realClassroom.MEETING_TIME_END.split(':');
		var partMinute = parseInt(partTime[1]) + 10;
		var partHour = parseInt(partTime[0])
		if(partMinute >= 60){
			partHour++;
			partMinute = partMinute%60;
		}
		var secondClass = this.classrooms.find(item => item.CRSE_ID == this.realClassroom.CRSE_ID && item.CLASS_SECTION.indexOf(this.realClassroom.CLASS_SECTION) != -1 && (item.MEETING_TIME_START == this.realClassroom.MEETING_TIME_END || (item.MEETING_TIME_START > this.realClassroom.MEETING_TIME_END && item.MEETING_TIME_START <= partHour + ':' + partMinute )));
		if(secondClass){
			var data2 = {
				action: "marcacion",
				datos: {
					LVF_STATUS_MTG: this.realClassroom.LVF_STATUS_MTG,
					acad_carrer: secondClass.ACAD_CAREER,
					cod_marcacion: secondClass.LVF_NUM_MARC,
					emplid: (this.cod_company == '002'?'':this.emplid_real),
					institucion: secondClass.INSTITUTION,
					ip_privada: this.ip,
				}
			}
		}
		if (this.realClassroom['MARC_TIME_START'] == '') {
			this.docenteS.registerMarking(data)
			.then( res => {
				this.message = res.UCS_REST_MARCA_RES && res.UCS_REST_MARCA_RES.UCS_REST_MARCA_COM && res.UCS_REST_MARCA_RES.UCS_REST_MARCA_COM[0]?res.UCS_REST_MARCA_RES.UCS_REST_MARCA_COM[0].MENSAJE:'';
				this.typeMessage = res.UCS_REST_MARCA_RES && res.UCS_REST_MARCA_RES.UCS_REST_MARCA_COM && res.UCS_REST_MARCA_RES.UCS_REST_MARCA_COM[0]?res.UCS_REST_MARCA_RES.UCS_REST_MARCA_COM[0].RESTRINGE:'';
				this.sendLog(uri, data.datos, res);
				if (this.typeMessage == 'Y') {
					this.goToZoom();
					if(this.cod_company == '002') this.markingExit(data, uri, res.UCS_REST_MARCA_RES.UCS_REST_MARCA_COM[0], secondClass, data2);
					else this.getListClassroom();
				}
				else this.getListClassroom();
				this.loading = false;
			}, error => { this.loading = false;  this.sendLog(uri, data.datos, error); });
		} else {
			var dt = new Date();
  			var secs = dt.getSeconds() + (60 * dt.getMinutes()) + (60 * 60 * dt.getHours());
			var hour = this.realClassroom.MEETING_TIME_END.split(':')[0]*60*60;
			var minute = this.realClassroom.MEETING_TIME_END.split(':')[1]*60;
			var total = hour + minute;
			if (total-1800 < secs  || secs > total) {
				this.docenteS.registerMarking(data)
				.then( res => {
					this.message = res.UCS_REST_MARCA_RES && res.UCS_REST_MARCA_RES.UCS_REST_MARCA_COM && res.UCS_REST_MARCA_RES.UCS_REST_MARCA_COM[0]?res.UCS_REST_MARCA_RES.UCS_REST_MARCA_COM[0].MENSAJE:'';
					this.typeMessage = res.UCS_REST_MARCA_RES && res.UCS_REST_MARCA_RES.UCS_REST_MARCA_COM && res.UCS_REST_MARCA_RES.UCS_REST_MARCA_COM[0]?res.UCS_REST_MARCA_RES.UCS_REST_MARCA_COM[0].RESTRINGE:'';
					this.sendLog(uri, data.datos, res);
					if (this.typeMessage == 'Y') {
						if(this.cod_company == '002') this.markingExit(data, uri, secondClass, data2);
						else this.getListClassroom();
					}
					else this.getListClassroom();
					this.loading = false;
				}, error => { this.loading = false;  this.sendLog(uri, data.datos, error); });
			} else {
				this.typeMessage = 'E';
				this.message = 'Solo se puede registrar la salida 30 minutos antes de la Hora de salida';
				this.loading = false;
			}
		}
	}

	markingExit(data, uri, status, secondClass?, data2?){
		data.datos['LVF_STATUS_MTG'] = status.UCS_STATUS_MTG;
		this.docenteS.registerMarking3(data)
		.then( res => {
			this.sendLog(uri + '3', data.datos, res);
			if(secondClass && !secondClass.MARC_TIME_START){
				this.docenteS.registerMarking2(data2)
				.then( res => {
					this.sendLog(uri + '2', data2.datos, res);
					this.markingExit(data2, uri , res.UCS_REST_MARCA_RES.UCS_REST_MARCA_COM[0]);
				}, error => { this.loading = false;  this.sendLog(uri + '2', data2.datos, error); });
			}
			else { this.loading = false; this.getListClassroom(); }
		}, error => { this.loading = false;  this.sendLog(uri + '3', data.datos, error); });
	}

	goToZoom(){
		let clase = this.realClassroom;
		let d = new Date();
		if (clase.INSTITUTION != 'PSTRG') {
			this.docenteS.getLinkZoom(clase['STRM'], clase['CLASS_NBR2'], Number(clase['UCS_TIMESTAMP']) + 18000, clase['CLASS_SECTION'], clase['DOCENTE'])
			.then((res) => {
				if (this.isJson(res)) {
					if(JSON.parse(res) && JSON.parse(res)[0]['response'].includes('FALSE')){}
					else {
						let links = JSON.parse(res);
						if (links.length > 1) {
							this.nextClassesLink = links;
							this.myClassesModal.open();
						} else {
							window.open(links[0]['url'], '_blank');
						}
					}
				}
			});
		}
	}

	isJson(str){
		try {
			JSON.parse(str);
		} catch (e){
			return false;
		}
		return true;
	}

	openTab(url) {
		const link = document.createElement('a');
		link.href = url;
		link.target = '_blank';
		document.body.appendChild(link);
		link.click();
		link.remove();
	}

	MODALHEAD = {
		CRSE_ID: '',
		CRSE_ID_DESCR: '',
		CLASS_NBR: '',
		CLASS_ATTEND_DT: ''
	}
	disabledMarking:boolean = false;
	studentsDetail: any;
	assistaneDays: any;

	haveChanges: boolean = false;
	objDataAssistance: any = {};

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

	goTakeAssistance(modal, model){
		this.studentsDetail = null;
		if(this.cod_company != '002'){
			let startDate = new Date(model.DATE1+' '+model.MEETING_TIME_START);
			let endDate  = new Date(model.DATE1+' '+model.MEETING_TIME_END);
			startDate.setMinutes(startDate.getMinutes() - 10);
			endDate.setMinutes(endDate.getMinutes() + 10);
			let realDate = (new Date()).getTime();
			if(startDate.getTime() <= realDate && realDate <= endDate.getTime())this.disabledMarking = false;
			else this.disabledMarking = true;
		}

		this.MODALHEAD.CRSE_ID = model.CRSE_ID
		this.MODALHEAD.CRSE_ID_DESCR = model.CRSE_ID_DESCR
		this.MODALHEAD.CLASS_NBR = model.CLASS_NBR
		this.MODALHEAD.CLASS_ATTEND_DT = model.DATE1

		this.data_delegates.INSTITUTION = model.INSTITUTION;
		this.data_delegates.CLASS_NBR = model.CLASS_NBR;
		this.data_delegates.STRM = model.STRM;
		this.data_delegates.CRSE_ID = model.COD_CURSE;
		this.data_delegates.SESSION_CODE = model.SESSION_CODE; // No se tiene el dato
		this.data_delegates.emplid = this.emplid;

		this.docenteS.getAssistanceDays({
			INSTITUTION: model.INSTITUTION,
			STRM: model.STRM,
			CLASS_NBR: model.CLASS_NBR,
			CLASS_MTG_NBR: model.CLASS_MTG_NBR
		})
		.then(res => {
			this.assistaneDays = res.UCS_REST_ASISTALUFEC_RES && res.UCS_REST_ASISTALUFEC_RES.UCS_REST_ASISTALUFEC_COM? res.UCS_REST_ASISTALUFEC_RES.UCS_REST_ASISTALUFEC_COM: [];

			console.log('this.assistaneDays', this.assistaneDays)

			for (let index = 0; index < this.assistaneDays.length; index++) {
				const element = this.assistaneDays[index];
				if( element.CLASS_ATTEND_DT == model.DATE1) {
					
					this.haveChanges = false;
					this.docenteS.getDetailClassroomStudent(
						{
							INSTITUTION: model.INSTITUTION,
							STRM: model.STRM,
							CLASS_NBR: model.CLASS_NBR,
							CLASS_MTG_NBR: model.CLASS_MTG_NBR,
							ATTEND_TMPLT_NBR: element.ATTEND_TMPLT_NBR,
							emplid: this.emplid_real
						}
					)
						.then(res => {
							this.studentsDetail = res.SISE_ASSISTANCE_CLASS_RES && res.SISE_ASSISTANCE_CLASS_RES.SISE_ASSISTANCE_CLASS_COM? res.SISE_ASSISTANCE_CLASS_RES.SISE_ASSISTANCE_CLASS_COM: [];
							console.log(this.studentsDetail)
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
			}
		}, error => { });

		modal.open();
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

	allMarkedStudents(){
		var allMarked = true;
		for (var i = this.studentsDetail.length - 1; i >= 0; i--) {
			if(this.studentsDetail[i].ESTADO != 'D'){
				if(this.studentsDetail[i].ATTEND_PRESENT=='N') allMarked = false;
			}
		}
		return allMarked;
	}

	check_assistance(student){
		this.haveChanges = true;
		student.ATTEND_PRESENT = student.ATTEND_PRESENT == 'N'?'Y':'N';
		this.objDataAssistance[student.EMPLID] = JSON.parse(JSON.stringify(student));
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
		console.log('data', data)	
		this.loading = true;
		this.docenteS.saveAssistance({data: JSON.stringify(data)})
		.then(res => {
			if(this.cod_company == '002'){
				this.docenteS.updateDelegate(this.data_delegates)
				.then(res2 => {
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

	showSlides(n: any) {
		var i;
		var slides: any = document.getElementsByClassName("mySlides");
		var dots: any = document.getElementsByClassName("dot-" + this.config_initial.code);
		if (n > slides.length) {this.slideIndex = 1}    
		if (n < 1) {this.slideIndex = slides.length}
		for (i = 0; i < slides.length; i++) {
				slides[i].style.display = "none";  
		}
		for (i = 0; i < dots.length; i++) {
				dots[i].className = dots[i].className.replace(" active-" + this.config_initial.code, "");
		}
		if(slides.length != 0) {
			slides[this.slideIndex-1].style.display = "block";  
		}
		if(dots.length != 0) {
			dots[this.slideIndex-1].className += " active-" + this.config_initial.code;
		}
	}

	plusSlides(n) {
		this.slideIndex += n;
		this.showSlides(this.slideIndex);
	}

	currentSlide(n) {
		this.slideIndex = n;
		this.showSlides(this.slideIndex);
	}

	goTraining() {
		var data = {
			credencial: Encrypt('QJChPEmBp4d6rZSHf3dA@@' + this.emplid, 'W5Q8f89HmgjhbwGWdy'),
		}
		let form = document.createElement('form');
		document.body.appendChild(form);
		form.method = 'get';
		form.target = '_blank';
		form.action = AppSettings.MOODLE;
		for (var name in data) {
			var input = document.createElement('input');
			input.type = 'hidden';
			input.name = name;
			input.value = data[name];
			form.appendChild(input);
		}
		var input2 = document.createElement('input');
		input2.type = 'hidden';
		input2.name = 'educanet';
		input2.value = 'true';
		form.appendChild(input2);
		form.submit();

	}

}
