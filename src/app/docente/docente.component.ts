import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppSettings } from '../app.settings';
import { SessionService } from '../services/session.service';
import { DocenteService } from '../services/docente.service';
import { LoginService } from '../services/login.service';
import { Decrypt, Encrypt } from '../helpers/general';
import { ToastrService } from 'ngx-toastr';

import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-docente',
  templateUrl: './docente.component.html',
  styleUrls: ['./docente.component.scss']
})
export class DocenteComponent implements OnInit {
	@ViewChild('ethnicityModal') ethnicityModal: any;
	@ViewChild('surveyModal') surveyModal: any;
	@ViewChild('piezaModal') piezaModal: any;
	config_initial: any;
	menus: any;
	cod_company: any;
	menu_bars = false;
	user = this.session.getObject('user');
	emplid = Decrypt(this.user['emplid']);
	emplid_real = Decrypt(this.user['emplid_real']);
	showwsp: boolean = false;
	ethnicities = AppSettings.ETHNICITIES;
	realEthnicity = '';
	realOther = '';

	constructor(private session: SessionService,
		private loginS: LoginService,
    	private toastr: ToastrService,
		private router: Router,
		private docenteS: DocenteService) { 
		this.cod_company = this.session.getItem('cod_company');
		this.config_initial = AppSettings.CONFIG[this.cod_company];
		this.user = this.session.getObject('user');
	}

	ngOnInit() {
		// if (this.cod_company == '002') {this.piezaModal.open();}
		this.getMenu();
		this.getEthnicity();
		this.showModals();
	}

	showModals(){
		// this.surveyModal.open();
	}

	getEthnicity(){
		if(this.cod_company == '002'){
			this.surveyModal.open();
			this.docenteS.existEthnicity({
				"EMPLID": this.emplid
			})
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
	    // console.log(date);
		// let timestamp = String(date.getTime());
		// console.log(timestamp);
	    // let key = timestamp.slice(0,-3);
		// console.log(key);
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

	goIncorporacion(){
		let data = Encrypt(this.emplid, 'g$@p3Xnh$E');

		if (this.cod_company == '002') {
			var url = "http://incorporacion.educad.pe/login?emplid=" + data.replace('+', '-') + '&email=' + btoa(this.user.email2).replace('+', '-') + '&name=' + btoa(this.user.name+'|'+this.user.surname).replace('+', '-');
			window.open(url, "_blank");
		}
	}
}
