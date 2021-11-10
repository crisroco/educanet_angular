import { Component, OnInit, ViewChild } from '@angular/core';
import { AppSettings } from '../../../app.settings';
import { Decrypt } from '../../../helpers/general';
import { SessionService } from '../../../services/session.service';
import { DocenteService } from '../../../services/docente.service';
import { ExcelService } from '../../../services/excel.service';
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
	codigo:string='';
	evaluation:Array<any> = [];
	allSubOrdinados:Array<any> = [];
	allSolicitudsClone:Array<any> = [];
	allParametria:Array<any> = [];
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
		public excel: ExcelService,
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
				
				this.docenteS.getParametria(this.cod_company)
				.then(res => {		
					this.allParametria = res.data;
					this.loading = false;
				});	

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

  getReporte(){
	this.loading = true;

	this.docenteS.getSubOrdinadosJefe(this.emplid, this.cod_company)
	.then(res => {
		this.allSubOrdinados = res;
		let subordinados = [];
		for (let index = 0; index < this.allSubOrdinados.length; index++) {
			subordinados[index] = {'cuc': this.allSubOrdinados[index]['CUC']} 
		}
		
		let data = { 'compania':this.cod_company, 'codigo': this.codigo, "subordinados": subordinados}
	
		this.docenteS.getReporte(data)
		.then(res => {
			let array = res.data;
			let data = [];
			let headers			  
			headers = ['ID', 'DOCENTE',	'DOCENTE_JP', 'TIPO_CONTRATACION', 'GRADO_ACADEMICO', 'PUNTAJE_CENTESIMAL_ENCUESTA', 'PUNTAJE_ENCUESTA', 'RESULTADO_ENCUESTA', 'NIVEL_LOGRO_ENCUESTA', 'PUNTAJE_CLASE', 'RESULTADO_CLASE', 'NIVEL_LOGRO_CLASE', 'HORAS_CAPACITACIONES', 'PUNTAJE_CAPACITACION', 'PUNTAJE_LOGRO', 'PUNTAJE_DESARROLLO', 'RESULTADO_DESARROLLO', 'NIVEL_LOGRO_DESARROLLO', 'EXPEDIENTE_PERSONAL', 'PUNTUALIDAD_ASISTENCIA', 'REGISTRO_NOTAS', 'CARPETAS_INSTRUCCIONALES', 'PARTICIPACION_REUNIONES', 'PUNTAJE_COMPROMISO', 'PUNTAJE_CENTESIMAL_COMPROMISO', 'RESULTADO_COMPROMISO', 'NIVEL_LOGRO_COMPROMISO', 'PUNTAJE_FINAL', 'RESULTADO_FINAL', 'NIVEL_LOGRO_FINAL', 'RANKING', 'CIED'];	

			for (var i = 0; i < array.length; i++) {
			let toData = [array[i].ID, array[i].DOCENTE, array[i].DOCENTE_JP, array[i].TIPO_CONTRATACION, array[i].GRADO_ACADEMICO, array[i].PUNTAJE_CENTESIMAL_ENCUESTA, array[i].PUNTAJE_ENCUESTA, array[i].RESULTADO_ENCUESTA, array[i].NIVEL_LOGRO_ENCUESTA, array[i].PUNTAJE_CLASE, array[i].RESULTADO_CLASE, array[i].NIVEL_LOGRO_CLASE, array[i].HORAS_CAPACITACIONES, array[i].PUNTAJE_CAPACITACION, array[i].PUNTAJE_LOGRO, array[i].PUNTAJE_DESARROLLO, array[i].RESULTADO_DESARROLLO, array[i].NIVEL_LOGRO_DESARROLLO, array[i].EXPEDIENTE_PERSONAL, array[i].PUNTUALIDAD_ASISTENCIA, array[i].REGISTRO_NOTAS, array[i].CARPETAS_INSTRUCCIONALES, array[i].PARTICIPACION_REUNIONES, array[i].PUNTAJE_COMPROMISO, array[i].PUNTAJE_CENTESIMAL_COMPROMISO, array[i].RESULTADO_COMPROMISO, array[i].NIVEL_LOGRO_COMPROMISO, array[i].PUNTAJE_FINAL, array[i].RESULTADO_FINAL, array[i].NIVEL_LOGRO_FINAL, array[i].RANKING, array[i].CIED];			
			data.push(toData);
			}
			this.excel.generateExcel(headers, data);
			this.loading = false;
		});				
	}, (error)=>{
		this.toastr.error('Ocurrio un Error, Por favor vuelve a intentarlo');
		this.loading = false;
	});
	
  }

}