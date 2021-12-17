import { Component, OnInit } from '@angular/core';
import { AppSettings } from '../../../app.settings';
import { SessionService } from '../../../services/session.service';
import { DocenteService } from '../../../services/docente.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from "moment";
import { DatePipe } from '@angular/common';
import { Decrypt } from '../../../helpers/general';

@Component({
  selector: 'app-vacaciones',
  templateUrl: './vacaciones.component.html',
  styleUrls: ['./vacaciones.component.scss'],
  providers: [DatePipe]
})
export class VacacionesComponent implements OnInit {

  config_initial: any;
	user = this.session.getObject('user');
  cod_company: any = this.user['cod_company'];
  emplid = this.user?Decrypt(this.user['emplid']):'';
  p_correo: any = this.user['email2'];
  solicitudes:Array<any> = [];
  vacaciones:Array<any> = [];
  solicitarVacaciones:boolean=true;
  misSolicitudes:boolean=false;
  divClass: any;
  loading = false;

  d_truncos:any = 0;
  d_pendientes:any = 0;
  d_vencidas:any = 0;
  s_email_r:any;
  s_email_a:any;
  cuc_jefe:any;
  nombre_jefe:any;
  
  constructor(
		private session: SessionService, 
		private docenteS: DocenteService,
    private miDatePipe: DatePipe,
    private toastr: ToastrService) { 
		this.cod_company = this.session.getItem('cod_company');
		this.config_initial = AppSettings.CONFIG[this.cod_company];		
	}

  public daterange: any = {
    start: Date.now(),
    end: Date.now()
  };
  
  fecha_ini:any;
  fecha_fin:any;
  fecha_retorno:any;
  
  s_fecha_ini:any;
  s_fecha_fin:any;
  s_fecha_retorno:any;
  n_diasvaca:any;
  max_num_dias:any;
  btn_off:boolean = true;
  minDate:any;

  ngOnInit() { 
    this.minDate = moment().subtract(0, 'days');
    this.getvacaciones();
    this.cargar_mis_pedientes();
    this.daterange.start = this.miDatePipe.transform(new Date (), 'yyyy-MM-dd');
  }
  
  public selectedDate(value: any) {
    this.daterange.start = value.start;
    this.daterange.end   = value.end;
  }
  
  ranges: any = {
    'Today': [moment(), moment()] 
  }
  
  public locale: any = {
                          format: 'DD/MM/YYYY',                       
                          displayFormat: 'DD/MM/YYYY', 
                          weekLabel: 'S', 
                          applyLabel: 'Aplicar',
                          clearLabel: 'Cancelar',                       
                          'daysOfWeek': [
                          'Do',
                          'Lu',
                          'Ma',
                          'Mi',
                          'Ju',
                          'Vi',
                          'Sa'
                          ],
                          'monthNames': [
                          'Enero',
                          'Febrero',
                          'Marzo',
                          'Abril',
                          'Mayo',
                          'Junio',
                          'Julio',
                          'Agosto',
                          'Septiembre',
                          'Octubre',
                          'Noviembre',
                          'Diciembre'
                          ]
                      };
  

  public datesUpdated(e: any) {
  if(!e.startDate && !e.endDate){
    this.n_diasvaca = 0;
    return;
  }

  if(e.startDate['_d'] != 'Invalid Date' && e.endDate['_d'] != 'Invalid Date') {
      this.daterange.start = e.startDate['_d'];
      this.daterange.end   = e.endDate['_d'];
     
      let f1 = this.miDatePipe.transform(this.daterange.start, 'dd/MM/yyyy');
      let f2 = this.miDatePipe.transform(this.daterange.end, 'dd/MM/yyyy');
    
      this.fecha_ini = f1;
      this.fecha_fin = f2;
    
      let inicio:Date = new Date(this.addDays(f1,0));
      let fin:Date    = new Date(this.addDays(f2,0));
      
      this.n_diasvaca  = this.restaFechas(f1,f2)+1;
    
      let miFecha      = this.addDays(f2, this.n_diasvaca);
      let retorno:Date = new Date(miFecha);
    
      this.s_fecha_ini = ( inicio.getDate() < 10 ? '0' : '')+inicio.getDate()+'/'+ ( inicio.getMonth()+1 < 10 ? '0' : '')+( inicio.getMonth()+1)+'/'+inicio.getFullYear();
      this.s_fecha_fin = (fin.getDate() < 10 ? '0' : '')+fin.getDate()+'/'+ (fin.getMonth()+1 < 10 ? '0' : '')+(fin.getMonth()+1)+'/'+fin.getFullYear();
      this.s_fecha_retorno = (retorno.getDate() < 10 ? '0' : '')+retorno.getDate()+'/'+ (retorno.getMonth()+1 < 10 ? '0' : '')+(retorno.getMonth()+1)+'/'+retorno.getFullYear();
    
      let feriados = [];
           
      this.max_num_dias = this.d_pendientes+this.d_truncos+this.d_vencidas;
  
      if((feriados.indexOf(this.s_fecha_retorno) >= 0) || (this.n_diasvaca > 30) || this.cuc_jefe==null || this.cuc_jefe==''){ 
          if (this.n_diasvaca > 30 ) this.toastr.warning('No puede pedir más de 30 dias vacaciones');
          if (this.cuc_jefe==null || this.cuc_jefe=='') this.toastr.warning('No tiene un aprobador asignado'); 
          this.btn_off = true;
      } else {          
        this.btn_off = false;  // si cumple con las validaciones  
      }
    }else{
      this.btn_off = true;
      this.n_diasvaca = 0;
      this.s_fecha_retorno = '';
      this.toastr.warning('Seleccione los rangos correctamente'); 
      
    }
    this.daterange.start = this.miDatePipe.transform(new Date (), 'yyyy-MM-dd');
  }  
  
  restaFechas (f1,f2) {     
    let aFecha1 = f1.split('/'); 
    let aFecha2 = f2.split('/'); 
    let fFecha1 = Date.UTC(aFecha1[2],aFecha1[1]-1,aFecha1[0]); 
    let fFecha2 = Date.UTC(aFecha2[2],aFecha2[1]-1,aFecha2[0]); 
    let dif = fFecha2 - fFecha1;
    let dias = Math.floor(dif / (1000 * 60 * 60 * 24)); 
    return dias;
  }
  
  addDays(date, days) {
  
      let cFec = date.split('/');
      let pDays = (days>0?1:0);
      let f_fecha : Date = new Date(cFec[2]+'/'+cFec[1]+'/'+cFec[0]);
  
      return f_fecha.setDate( f_fecha.getDate() + pDays);
  
  }

  openTab(codigo){
    switch (codigo) {
      case 1:
        this.solicitarVacaciones=true;
        this.misSolicitudes=false;
        break;
      case 2:
        this.solicitarVacaciones=false;
        this.misSolicitudes=true;  
        this.cargar_mis_pedientes();      
        break;
    }
  }

  getvacaciones() {   
    let tmp_email = this.p_correo;  
    let tmp_email_a = null;

    this.docenteS.getvacaciones(this.emplid, this.cod_company)
    .then(res => { 
        let objeto       : any;
        let t_truncos    : number = 0;
        let t_pendientes : number = 0;
        let t_vencidas   : number = 0;
        let cuc_jefe     : string ='';
        let nombre_jefe  : string ='';
        objeto = res;
        this.vacaciones = objeto

        if(this.vacaciones!=null){
          this.vacaciones.forEach(function (o, index) {
            t_truncos    += parseInt(o.IN_TOTAL_DIAS_TRUNCOS);
            t_pendientes += parseInt(o.IN_TOTAL_DIAS_PENDIENTE);
            t_vencidas   += parseInt(o.IN_TOTAL_DIAS_VENCIDOS);
            cuc_jefe     = (o.VC_CUC_JEFE!=null?o.VC_CUC_JEFE:'');
            nombre_jefe  = (o.VC_NOMBRE_JEFE!=null?o.VC_NOMBRE_JEFE:'');
            tmp_email_a  = (index==0 && o.VC_CORREO_JEFE!=null ?o.VC_CORREO_JEFE:'-- SIN CORREO --')
          });
        } 

        this.d_truncos    = t_truncos;
        this.d_pendientes = t_pendientes;
        this.d_vencidas   = t_vencidas;
        this.s_email_r    = tmp_email;
        this.s_email_a    = tmp_email_a;
        this.cuc_jefe     = cuc_jefe;
        this.nombre_jefe  = (nombre_jefe!=''?nombre_jefe:'- SIN ASIGNAR -');
		},(err) => {
      this.toastr.error('Ocurrio un Error, Por favor vuelve a intentarlo');
      this.loading = false;
      });
  }

  cargar_mis_pedientes(){
    this.loading = true;   
    this.docenteS.getmisvacaciones(this.emplid, this.cod_company, '', '')
		.then(res => { 
        this.solicitudes = res['message'].solicitudes;
        this.loading = false;       
    },(err) => { 
        this.toastr.error('Ocurrio un Error, Por favor vuelve a intentarlo');
        this.loading = false;
    });
  }

  enviarSolicitud() {
    this.loading = true;
    this.btn_off = true;

    let  pFecha_ini = (this.fecha_ini).split('/'); 
    let  sFecha_ini = pFecha_ini[2]+'/'+pFecha_ini[1]+'/'+pFecha_ini[0]; 
    let  pFecha_fin = (this.fecha_fin).split('/'); 
    let  sFecha_fin = pFecha_fin[2]+'/'+pFecha_fin[1]+'/'+pFecha_fin[0]; 

    let data = {
                  action:"ingresar",
                  emplid: this.emplid,
                  correo:this.p_correo,
                  compania:this.cod_company,
                  start_date:sFecha_ini,
                  finish_date:sFecha_fin
                };

    this.docenteS.registrarvacaciones(data)
    .then( res => { 
      this.loading = false;
      if (res['status']=='fail') {            
        this.toastr.error(res['message']);
      }else{
        this.toastr.success(res['message']);
      }         
    }, (err) => {
        try {
          let caderr = err['error'].text;
          let cadenaJs = caderr.substring(caderr.indexOf("{"), caderr.length);
          let resJS = JSON.parse(cadenaJs);
          if (resJS['status']=='fail') {            
            this.toastr.error(resJS['message']);
          }else{
            this.toastr.success(resJS['message']);
          } 
          this.loading = false;       
        } catch (error) {
          this.loading = false;
          this.toastr.error(error);       
        }     
    });
  }

}
