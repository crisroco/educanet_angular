import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppSettings } from '../../../app.settings';
import { Decrypt } from '../../../helpers/general';
import { RealDate } from '../../../helpers/dates';
import { SessionService } from '../../../services/session.service';
import { DocenteService } from '../../../services/docente.service';
import { LoginService } from '../../../services/login.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-historical-marking',
  templateUrl: './historical-marking.component.html',
  styleUrls: ['./historical-marking.component.scss']
})
export class HistoricalMarkingComponent implements OnInit {
	cod_company: any;
	config_initial: any;
	user = this.session.getObject('user');
	emplid = Decrypt(this.user['emplid']);
	emplid_real = Decrypt(this.user['emplid_real']);
	oprid = atob(this.user['oprid']);
	paymentPeriods: any = [];
	dates: any;
	realPeriod: string = '';
	totalHours: number = 0;
	loading: boolean = false;

	constructor( private session: SessionService,
		private docenteS: DocenteService,
		private loginS: LoginService,
		private router: Router ) { 
		this.cod_company = this.session.getItem('cod_company');
		this.config_initial = AppSettings.CONFIG[this.cod_company];
	}

	ngOnInit() {
		this.getPaymentPeriod();
	}

	getPaymentPeriod(){
		this.loading = true;
		this.docenteS.getPaymentPeriod({emplid: (this.cod_company == '002'?'':this.emplid_real), emplid_sise: this.emplid_real})
		.then(res => {
			this.paymentPeriods = res.UCS_REST_PERIODOCAL_RES && res.UCS_REST_PERIODOCAL_RES.UCS_REST_PERIODOCAL_COM?res.UCS_REST_PERIODOCAL_RES.UCS_REST_PERIODOCAL_COM:[];
			this.loading = false;
		}, error => { this.loading = false; });
	}

	changePeriod(){
		var dates = this.realPeriod.split('.');
		this.dates = null;
		if(dates.length > 1){
			this.docenteS.getHistoricalMarking({EMPLID: (this.cod_company == '002'?'':this.emplid_real), FECHA_AL: dates[0], FECHA_DEL: dates[1]})
			.then(res => {
				this.dates = res.UCS_REST_MARCAPER_RES && res.UCS_REST_MARCAPER_RES.UCS_REST_MARCAPER_COM?res.UCS_REST_MARCAPER_RES.UCS_REST_MARCAPER_COM:[];
				this.dates.filter(res=>{
                  this.totalHours += parseFloat(res.HORA);
                })
			}, error => { });
		}
	}

	donwloadExcel(){
		const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dates);
		const wb: XLSX.WorkBook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
		XLSX.writeFile(wb, 'asistencia.xlsx');
	}

}
