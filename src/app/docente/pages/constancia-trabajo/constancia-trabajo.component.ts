import { Component, OnInit, ViewChild } from '@angular/core';
import { AppSettings } from '../../../app.settings';
import { Decrypt } from '../../../helpers/general';
import { RealDate } from '../../../helpers/dates';
import { SessionService } from '../../../services/session.service';
import { DocenteService } from '../../../services/docente.service';
import { GeneralService } from '../../../services/general.service';
import { DownloadFileLink  } from '../../../helpers/files';


@Component({
  selector: 'app-constancia-trabajo',
  templateUrl: './constancia-trabajo.component.html',
  styles: []
})
export class ConstanciaTrabajoComponent implements OnInit {
  cod_company: any;
	config_initial: any;
	user = this.session.getObject('user');
	oColaborador = this.session.getObject('oColaborador');
	emplid = Decrypt(this.user['emplid']);
	emplid_real = Decrypt(this.user['emplid_real']);

	loading: boolean = false;
	message: string = '' ;
	typeMessage: number = 0;
	data: any = {};
	courses: any;
	paymentPeriods: any = [];
	response: any = []
	
	
	items: any[] = []
  constructor(private session: SessionService,
		private generalS: GeneralService,
		private docenteS: DocenteService) { 
      this.cod_company = this.session.getItem('cod_company');
		this.config_initial = AppSettings.CONFIG[this.cod_company];
		this.data[AppSettings.STRINGS_COMPANY[this.cod_company].institution] = this.config_initial.institution;
		this.data[AppSettings.STRINGS_COMPANY[this.cod_company].emplid] = this.cod_company == '002'?'':this.emplid_real;
    }

  ngOnInit() {
		this.loading = true;
		let dtFechaRetiro = this.oColaborador.fecha_retiro
		if (!this.oColaborador.fecha_retiro) {
			dtFechaRetiro = this.getDateForservice()
		}
		// this.oColaborador.fecha_retiro = this.getDateForservice()
		// console.log('this.oColaborador.fecha_retiro', this.oColaborador.fecha_retiro)
		this.docenteS.getDataForConstanciaTrabajo({
			emplid: this.oColaborador.cuc,
			fecha_inicio_labores: this.oColaborador.fecha_inicio_labores,
			fecha_retiro: dtFechaRetiro //this.oColaborador.fecha_retiro,
		})
		.then(  res => {
			this.items = res.UCS_REST_CLASSMKD_RES.UCS_REST_CLASSMKD_COM || [];
			console.log('items', this.items)
			this.loading = false;
		}, error => { this.loading = false; });
  }
  downloadConstancy(){
		this.loading = true;
		
		this.oColaborador = this.session.getObject('oColaborador');

		let tipo: number = 0
		console.log('codigo_tipo_planilla', this.oColaborador.codigo_tipo_planilla)
		switch (this.oColaborador.codigo_tipo_planilla) {
			case "50":
			case "60":
				if (this.oColaborador.codigo_puesto !== 'U_JEPR01'){
					tipo = 1
				} else {
					tipo = 3
				}
				break;
			case "B0":
			case "C0": 
				if (this.oColaborador.codigo_puesto !== 'U_JEPR01'){
					tipo = 0
				} else {
					tipo = 2
				}
				break;
			default:
				tipo= 0;
				break;
		}

		//  No mostrar la opcion en el menu para los que no son 50 / 60 / B0 / C0

		// if (!this.oColaborador.fecha_retiro) this.oColaborador.fecha_retiro = this.getDateForservice()
		this.docenteS.constanciaTrabajo(
			{
				nombres: `${this.oColaborador.nombre} ${this.oColaborador.apellido_paterno} ${this.oColaborador.apellido_materno}`,
				dni: this.oColaborador.nro_documento,
				area: this.oColaborador.nombre_area.trim(),
				puesto: this.oColaborador.nombre_puesto.trim(),
				fecha_inicio_labores: this.oColaborador.fecha_inicio_labores,
				fecha_retiro: this.oColaborador.fecha_retiro,
				tipo: tipo,
				cursos: this.items.map( item => `${item.DESCRSHORT}|${item.DESCR}|${item.TERM_BEGIN_DT}|${item.TERM_END_DT}`)
			}
		)
		.then(async res => {
			console.log(res)
			let { filename } = res;
			setTimeout(() => {
				this.DownLoadPDF( `${AppSettings.BASE_CONSTANCIA_TRABAJO}/constancias/` + filename, filename );
				this.loading = false;
			  }, 4000);

		}, error => { this.loading = false; });
		// }, error => { this.typeMessage = 0; this.message = 'No se pudo completar la descarga, vuelva a intentarlo.'; });
	}

	DownLoadPDF(url, filename) {
		var a = document.createElement('a');
		a.setAttribute('style', 'display: none');
		a.setAttribute('target', '_blank');
		a.href = url;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		// window.URL.revokeObjectURL(url);
		// a.remove();
	}

	getDateForservice() {
		var d = new Date(),
			month = '' + (d.getMonth() + 1),
			day = '' + d.getDate(),
			year = d.getFullYear();
	
		if (month.length < 2) 
			month = '0' + month;
		if (day.length < 2) 
			day = '0' + day;
	
		return [year, month, day].join('-');
	}
}
