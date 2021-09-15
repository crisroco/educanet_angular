import { Component, OnInit, ViewChild } from '@angular/core';
import { AppSettings } from '../../../app.settings';
import { Decrypt } from '../../../helpers/general';
import { SessionService } from '../../../services/session.service';
import { DocenteService } from '../../../services/docente.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-resultados-evaluacion',
  templateUrl: './resultados-evaluacion.component.html',
  styleUrls: ['./resultados-evaluacion.component.scss']
})
export class ResultadosEvaluacionComponent implements OnInit {

  cod_company: any;
	config_initial: any;
	user = this.session.getObject('user');
	emplid = Decrypt(this.user['emplid']);
	emplid_real = Decrypt(this.user['emplid_real']);
	oprid = atob(this.user['oprid']);
	evaluation:Array<any> = [];
	allSolicitudsClone:Array<any> = [];
	detail_eva:Array<any> = [];
	dataobs_fortalezas:Array<any> = [];
	dataobs_oportunidad:Array<any> = [];
	periodo_eva:Array<any> = [];
	allFilterPeriodo:Array<any> = [];
	puntaje_final: any;
	nivel_final: any;
	rank: any;

	@ViewChild('Modaldetail_eva1') Modaldetail_eva1:any;
	@ViewChild('Modaldetail_eva2') Modaldetail_eva2:any;
  @ViewChild('Modaldetail_eva3') Modaldetail_eva3:any;
  @ViewChild('Modaldetail_eva4') Modaldetail_eva4:any;
  
	loading = false;

	constructor(
		private session: SessionService, 
		private docenteS: DocenteService,
    private toastr: ToastrService) { 
		this.cod_company = this.session.getItem('cod_company');
		this.config_initial = AppSettings.CONFIG[this.cod_company];		
	}

	ngOnInit() {
		this.loading = true;
		this.docenteS.getresumenevaluation(this.emplid)
		.then(res => {
			this.evaluation = res.data;
			this.allSolicitudsClone = this.evaluation;
			this.allFilterPeriodo = this.evaluation;
        this.docenteS.getrankdocente(this.emplid)
    		.then(res => {
          if(res.data)
    			  this.rank = res.data.rank;
            this.loading = false;
    		});			
		}, (error)=>{
      this.toastr.error('Ocurrio un Error, Por favor vuelve a intentarlo');
      this.loading = false;
    });
	}

	openModal(item, tipo){
		this.loading = true;	
		this.docenteS.getdetailevaluation(item.codigo_docente, item.codigo_referencia, item.fecha_inicio, item.fecha_fin, tipo)
		.then(res => {
			this.detail_eva = res.data;		
			if(tipo=='1'){
				this.Modaldetail_eva1.open();
			}else if(tipo=='2'){
				this.dataobs_fortalezas = res.dataobs_fortalezas;	
				this.dataobs_oportunidad = res.dataobs_oportunidad;
				this.Modaldetail_eva2.open();
			}else if(tipo=='3'){
        this.puntaje_final = res.data_aux[0].puntaje_final;
        this.nivel_final = res.data_aux[0].nivel_logro;
				this.Modaldetail_eva3.open();
			}else if(tipo=='4'){
				this.Modaldetail_eva4.open();
			}				
			this.loading = false;					
		});
	}

	filerPostPeriodo(evt){
		let allData = JSON.parse(JSON.stringify(this.allSolicitudsClone));
  		if (evt.target.value) {
  		  this.evaluation = allData.filter(allp => allp.codigo_referencia == evt.target.value);
  		} else {
  		  this.evaluation = allData;
  		}
  }

}