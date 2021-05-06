import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from '../services/login.service';
import { SessionService } from '../services/session.service';
import { DocenteService } from '../services/docente.service';
import { Encrypt } from '../helpers/general';
import { AppSettings } from '../app.settings';
import { Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
	loginForm: FormGroup;
	ip: any;
	data_browser: any;
	nom_empresa: string = '';
	variable: string = '';
	loading = false;
	showLinks = false;

	@ViewChild('registropostulanteModal') registropostulanteModal: any;
	@ViewChild('siseModalCloseWebsite') siseModalCloseWebsite: any;
	nombre = '';
	apaterno = '';
	amaterno = '';
	fnacimiento = '';
	correo = '';
	dni = '';
	postulanteForm: FormGroup;

	constructor(private formBuilder: FormBuilder,
    	private toastr: ToastrService,
    	private loginS: LoginService,
    	private session: SessionService,
		private router: Router,
		private docenteS: DocenteService,
    	private deviceS: DeviceDetectorService) { }

	ngOnInit() {
		this.loginForm = this.formBuilder.group({
		 	empresa: ['', Validators.required],
			email: ['', Validators.required],
			password: ['', Validators.required],
            // title: ['', Validators.required],
            // email: ['', [Validators.required, Validators.email]],
            // password: ['', [Validators.required, Validators.minLength(6)]],
            // confirmPassword: ['', Validators.required],
            // acceptTerms: [false, Validators.requiredTrue]
        });
		this.loginS.getIPAddress()
		.then(res => {
			this.ip = res.ip;
		}, error => {
			this.ip = '0.0.0.0';
		});
		this.data_browser = this.deviceS.getDeviceInfo();

		this.postulanteForm = this.formBuilder.group({
			nombre: ['', Validators.required],
			apaterno: ['', Validators.required],
			amaterno: ['', Validators.required],
			fnacimiento: ['', Validators.required],
			correo: ['', [Validators.required, Validators.email]],
			dni: ['', [Validators.required, Validators.pattern("[0(9)-9]{8}")]]
		});
	}

	login(){
		if (this.loginForm.invalid) { this.toastr.error('Complete todos los campos.'); return;}

		let data = this.loginForm.value;
		let empresa_url: string = '';
		let cod_empresa: string = '';
		switch (data.empresa) {
			case "002":
				empresa_url = 'ucientifica.edu.pe';
				cod_empresa = '002';
				this.nom_empresa = 'UCSUR';
			break;
			case "003":
				empresa_url = 'sise.edu.pe';
				cod_empresa = '003';
				this.nom_empresa = 'SISE';
			break;
		}
		this.loading = true;
		this.variable = btoa(empresa_url + "&&" + data.email.toUpperCase() + "&&" + data.password);
        this.loginS.getAccess_ps(this.variable)
        .then(res => {
        	if(res.noaccess || res.error){ 
        		this.toastr.error(res.noaccess); 
        		this.session.allCLear();
        		this.sendLog(AppSettings.ACCESS_PS, res);
        		return; 
        	}
			this.session.setItem('token', this.variable);
			res.oprid = btoa(res.oprid);
			res.usuario = btoa(res.usuario);
			this.session.setObject('user', res);
			this.session.setItem('cod_company', cod_empresa);
			this.loginToken();
        }, error => { this.session.allCLear(); this.sendLog(AppSettings.ACCESS_PS, error); });
	}

	loginToken() {
		let params = {
			user: 'test',
			pass: '123456'
		}
		this.loginS.login(params)
		.then(res => {
			let date = new Date();
			let d = new Date(date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate());
			let timestamp = String(d.getTime());
			let key = timestamp.slice(0, -3);
			this.session.setItem('native_token', res);
			let new_key = Encrypt(res, key);
			this.session.setItem('token', new_key);
			this.generandoBearer();
		}, error => {
			this.sendLog(AppSettings.LOGIN_TOKEN, error);
		});
	}

	generandoBearer() {
		this.loginS.get_Token_WS_Vacaciones()
		.then(res => {
			this.session.setItem('token_vac', res);
			let data = JSON.stringify(AppSettings.ACCESS_VAC);
			this.loginS.login_WS_Vacaciones(data)
			.then(result => {
				this.loading = false;
				let obj_login: any = result;
				this.session.setItem('bearer_vac', obj_login['user']['token']);
				this.router.navigate(['docente']);
			},
			error => {
				this.sendLog(AppSettings.WS_DRUPAL_LOGINVACACIONES, error);
			});
		},
		error => {
			this.sendLog(AppSettings.WS_DRUPAL_GENERARTOKEN, error);
		});
	}

	sendLog(url, error){
		let data = this.loginForm.value;
		let data_log = {
			INSTITUTION: this.nom_empresa,
			METHOD: url,
			EMPLID: data.email,
			NAVEGADOR: this.data_browser.browser,
			SISTEMA_OP : this.data_browser.os,
			PARAMETER: JSON.stringify(this.variable),
			IP_SERVIDOR: this.ip,
			RESPT: JSON.stringify(error)
		}
		this.loginS.log_sise(JSON.stringify(data_log)).then(
			result =>{ this.loading = false; },
			error => {
				this.loading = false;
				this.toastr.error('Vuelva a iniciar sesión.');
				localStorage.clear();
				this.router.navigate(['/']);
			}
		);
	}

	showTypes(){
		this.showLinks = !this.showLinks;
	}

	openRegistroPostulante(){
		this.nombre = '';
		this.apaterno = '';
		this.amaterno = '';
		this.fnacimiento = '';
		this.correo = '';
		this.dni = '';
		this.registropostulanteModal.open(); 		
	}

	savePostulante(){	
		if (this.postulanteForm.invalid) { 
			
			if(this.nombre.length == 0){
				this.toastr.error('Nombre requerido');	
				return;	
			}

			if(this.apaterno.length == 0){
				this.toastr.error('Apellido Paterno requerido'); 
				return;	
			}

			if(this.amaterno.length == 0){
				this.toastr.error('Apellido Materno requerido'); return;
			}	

			if(this.fnacimiento.length == 0){
				this.toastr.error('Fecha Nacimiento requerido'); 
				return;		
			}

			if(this.dni.length < 8){
				this.toastr.error('Dni invalido'); 
				return;	
			}	

			if(this.correo.length == 0){
				this.toastr.error('Correo requerido'); 
				return; 
			}	

			this.toastr.error('Formato de correo invalido'); 
			
			return;			
		}

		if(this.correo.trim() != '' && this.correo.indexOf('@') >= 0){
			let dominio = this.correo.substr(this.correo.indexOf('@'), this.correo.length).toLowerCase();
			if(dominio == '@cientifica.edu.pe' || dominio == '@gmail.com' || dominio == '@hotmail.com' || dominio == '@outlook.com' || dominio == '@yahoo.com' || dominio == '@icloud.com'){
				
				this.loading = true;
				this.docenteS.savePostulante({
					'unidad' : '002',
					'apellido_paterno' : this.apaterno,
					'apellido_materno' : this.amaterno,
					'nombre_completo' : this.nombre,
					'tipo_documento' : 'DNI',
					'nro_documento' : this.dni,
					'fecha_nacimiento' : this.fnacimiento,
					'nacionalidad' : null,
					'email' : this.correo,
					'estado_civil' : null,
					'sexo' : null,
					'id_solicitud' : null
				})
				.then(res => {
					this.loading = false;
					if(res.status){			
						this.toastr.success('Datos guardados exitósamente');
						this.registropostulanteModal.close();			
					}
					else{
						this.toastr.error(res.mensaje);
					}
				})

			}else{
				this.toastr.warning('Dominio de correo no permitido');
			}	
		}else{
			this.toastr.error('Correo invalido');
		}
		
	}

	// siseModalCheck(evt){
	// 	if (evt.target.value == '003') {
	// 		this.siseModalCloseWebsite.open();
	// 	}
	// }

}
