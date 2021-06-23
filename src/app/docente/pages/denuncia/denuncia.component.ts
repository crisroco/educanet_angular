import { Component, OnInit } from '@angular/core';
import { AppSettings } from '../../../app.settings';
import { SessionService } from '../../../services/session.service';
import { DocenteService } from '../../../services/docente.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-denuncia',
  templateUrl: './denuncia.component.html',
  styleUrls: ['./denuncia.component.scss']
})
export class DenunciaComponent implements OnInit {
  	cod_company: any;
	config_initial: any;
	user = this.session.getObject('user');
	public data = {
		subject: '',
		message: '',
		company: this.session.getItem('cod_company').substr(-1),
		name: '',
		email: this.user.email2
	};

  constructor(private session: SessionService,
	public toastr: ToastrService,
	private docenteS: DocenteService) {
		this.cod_company = this.session.getItem('cod_company');
		this.config_initial = AppSettings.CONFIG[this.cod_company];
	}

  ngOnInit() {
  }

  send(){
	  console.log(this.data);
	  let a = JSON.stringify( { data : [this.data] });
	  this.docenteS.getComplaints({ data : a })
	  	.then((res) => {
			console.log(res);
			if(res){
				this.toastr.success('Mensaje enviado correctamente');
				this.data = {
					subject: '',
					message: '',
					company: this.session.getItem('cod_company').substr(-1),
					name: '',
					email: this.user.email2
				};
			}
		  });
  }

}
