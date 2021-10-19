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

	keyPress(evt){
		var inp = String.fromCharCode(evt.keyCode);
		if (/[a-zA-Z0-9@ñáéíóúÁÉÍÓÚ ]/.test(inp)) {
			return true;
		} else {
			evt.preventDefault();
			return false;
		}
	}

	onPaste(evt){
		let txt = evt.clipboardData.getData('text');
		var regex = /[^a-zA-Z0-9@ñáéíóúÁÉÍÓÚ ]/;
		if(txt.match(regex)){
			this.toastr.warning('Tu mensaje cuenta con carácteres especiales');
			evt.returnValue = false;
			evt.preventDefault();
		}
	}

  	send(){
	  let a = JSON.stringify( { data : [this.data] });
	  this.docenteS.getComplaints({ data : a })
	  	.then((res) => {
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
