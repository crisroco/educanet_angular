import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppSettings } from '../../../app.settings';
import { Decrypt } from '../../../helpers/general';
import { DownloadFileLink  } from '../../../helpers/files';
import { SessionService } from '../../../services/session.service';
import { DocenteService } from '../../../services/docente.service';

@Component({
  selector: 'app-payment-history',
  templateUrl: './payment-history.component.html',
  styleUrls: ['./payment-history.component.scss']
})
export class PaymentHistoryComponent implements OnInit {
	cod_company: any;
	config_initial: any;
	years:Array<any> = [];
	user = this.session.getObject('user');
	emplid = this.user?Decrypt(this.user['emplid']):'';
	emplid_real = this.user?Decrypt(this.user['emplid_real']):'';
	data: any = {
		codigoCompania: '',
		codigoEmpleado: '',
		mesPeriodo: '',
		anioPeriodo: '',
		codigoReporte: '',
	}
	loading: boolean = false;
	message: string = '' ;
	typeMessage: number = 0;
	heightViewPx: number
	heightWindowPx: number

	constructor( private session: SessionService,
		private docenteS: DocenteService,
		private router: Router,
		private elRef: ElementRef  ) {
			this.cod_company = this.session.getItem('cod_company')?this.session.getItem('cod_company'):'002';
		this.config_initial = AppSettings.CONFIG[this.cod_company];
		this.data.codigoCompania = this.cod_company;
		this.data.codigoEmpleado = this.emplid;
	}

	ngOnInit() {
		this.positionFooterInitial()
		this.loading = true;
		this.loading = false;
		this.createYears();
		setTimeout(() => { this.positionFooter() }, 100);
	}

	createYears(){
		for(let i = 2017; i <= new Date().getFullYear();i++){
			this.years.push(i);
		}
	}

	downloadPayment(){
		this.loading = true;
		this.message = '';
		this.docenteS.getPayment(this.data)
		.then(res => {
			this.loading = false;
			if(res.type == "application/json"){
				var reader = new FileReader();
				reader.addEventListener("loadend", () => {
					this.typeMessage = 0;
					this.message = JSON.parse(reader.result + '').MensajeRespuesta + '';
				});
				reader.readAsText(res);
			}
			else{
				this.typeMessage = 1;
				this.message = 'Descarga realizada correctamente.';
				DownloadFileLink(res, 'boleta.pdf');
			}
		}, error => { this.typeMessage = 0; this.message = 'No se pudo completar la descarga, vuelva a intentarlo.'; });
	}

	positionFooter() {
		const div2 = this.elRef.nativeElement.parentElement;
		const div = this.elRef.nativeElement;
		this.heightViewPx = div.clientHeight;
		this.heightWindowPx = window.innerHeight;
		if((this.heightViewPx + 254) < this.heightWindowPx) {
			if(div2 != undefined ) div2.style.height = 'calc(100vh - 144px)'
		} else {
			if(div2 != undefined ) div2.style.height = 'unset'
		}
	}
  positionFooterInitial() {
		const div2 = this.elRef.nativeElement.parentElement;
		if(div2 != undefined ) div2.style.height = 'calc(100vh - 144px)'
	}

}
