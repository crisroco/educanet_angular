import { Component, OnInit, ViewChild } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { AppSettings } from '../../../app.settings';
import { Decrypt } from '../../../helpers/general';
import { GetFirstDayWeek, GetLastDayWeek, RealDate } from '../../../helpers/dates';
import { SessionService } from '../../../services/session.service';
import { DocenteService } from '../../../services/docente.service';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss'],
  animations: [
    trigger('openClose', [
      state('open', style({
        height: '*',
        'padding-bottom': '*',
        'padding-top': '*',
        'flex-wrap': 'nowrap',
        opacity: 1,
      })),
      state('closed', style({
        height: '0px',
        'padding-bottom': '0px',
        'padding-top': '0px',
        'flex-wrap': 'wrap',
        opacity: .5,
      })),
      transition('open => closed', [
        animate('.3s')
      ]),
      transition('closed => open', [
        animate('.3s')
      ]),
    ]),
  ]
})
export class LibraryComponent implements OnInit {
	@ViewChild('humanityModal') humanityModal: any;
	cod_company: any;
	config_initial: any;
	user = this.session.getObject('user');
	emplid = Decrypt(this.user['emplid']);
	emplid_real = Decrypt(this.user['emplid_real']);
	oprid = atob(this.user['oprid']);
	isOpen = true;
	dataTeacher: any;
	institutions = {
		'002': [
			{
				name: 'Sistema de Biblioteca',
				libraries: [
					{
						img: 'assets/biblioteca.jpg',
						url: 'https://biblioteca.cientifica.edu.pe/cgi-bin/koha/opac-main.pl?&userid={dni}&password={dni}&tokenucsur=q7v9hj8gp6gazkgyzx6vsm4&koha_login_context=opac',
						width: '100px',
						description: ''
					},
				],
				isOpen: true,
			},
			{
				name: 'Biblioteca Virtual',
				libraries: [],
				isOpen: true,
				subtypes: [
					{
						name: 'Multidisciplinaria',
						libraries: [
							{
								img: 'http://www.e-libro.com/Content/images/logo-dark@2x.png',
								url: 'https://elibro.net/es/lc/ucsur/inicio',
								width: '100px',
								description: 'user: correo institucional \n pass: Código de usuario'
							},
							{
								img: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/56/JSTOR_vector_logo.svg/1200px-JSTOR_vector_logo.svg.png',
								url: 'https://jstor.org',
								width: '80px',
								description: ''
							},
							{
								img: 'assets/biblioteca/ebsco_logo.jpg',
								url: 'https://search.ebscohost.com/login.aspx?authtype=ip,uid&custid=s8884660&groupid=main&user=ucsuredu&password=ucs@2020',
								width: '100px',
								description: ''
							},
							{
								img: 'http://biblioteca.uoc.edu/sites/default/files/styles/public/Wiley%20Online%20Library_2.png',
								url: 'https://aplicaciones2.cientifica.edu.pe/biblioteca/databookw.php',
								width: '100px',
								description: 'user: UCSUR \n pass: UCSUR'
							},
							{
								img: 'https://hullunilibrary.files.wordpress.com/2017/05/sciencedirect1.png?w=630&h=630&crop=1',
								url: 'http://www.sciencedirect.com/',
								width: '90px',
								description: ''
							},
							{
								img: 'https://fahrenhouse.com/blog/wp-content/uploads/2019/03/scopus.jpg',
								url: 'http://www.scopus.com/',
								width: '150px',
								description: ''
							},
							{
								img: 'http://ardi.wipo.int/content/images/ardi_header_es.png',
								url: 'https://login.research4life.org/tacgw/login.cshtml',
								width: '150px',
								description: 'user: PER044 \n pass: NgSHXazQ'
							}
						],
						isOpen: true,
					},
					{
						name: 'Ciencias de la Salud',
						libraries: [
							{
								img: 'assets/2-1.png',
								url: 'http://uptodate.cientifica.edu.pe/',
								width: '103px',
								description: ''
							},
							{
								img: 'assets/2-2.jpg',
								url: 'https://login.research4life.org/tacgw/login.cshtml',
								width: '103px',
								description: 'user: PER044 \n pass: NgSHXazQ'
							},
							{
								img: 'assets/2-4.png',
								url: 'https://www.nejm.org',
								width: '103px',
								description: ''
							}
						],
						isOpen: true,
					},
					{
						name: 'Ciencias Empresariales',
						libraries: [
							{
								img: 'assets/biblioteca/ADEX.jpg',
								url: 'https://aplicaciones2.cientifica.edu.pe/biblioteca/databook.php?XVMSF232343421=23XJX141413414324&bd=adex',
								width: '120px',
								description: ''
							},
						],
						isOpen: true,
					},
					{
						name: 'Ciencias Ambientales',
						libraries: [
							{
								img: 'https://www.architectureopenlibrary.com/img/logo.png',
								url: 'http://www.architectureopenlibrary.com/autologin/?userid=4027&salt=8d697804f7156dc79a512fb0fa80e6ad44b5fafd',
								width: '130px',
								description: ''
							},
							{
								img: 'https://www.cabi.org/gfx/cabidotorg/cabi-logo-narrow.svg',
								url: 'https://www.cabdirect.org/',
								width: '130px',
								description: ''
							},
							{
								img: 'assets/biblioteca/oare_header_es.png',
								url: 'https://login.research4life.org/tacgw/login.cshtml',
								width: '130px',
								description: 'user: PER044 \n pass: NgSHXazQ'
							},
							{
								img: 'assets/biblioteca/agora_header_es.png',
								url: 'https://login.research4life.org/tacgw/login.cshtml',
								width: '130px',
								description: 'user: PER044 \n pass: NgSHXazQ'
							}
						],
						isOpen: true,
					},
					{
						name: 'Ciencias Humanas',
						libraries: [
							{
								img: 'assets/5-1.jpg',
								url: 'http://goali.ilo.org/content/es/journals.php',
								width: '130px',
								description: 'user: PER044 \n pass: NgSHXazQ'
							},
						],
						isOpen: true,
					},
				]
			},
		],
		'003': [
			{
				name: 'Multidisciplinaria',
				libraries: [
					{
						img: 'http://www.e-libro.com/Content/images/logo-dark@2x.png',
						url: 'https://elibro.net/es/lc/bibliotecasise/inicio',
						width: '100px',
						description: ''
					}
				],
				isOpen: true,
			}
		]
	}

	constructor(private session: SessionService,
		private loginS: LoginService,
		private docenteS: DocenteService) {
		this.cod_company = this.session.getItem('cod_company');
		this.config_initial = AppSettings.CONFIG[this.cod_company];
	}

	ngOnInit() {
		if(this.cod_company == '002'){
			this.getDataTeacher();
		}
	}

	getDataTeacher(){
		this.docenteS.getDataTeacher({
			_format: 'json',
			compania: this.cod_company,
			emplid: this.emplid,
			periodoCode: ''
		})
		.then( res => {
			if(res.data && res.data[0]){
				this.dataTeacher = res.data[0];
				for (var i = this.institutions[this.cod_company].length - 1; i >= 0; i--) {
					this.institutions[this.cod_company][i].libraries.forEach((library) => {
						library.url = library.url.replace(/{dni}/gi, this.dataTeacher.dni);
					});
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
					this.getDataTeacher();
				}, error => { });
			}, error => { });
		});
	}

	toggle(obj) {
		obj.isOpen = !obj.isOpen;
	}

	openModal(){
		this.humanityModal.open();
	}

}
