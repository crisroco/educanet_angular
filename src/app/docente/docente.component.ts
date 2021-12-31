import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AppSettings } from '../app.settings';
import { SessionService } from '../services/session.service';
import { DocenteService } from '../services/docente.service';
import { LoginService } from '../services/login.service';
import { Decrypt, Encrypt } from '../helpers/general';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as CryptoJS from 'crypto-js';
import { parse } from 'querystring';
import { Observable } from 'rxjs';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-docente',
  templateUrl: './docente.component.html',
  styleUrls: ['./docente.component.scss']
})
export class DocenteComponent implements OnInit {
	@ViewChild('ethnicityModal') ethnicityModal: any;
	@ViewChild('surveyModal') surveyModal: any;
	@ViewChild('piezaModal') piezaModal: any;
	@ViewChild('piezaModalSise') piezaModalSise: any;
	@ViewChild('piezaModalCientifica') piezaModalCientifica: any;
	config_initial: any = {
		code: ''
	};
	director:boolean = false;
	menus: any;
	cod_company: any;
	public loading = false;
	menu_bars = false;
	user = this.session.getObject('user');
	emplid = this.user?Decrypt(this.user['emplid']):'';
	emplid_real = this.user?Decrypt(this.user['emplid_real']):'';
	showwsp: boolean = false;
	ethnicities = AppSettings.ETHNICITIES;
	realEthnicity = '';
	realOther = '';
	flag_vacaciones: boolean = false;
	cod_user: any = this.session.getItem('cod_user');
	remotex: any;
	digital1: any;
	digital2: any;
	digital3: any;
	digital4: any;
	digitalLibraryData: FormGroup;
	DigitalLibraryAttribute1: FormControl;
	DigitalLibraryAttribute2: FormControl;
	DigitalLibraryAttribute3: FormControl;
	DigitalLibraryAttribute4: FormControl;
	DigitalLibraryAttribute5: FormControl;
	DigitalLibraryAttribute6: FormControl;
	DigitalLibraryAttribute7: FormControl;
	DigitalLibraryAttribute8: FormControl;
	DigitalLibraryAttribute9: FormControl;
	@ViewChild('digitalData') digitalData : ElementRef;
	DigitalLibraryAttribute10: FormControl;
	formulario1: FormControl;
	@ViewChild('hello') hello;
	constructor(private session: SessionService,
		private loginS: LoginService,
    	private toastr: ToastrService,
		private formBuilder: FormBuilder,
		private router: Router,
		private docenteS: DocenteService) { 
		this.cod_company = this.session.getItem('cod_company')?this.session.getItem('cod_company'):'002';
		this.config_initial = AppSettings.CONFIG[this.cod_company];
		this.user = this.session.getObject('user');
	}

	ngOnInit() {
		if (this.cod_company == '002') {		
			this.director = this.session.getItem('DI')=='false'?false:true;
			// this.piezaModalSise.open();
			this.piezaModal.open();
			// this.piezaModalCientifica.open();
		} else {
			this.piezaModalSise.open();
		}
		if (!this.user) {
			this.router.navigate(['/login']);
		}
		this.digitalLibraryData = this.formBuilder.group({
			DigitalLibraryAttribute1: ['', Validators.required],
			DigitalLibraryAttribute2: ['', Validators.required],
			DigitalLibraryAttribute3: ['', Validators.required],
			DigitalLibraryAttribute4: ['', Validators.required],
			DigitalLibraryAttribute5: ['', Validators.required],
			DigitalLibraryAttribute6: ['', Validators.required],
			DigitalLibraryAttribute7: ['', Validators.required],
			DigitalLibraryAttribute8: ['', Validators.required],
			DigitalLibraryAttribute9: ['', Validators.required],
			DigitalLibraryAttribute10: ['', Validators.required]
	   	});
		
		this.docenteS.accesoVacaciones((this.cod_company == '002'?this.emplid:this.emplid_real), this.cod_company)
		.then(res => {
		this.flag_vacaciones = res.status;	
		this.getMenu();	
		},(err)=>{
			this.flag_vacaciones = false;
			this.getMenu();
		});
		this.getEthnicity();
		this.showModals();
	}

	showModals(){
		this.surveyModal.open();
		this.piezaModalCientifica.open();
	}

	getEthnicity(){
		if(this.cod_company == '002'){
			this.docenteS.existEthnicity({})
			.then(res => {
				if(res.UCS_CON_ETNICO_RES && res.UCS_CON_ETNICO_RES.RESULTADO == 'Y'){ }
				else{ this.ethnicityModal.open(); }
			})
		}
	}

	getMenu(){
		this.docenteS.getMenu(this.cod_company)
		.subscribe( res => {
			this.menus = res;
			for (var i = this.menus.length - 1; i >= 0; i--) {
				this.menus[i].uri = this.cleanUri(this.menus[i].uri);
				if(this.menus[i].below){
					for (var b = this.menus[i].below.length - 1; b >= 0; b--) {
						this.menus[i].below[b].uri = this.cleanUri(this.menus[i].below[b].uri);
					}
				}
			}
			if (this.cod_company != '004') {
				this.menus[0].below.push({new: false, title: 'Vacaciones', description: 'Vacaciones', uri: '/docente/vacaciones'});
				//this.menus[0].below.push({new: false, title: 'Resultados de Evaluación', description: 'Resultados de Evaluación', uri: '/docente/resultados-evaluacion'});
				this.menus[0].below.push({new: true, title: 'Inducciones GDT', description: 'Inducciones', uri: 'https://vimeo.com/555819732'});
			}
			this.menus[0].below.push({new: true, title: 'Como descargar mi boleta de pago', description: 'Como descargar mi boleta de pago', uri: 'https://vimeo.com/559086745'});
		}, error => {
			this.loginS.get_Token_WS_Vacaciones()
			.then(res => {
		        this.session.setItem('token_vac', res);
				let data = JSON.stringify(AppSettings.ACCESS_VAC);
				this.loginS.login_WS_Vacaciones(data)
				.then(result => {
					let obj_login: any = result;
					this.session.setItem('bearer_vac', obj_login['user']['token']);
					this.getMenu();
				}, error => { });
			}, error => { });
		});
	}

	cleanUri(uri){
		return uri.replace('http://dev.educanet.educad.pe/dashboard/', '').replace('http://dev.educanet.educad.pe/portal/', '')///(?<=(http)).*?(?=(dashboard))/gi
	}

	saveEthnicity(){
		if(!this.realEthnicity){
			this.toastr.error('Debes seleccionar una Etnia');
			return;
		}
		if(this.realEthnicity && this.realEthnicity == '08' && !this.realOther){
			this.toastr.error('Debes llenar el campo otros');
			return;
		}
		var nEthnicity = this.ethnicities.find(item => item.value == this.realEthnicity);
			this.docenteS.saveEthnicity({
			"EMPLID": this.emplid,
			"UCS_ID_ETNICO": this.realEthnicity,
			"DESCR100": this.realEthnicity == '08'?this.realOther.toUpperCase():nEthnicity.name
		})
		.then(res => {
			if(res.UCS_SRV_ETNICO_RES && res.UCS_SRV_ETNICO_RES.RESULTADO){
				if(res.UCS_SRV_ETNICO_RES.RESULTADO == 'G'){
					this.toastr.success('Datos guardados exitósamente');
					this.ethnicityModal.close();
				}
				else if(res.UCS_SRV_ETNICO_RES.RESULTADO == 'E'){
					this.toastr.success('Ya se guardo este dato anteriormente');
					this.ethnicityModal.close();
				}
				else{
					this.toastr.error('Hubo un error al actualizar');
				}
			}
			else{
				this.toastr.error('Hubo un error al actualizar');
			}
		})
	}

	goTraining(){
		// let realDate = new Date();
	    // let date = new Date(realDate.getFullYear() + '-' + (realDate.getMonth()+1) + '-' + '-' + realDate.getDate() + ' 00:00:00');
		// let timestamp = String(date.getTime());
	    // let key = timestamp.slice(0,-3);
		var data = {
			credencial: Encrypt('QJChPEmBp4d6rZSHf3dA@@' + this.emplid, 'W5Q8f89HmgjhbwGWdy'),
		}
		let form = document.createElement('form');
	    document.body.appendChild(form);
	    form.method = 'get';
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

	getBenefits(){
		this.docenteS.getBenefits()
		.subscribe( (res:any) => {
	        var boleta = res.pdf;  
	        window.open(boleta, '_blank');
		}, error => {
			
		});
	}

	logout(){
		this.session.allCLear();
    	this.router.navigate(['/']);
	}

	getDataRemotex(){
		if(this.cod_company == '002'){
			this.docenteS.getDataDocente({email: this.cod_user}).then(res => {
				this.remotex = res['UcsMetodoDatosPersRespuesta'];
				this.session.setObject('remotex', this.remotex);
				const SECRETKEY = "K4GxggYzW6vl0TwxJrBL8RJaZR2eVg60";
				const DIGITAL_LIBRARY_URL = "https://bennett.remotexs.in/alumni/login";
				const DIGITAL_LIBRARY_URL2 = "https://cientifica.remotexs.co/alumni/login";
				this.digital1 = "Docente";
				this.digital2 = this.remotex.codigoAlumno;
				this.digital3 = this.remotex.correo;
				if (CryptoJS) {
					var hash = CryptoJS.HmacSHA256(DIGITAL_LIBRARY_URL2 + this.digital1 + this.digital2 + this.digital3, SECRETKEY);
					this.digital4 = CryptoJS.enc.Base64.stringify(hash);
					//////////////////////////////
					this.digitalLibraryData.setValue({
						DigitalLibraryAttribute1 : this.digital1,
						DigitalLibraryAttribute2 : this.digital2,
						DigitalLibraryAttribute3 : this.digital3,
						DigitalLibraryAttribute4 : this.digital4,
						DigitalLibraryAttribute5 : this.remotex.nombreAlumno + " " + this.remotex.apellidoAlumno,
						DigitalLibraryAttribute6 : this.remotex.programa_actual,
						DigitalLibraryAttribute7 : this.remotex.ind_modalidad,
						DigitalLibraryAttribute8 : this.remotex.campus,
						DigitalLibraryAttribute9 : this.remotex.ciclo_lectivo,
						DigitalLibraryAttribute10 : this.remotex.institucion
					});
					setTimeout(() => {
						this.goRemoteX();
					}, 500);
				} else {
					alert("Error: CryptoJS is undefined");
				}
				this.session.setObject('hash', this.digital4);
			});
		} else {
			this.router.navigate(['/docente/biblioteca']);
		}
	}

	goRemoteX(){
		this.digitalData.nativeElement.submit();
	}

	goEvaluacion(){
		this.router.navigate(['/docente/resultados-evaluacion']);
	}

	goIncorporacion(){
		let data = Encrypt(this.emplid, 'g$@p3Xnh$E');
		//if (this.cod_company == '002') {
			var url = "http://incorporacion.educad.pe/login?emplid=" + data.replace('+', '-') + '&email=' + btoa(this.user.email2).replace('+', '-') + '&name=' + btoa(this.user.name+'|'+this.user.surname).replace('+', '-') + '&company=' + btoa(this.cod_company).replace('+', '-');
			window.open(url, "_blank");
		//}
	}
}
