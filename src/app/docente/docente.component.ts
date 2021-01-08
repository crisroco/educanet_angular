import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppSettings } from '../app.settings';
import { SessionService } from '../services/session.service';
import { DocenteService } from '../services/docente.service';
import { LoginService } from '../services/login.service';
import { Decrypt, Encrypt } from '../helpers/general';
import { ToastrService } from 'ngx-toastr';

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
	}

	getEthnicity(){
		if(this.cod_company == '002'){
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
		let realDate = new Date();
	    let date = new Date(realDate.getFullYear() + '-' + (realDate.getMonth()+1) + '-' + realDate.getDate() + ' 00:00:00');
	    let timestamp = String(date.getTime());
	    let key = timestamp.slice(0,-3);
		var data = {
			credencial: Encrypt('QJChPEmBp4d6rZSHf3dA@@' + this.emplid, key),
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

}
