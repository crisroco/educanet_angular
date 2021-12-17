import { Component, OnInit } from '@angular/core';
import { AppSettings } from '../../../app.settings';
import { Decrypt } from '../../../helpers/general';
import { GetFirstDayWeek, GetLastDayWeek, RealDate } from '../../../helpers/dates';
import { SessionService } from '../../../services/session.service';
import { DocenteService } from '../../../services/docente.service';

@Component({
  selector: 'app-weekly-schedule',
  templateUrl: './weekly-schedule.component.html',
  styleUrls: ['./weekly-schedule.component.scss']
})
export class WeeklyScheduleComponent implements OnInit {
	cod_company: any;
	config_initial: any;
	user = this.session.getObject('user');
	emplid = this.user?Decrypt(this.user['emplid']):'';
	emplid_real = this.user?Decrypt(this.user['emplid_real']):'';
	realDate: any;
	loading: boolean = false;
	classrooms: any;
	firstDayWeek: any;
	lastDayWeek: any;
	reallastDayWeek: any;
	listHours: any;
	backgroundColors: any = {
		'12': 'rgba(132, 238, 179, 0.38)',
		'1x': '#fff',
		'22': 'rgba(132, 238, 179, 0.38)',
		'2x': 'rgb(255, 205, 169)',
		'32': 'rgba(132, 238, 179, 0.38)',
		'3x': '#fffcd5',
		'42': 'rgba(132, 238, 179, 0.38)',
		'4x': '#fffcd5',
		'52': 'rgba(132, 238, 179, 0.38)',
		'5x': '#fffcd5',
		'62': 'rgba(132, 238, 179, 0.38)',
		'6x': '#fffcd5',
		'72': 'rgba(132, 238, 179, 0.38)',
		'7x': 'rgb(255, 205, 169)',
		'82': 'rgba(132, 238, 179, 0.38)',
		'8x': 'rgb(255, 205, 169)',
		'92': 'rgba(132, 238, 179, 0.38)',
		'9x': 'rgb(234, 234, 232)',
	}
	objDays = {
		'LUN': 0,
		'MAR': 1,
		'MIE': 2,
		'JUE': 3,
		'VIE': 4,
		'SAB': 5,
		'DOM': 6
	}

	constructor(private session: SessionService,
		private docenteS: DocenteService) {
		this.loading = true;
		this.cod_company = this.session.getItem('cod_company')?this.session.getItem('cod_company'):'002';
		this.config_initial = AppSettings.CONFIG[this.cod_company];
	}

	ngOnInit() {
		var firstDayWeek = RealDate(GetFirstDayWeek(new Date()));
		this.firstDayWeek = firstDayWeek.year + '-' + firstDayWeek.month + '-' + firstDayWeek.day;
		var lastDayWeek = RealDate(new Date());
		this.lastDayWeek = lastDayWeek.year + '-' + lastDayWeek.month + '-' + lastDayWeek.day;
		var realLastDayWeek = RealDate(GetLastDayWeek(new Date()));
		this.reallastDayWeek = realLastDayWeek.year + '-' + realLastDayWeek.month + '-' + realLastDayWeek.day;
		this.docenteS.getTeacherSchedule({
			EMPLID: (this.cod_company == '002'?'':this.emplid_real), 
			FECHA_AL: this.lastDayWeek,
			FECHA_DEL: this.firstDayWeek,
		})
		.then(res => {
			var objHours = {};
			this.listHours = [];
			this.classrooms = res.UCS_REST_MARCACAL_RES && res.UCS_REST_MARCACAL_RES.UCS_REST_MARCACAL_COM?res.UCS_REST_MARCACAL_RES.UCS_REST_MARCACAL_COM:[];
			for (var i = 0; i < this.classrooms.length; i++) {
				if(!objHours[this.classrooms[i].MEETING_TIME_START + ' - ' + this.classrooms[i].MEETING_TIME_END]){
					objHours[this.classrooms[i].MEETING_TIME_START + ' - ' + this.classrooms[i].MEETING_TIME_END] = {
						range: this.classrooms[i].MEETING_TIME_START + ' - ' + this.classrooms[i].MEETING_TIME_END,
						days: [{},{},{},{},{},{},{}]
					}
				}

				objHours[this.classrooms[i].MEETING_TIME_START + ' - ' + this.classrooms[i].MEETING_TIME_END].days[this.objDays[this.classrooms[i].UCS_DAY]] = this.classrooms[i];
			}
			for(var kHour in objHours){
				this.listHours.push(objHours[kHour]);
			}
			this.loading = false;
		}, error => { });
	}

}
