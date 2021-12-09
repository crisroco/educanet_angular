import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from '../services/login.service';
import { SessionService } from '../services/session.service';
import { DocenteService } from '../services/docente.service';
import { DisponibilityService } from '../services/disponibility.service';
import { Encrypt } from '../helpers/general';
import { AppSettings } from '../app.settings';
import { Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import * as CryptoJS from 'crypto-js';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
	loginForm: FormGroup;
	ip: any;
	remotex: any;
	rmtx_usuario: any;
	rmtx_emplid: any;
	rmtx_telefono: any;
	rmtx_email: any
	data_browser: any;
	nom_empresa: string = '';
	variable: string = '';
	loading = false;
	showLinks = false;
	icon_password = false;

	@ViewChild('registropostulanteModal') registropostulanteModal: any;
	@ViewChild('siseModalCloseWebsite') siseModalCloseWebsite: any;
	// @ViewChild('loginModalImg') loginModalImg:any;
	public allTDI = [
		{ codigo_referencia: 'DNI', descripcion: 'DNI' },
		{ codigo_referencia: 'CE', descripcion: 'CARNET EXTRANJERÍA' },
		{ codigo_referencia: 'PP', descripcion: 'PASAPORTE' },
		{ codigo_referencia: 'PTP', descripcion: 'CARNET PTP' }
	];

	public allCompany = [
		{ codigo_referencia: '002', descripcion: 'UNIVERSIDAD CIENTIFÍCA DEL SUR' },
		{ codigo_referencia: '003', descripcion: 'INSTITUTO SISE' },
	];

	unidad = '';
	nombre = '';
	apaterno = '';
	amaterno = '';
	fnacimiento = '';
	correo = '';
	dni = '';
	tipo_documento = '';
	postulanteForm: FormGroup;
	cod_user: any;
	forgotPasswordUrl = 'https://recuperacontrasena.cientifica.edu.pe/docente';

	constructor(private formBuilder: FormBuilder,
		private toastr: ToastrService,
		private dispoS: DisponibilityService,
		private loginS: LoginService,
		private session: SessionService,
		private router: Router,
		private docenteS: DocenteService,
		private deviceS: DeviceDetectorService) { }

	ngOnInit() {
		this.loginForm = this.formBuilder.group({
			empresa: ['002', Validators.required],
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
			unidad: ['', Validators.required],
			nombre: ['', Validators.required],
			apaterno: ['', Validators.required],
			amaterno: ['', Validators.required],
			fnacimiento: ['', Validators.required],
			tipo_documento: ['', Validators.required],
			correo: ['', [Validators.required, Validators.email]],
			dni: ['', Validators.required]
		});

		this.loginForm.get('empresa').valueChanges.subscribe(
			resp => {
				switch (resp) {
					case "002":
						this.forgotPasswordUrl = 'https://recuperacontrasena.cientifica.edu.pe/docente';
						break;

					case "003":
						this.forgotPasswordUrl = 'https://recuperacontrasena.sise.edu.pe/docente';
						break;
				}
				console.log(resp);

			}
		);
		// this.loginModalImg.open();
	}

	login() {
		if (this.loginForm.invalid) { this.toastr.error('Complete todos los campos.'); return; }
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
		if (cod_empresa == '002') {
			this.docenteS.signUp({ credencial: this.variable, password: data.password, oprid: data.email })
				.then((res) => {
					if (res['err']) {
						this.toastr.error('Credenciales Incorrectas');
						this.loading = false;
						return
					}
					this.rmtx_usuario = res['credentials'].usuario;
					this.rmtx_emplid = res['credentials'].emplid_moodle;
					this.remotex = res['dataPs'];
					this.rmtx_email = this.remotex['correo'];
					this.rmtx_telefono = this.remotex['telefono'];

					this.session.setObject('user', res['credentials']);
					this.session.setItem('token_edu', res['access_token']);
					this.session.setItem('DI', res['dataDI']['UCS_LOGINDIR_RES'].VALOR);
					this.session.setItem('token', this.variable);
					this.session.setItem('cod_company', cod_empresa);
					this.cod_user = data.email;
					this.session.setItem('cod_user', this.cod_user);
					this.loginToken();
				}, (err) => {
					this.loading = false;
				});
		} else {
			this.loginS.getAccess_ps(this.variable)
				.then(res => {
					if (res.noaccess || res.error) {
						this.toastr.error(res.noaccess);
						this.session.allCLear();
						this.sendLog(AppSettings.ACCESS_PS, res);
						return;
					}
					res.oprid = btoa(res.oprid);
					res.usuario = btoa(res.usuario);
					this.session.setObject('user', res);
					this.session.setItem('token', this.variable);
					this.session.setItem('cod_company', cod_empresa);
					this.cod_user = data.email;
					this.session.setItem('cod_user', this.cod_user);
					this.loginToken();
				});
		}
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
				this.loginS.userHolidays(res)
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

	sendLog(url, error) {
		let data = this.loginForm.value;
		let data_log = {
			INSTITUTION: this.nom_empresa,
			METHOD: url,
			EMPLID: data.email,
			NAVEGADOR: this.data_browser.browser,
			SISTEMA_OP: this.data_browser.os,
			PARAMETER: JSON.stringify(this.variable),
			IP_SERVIDOR: this.ip,
			RESPT: JSON.stringify(error)
		}
		this.loginS.log_sise(JSON.stringify(data_log)).then(
			result => { this.loading = false; },
			error => {
				this.loading = false;
				this.toastr.error('Vuelva a iniciar sesión.');
				localStorage.clear();
				this.router.navigate(['/']);
			}
		);
	}

	showTypes() {
		this.showLinks = !this.showLinks;
	}

	openRegistroPostulante() {
		this.nombre = '';
		this.apaterno = '';
		this.amaterno = '';
		this.fnacimiento = '';
		this.correo = '';
		this.tipo_documento = '';
		this.dni = '';
		this.registropostulanteModal.open();
	}

	savePostulante() {
		if (this.postulanteForm.invalid) {
			if (this.unidad.length == 0) {
				this.toastr.error('Seleccione Institución donde realizará su Postulación');
				return;
			}

			if (this.nombre.length == 0) {
				this.toastr.error('Nombre requerido');
				return;
			}

			if (this.apaterno.length == 0) {
				this.toastr.error('Apellido Paterno requerido');
				return;
			}

			if (this.amaterno.length == 0) {
				this.toastr.error('Apellido Materno requerido');
				return;
			}

			if (this.fnacimiento.length == 0) {
				this.toastr.error('Fecha Nacimiento requerido');
				return;
			} else {
				if (this.fnacimiento.length > 10) {
					this.toastr.error('Ingresar Fecha Nacimiento válido');
					return;
				}
			}

			if (this.tipo_documento.length == 0) {
				this.toastr.error('Seleccione tipo documento');
				return;
			}

			if (this.dni.length == 0) {
				this.toastr.error('Campo nro documento requerido');
				return;
			}

			if (this.correo.length == 0) {
				this.toastr.error('Correo requerido');
				return;
			}

			this.toastr.error('Ingresar Formato de correo válido');
			return;
		}

		this.loading = true;
		this.docenteS.savePostulante({
			'unidad': this.unidad,
			'apellido_paterno': this.apaterno,
			'apellido_materno': this.amaterno,
			'nombre_completo': this.nombre,
			'tipo_documento': this.tipo_documento,
			'nro_documento': this.dni,
			'fecha_nacimiento': this.fnacimiento,
			'nacionalidad': null,
			'email': this.correo,
			'estado_civil': null,
			'sexo': null,
			'id_solicitud': null
		})
			.then(res => {
				this.loading = false;
				if (res.status) {
					this.toastr.success('Datos guardados exitósamente');
					this.registropostulanteModal.close();
				}
				else {
					this.toastr.warning(res.mensaje);
				}
			}, (err) => {
				this.toastr.error('Ocurrio un Error, Por favor vuelve a intentarlo');
				this.loading = false;
			});
	}

	goToLinks(param){
		const arr = {
			sise: "https://aulavirtual.sise.edu.pe/login/index.php",
			ucs: "https://cientificavirtual.cientifica.edu.pe/login",
			pos: "https://aulavirtualposgrado.cientifica.edu.pe/"
		}
		
		window.open(arr[param], '_blank');
	}



	// siseModalCheck(evt){
	// 	if (evt.target.value == '003') {
	// 		this.siseModalCloseWebsite.open();
	// 	}
	// }

}