import { Component, OnInit, ViewChild } from '@angular/core';
import { AppSettings } from '../../../app.settings';
import { Decrypt } from '../../../helpers/general';
import { SessionService } from '../../../services/session.service';
import { DocenteService } from '../../../services/docente.service';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import * as $ from 'jquery';

@Component({
  selector: 'app-reuniones-docente',
  templateUrl: './reuniones-docente.component.html',
  styleUrls: ['./reuniones-docente.component.scss']
})
export class ReunionesDocenteComponent implements OnInit {

  cod_company: any;
	config_initial: any;
	user = this.session.getObject('user');
	emplid = this.user?Decrypt(this.user['emplid']):'';
	emplid_real = this.user?Decrypt(this.user['emplid_real']):'';
	oprid = atob(this.user['oprid']);
	codigo_referencia:string='';

  public allParametria:Array<any> = [];
  allSubOrdinados:Array<any> = [];
  public allColaborators:Array<any> = [];
  public allColaboratorsOrigen:Array<any> = [];
  public allColaboratorsClone:Array<any> = [];
  public allColaboratorsAsignados:Array<any> = [];

  public allAreas:Array<any> = [];
  public allSedes:Array<any> = [];
  public allPuesto:Array<any> = [];

  selectedUser = {nombre:'', apellido_paterno:'', apellido_materno:'', compania:'', codigo_referencia:'', asignador:'', asignado:''};

  newRequest = {
    area: '',
    sede: '',
    puesto: '',
    cuc:'',
    nombre:'',
    apellido_paterno:'',
    apellido_materno:''
  }

	@ViewChild('createUserModal') createUserModal:any;
  @ViewChild('deleteModal') deleteModal:any;
  @ViewChild('replyModal') replyModal:any;  
  
	loading = false;

	constructor(
		private session: SessionService, 
		private docenteS: DocenteService,
    public http:HttpClient,
    private toastr: ToastrService) { 
		this.cod_company = this.session.getItem('cod_company');
		this.config_initial = AppSettings.CONFIG[this.cod_company];		
	}

	ngOnInit() {
		this.loading = true;
    this.docenteS.getSubOrdinadosJefe(this.emplid, this.cod_company)
  	.then(res => {
  		this.allSubOrdinados = res;
  		let subordinados = [];
  		for (let index = 0; index < this.allSubOrdinados.length; index++) {
  			subordinados[index] = {'cuc': this.allSubOrdinados[index]['CUC']} 
  		}	
      let data = { 
                  'compania':this.cod_company, 
                  'subordinados': subordinados 
                 };
      this.docenteS.getAllColaborators(data)
      .then((res) => {    
        this.allColaborators = res['data'];
        this.allColaboratorsOrigen = res['data'];
        this.docenteS.getParametria(this.cod_company)
        .then(res => {		
          this.allParametria = res.data;
          this.docenteS.getDatosOrganizacion("AR")
          .then((res) => {
          this.allAreas = this.alphabethicSort(res.data);
          this.loading = false;
          });
        });      
      });

  	}, (error)=>{
  		this.toastr.error('Ocurrio un Error, Por favor vuelve a intentarlo');
  	});

	}

  changeArea(input_value){
    this.newRequest.sede = '';
    this.newRequest.puesto = '';
    this.allSedes = [];
    this.allPuesto = [];
    this.loading = true;
    this.docenteS.getDatoswithoutCode("SE", input_value.split('|')[0])
    .then((res) => {
      this.allSedes = this.alphabethicSort(res.data);
      this.docenteS.getDatoswithoutCode("PU", input_value.split('|')[0])
      .then((res) => {
        this.allPuesto = this.alphabethicSort(res.data);
        this.loading = false;
      });
    });
  }

  alphabethicSort(array){
    return array.sort(function(a, b) {
        if (a.descripcion > b.descripcion) {
          return 1;
        }
        if (b.descripcion > a.descripcion) {
          return -1;
        }
        return 0;
      });
  }

  filterModal(area, sede, puesto, cuc, nombre, apellido_paterno, apellido_materno){
    this.loading = true;
    let allData = JSON.parse(JSON.stringify(this.allColaboratorsClone));
        
    setTimeout(() => {
      if(area !== '')
        area = area.split('|')[1];

      if(sede !== '')
        sede = sede.split('|')[1];

      this.allColaborators = allData.filter(allp => allp.codigo_area == ((area !== '')? area:allp.codigo_area) && allp.codigo_sede.trim() == ((sede !== '')? sede:allp.codigo_sede.trim()) && allp.codigo_puesto.trim() == ((puesto !== '')? puesto:allp.codigo_puesto.trim()) && allp.cuc.includes((cuc !== '')?cuc:allp.cuc.trim())
      && allp.nombre.includes((nombre !== '')?nombre.toUpperCase():allp.nombre.trim()) && allp.apellido_paterno.includes((apellido_paterno !== '')?apellido_paterno.toUpperCase():allp.apellido_paterno.trim()) 
      && allp.apellido_materno.includes((apellido_materno !== '')?apellido_materno.toUpperCase():allp.apellido_materno.trim()));
      
      this.loading = false;      
    }, 500);    
  }

  checkAll(container){
    $('#'+container +' input[type="checkbox"]' ).prop('checked', true) 
  }
  
  noCheckAll(container){
    $('#'+container +' input[type="checkbox"]' ).prop('checked', false)    
  }

  deleteOpen(u){
    this.selectedUser = u;
    this.deleteModal.open();
  }

  confirmDelete(){
    this.loading = true;
    let data = {
                'compania': this.selectedUser.compania,
                'codigo_referencia': this.selectedUser.codigo_referencia,
                'asignador': this.selectedUser.asignador,
                'asignado': this.selectedUser.asignado,
               }
          
    this.docenteS.deleteParticipacionReuniones(data)
      .then((res) => {
        this.loading = false;       
        if(res.status){
          this.toastr.success('Colaborador Quitado Correctamente');  
          this.deleteModal.close();         
          this.getColaboratorAsignado();
        }else{
          this.deleteModal.close(); 
          this.toastr.warning(res.mensaje);
        }               
      });   
  }

  confirmReply(){
    this.loading = true;
    let data = {
                'compania': this.cod_company,
                'codigo_referencia': this.codigo_referencia,
                'asignador': this.emplid,
               }
          
    this.docenteS.replyParticipacionReuniones(data)
      .then((res) => {
        this.loading = false;       
        if(res.status){
          this.toastr.success('Data Replicada Correctamente');  
          this.replyModal.close();         
          this.getColaboratorAsignado();
        }else{
          this.deleteModal.close(); 
          this.toastr.warning(res.mensaje);
        }               
      });   
  }

  addColaborators(){
    const formData = new FormData();
    this.loading = true;
    let i=0;
    let data = [];
  
    $("#containerModal input:checkbox:checked").each(function() {      
      data[i] = {cuc: this.id} 
      i++;  
    });

    formData.append('asignados', JSON.stringify(data));
    formData.append('compania', this.cod_company);
    formData.append('codigo_referencia', this.codigo_referencia);
    formData.append('asignador', this.emplid);
    this.http.post(AppSettings.BASE_DESEMPENO_DOCENTE+'api/AddColaborator', formData)
    .subscribe(res => {
      this.createUserModal.close();
      this.toastr.success('Datos guardados Correctamente');
      this.getColaboratorAsignado();
    }, (err) => {  
      this.createUserModal.close();
      this.toastr.error('Ocurrio un Error, Por favor vuelve a intentarlo');
      this.loading = false;
    });
  }

  saveData(){
    const formData = new FormData();
    this.loading = true;
    let i=0;
    let data = [];

    $("#container input:checkbox:checked").each(function() {      
      data[i] = {
                  cuc: this.id,
                  reuniones_asistidas: $('#ASIS_'+this.id).val(),
                  reuniones_programadas: $('#PROG_'+this.id).val(),                  
                  participacion_reuniones: $('#CALC_'+this.id).val()
                } 
      i++;  
    });
    
    formData.append('asignados', JSON.stringify(data));
    formData.append('compania', this.cod_company);
    formData.append('codigo_referencia', this.codigo_referencia);
    formData.append('asignador', this.emplid);
    this.http.post(AppSettings.BASE_DESEMPENO_DOCENTE+'api/saveParticipacionReuniones', formData)
    .subscribe(res => {
      this.createUserModal.close();
      this.toastr.success('Datos guardados Correctamente');
      this.getColaboratorAsignado();
    }, (err) => {  
      this.createUserModal.close();
      this.toastr.error('Ocurrio un Error, Por favor vuelve a intentarlo');
      this.loading = false;
    });
  }

  calculo(index){
    let a = 0;
    let b = 1;
    
    a = $('#ASIS_'+index).val();
    b = $('#PROG_'+index).val();
    $('#CALC_'+index).val((a/b).toFixed(2));
  }

  getColaboratorAsignado(){
    this.loading = true;
    this.docenteS.getColaboratorAsignados(this.cod_company, this.codigo_referencia, this.emplid)
    .then((res) => {
      this.allColaboratorsAsignados = res['data'];
      this.loading = false;   
    }); 
  }

  openNewModal(){
    this.loading = true;
    this.allColaborators = this.allColaboratorsOrigen;      
    let yFilter = this.allColaboratorsAsignados.map(itemY => { return itemY.asignado; });
    let filteredX = this.allColaborators.filter(itemX => !yFilter.includes(itemX.cuc));
    this.allColaborators = filteredX;
    this.allColaboratorsClone = this.allColaborators; 

    setTimeout(() => {
      this.loading = false;
      this.createUserModal.open();
    }, 1000);    
  }

}
