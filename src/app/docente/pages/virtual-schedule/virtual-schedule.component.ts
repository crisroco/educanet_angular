import { Component, OnInit, ViewChild } from '@angular/core';
import { AppSettings } from '../../../app.settings';
import { Decrypt } from '../../../helpers/general';
import { ToastrService } from 'ngx-toastr';
import { RealDate, GetFirstDayWeek, AddDay, SameDay2, fullHour } from '../../../helpers/dates';
import { SessionService } from '../../../services/session.service';
import { DocenteService } from '../../../services/docente.service';
import { GeneralService } from '../../../services/general.service';
import { CalendarDateFormatter, CalendarView, CalendarEventAction, CalendarEvent } from 'angular-calendar';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-virtual-schedule',
  templateUrl: './virtual-schedule.component.html',
  styleUrls: ['./virtual-schedule.component.scss']
})
export class VirtualScheduleComponent implements OnInit {
	cod_company: any;
	config_initial: any;
	user = this.session.getObject('user');
	emplid = Decrypt(this.user['emplid']);
	emplid_real = Decrypt(this.user['emplid_real']);
	oprid = atob(this.user['oprid']);
	realDate: any;
	classrooms: any;
	events:CalendarEvent[] = [];
	CalendarView = CalendarView;
    view: CalendarView = CalendarView.Week;
    listahours = ['06:00', '06:15','06:30','06:45','07:00', '07:15','07:30','07:45','08:00', '08:15','08:30','08:45','09:00', '09:15','09:30','09:45','10:00', '10:15','10:30','10:45','11:00', '11:15','11:30','11:45','12:00', '12:15','12:30','12:45','13:00', '13:15','13:30','13:45','14:00', '14:15','14:30','14:45','15:00', '15:15','15:30','15:45','16:00', '16:15','16:30','16:45','17:00', '17:15','17:30','17:45','18:00', '18:15','18:30','18:45','19:00', '19:15','19:30','19:45','20:00', '20:15','20:30','20:45','21:00', '21:15','21:30','21:45','22:00', '22:15','22:30','22:45','23:00', '23:15','23:30','23:45', '00:00'];
    viewDate: Date = new Date("2016-04-05");
    locale: string = 'en';
    hourSegments: number = 2;
    weekStartsOn: number = 0;
    startsWithToday: boolean = true;
    activeDayIsOpen: boolean = true;
    weekendDays: number[] = [0,6];
    dayStartHour: number = 7;
    dayEndHour: number = 23;
    dayEndMinute: number = 59;
    dayStartMinute: number = 0;
    // minDate: Date = new Date();
    // maxDate: Date = endOfDay(addMonths(new Date(), 1));
    dayModifier: Function;
    hourModifier: Function;
    segmentModifier: Function;
    prevBtnDisabled: boolean = false;
    nextBtnDisabled: boolean = false;
    public updating: boolean = false;
    @ViewChild('addModal') addModal:any;
    public days = ['Domingo','Lunes','Martes','Miercoles','Jueves','Viernes','Sabado'];
    public allCampus = [];
    public allGrados = [];
    public selectedDisponibility;
    public selectedDay = '';
    public fullday;
    public virtual = {
    	start: '',
    	end: ''
    }
    loading:boolean = false;
    actions: CalendarEventAction[] = [
		{
			label: '<i class="fas fa-fw fa-pencil-alt"></i>',
			a11yLabel: 'Edit',
			onClick: ({ event }: { event: CalendarEvent }): void => {
				this.segmentClicked('Edited', event);
			},
		},
		{
			label: '<i class="fas fa-fw fa-trash-alt"></i>',
			a11yLabel: 'Delete',
			onClick: ({ event }: { event: CalendarEvent }): void => {
				this.events = this.events.filter((iEvent) => iEvent !== event);
				this.segmentClicked('Deleted', event);
			},
		},
	];

    public allClasses:Array<any> = [];
  constructor(private session: SessionService,
		private generalS: GeneralService,
		private toastr: ToastrService,
		private docenteS: DocenteService) { 
		this.cod_company = this.session.getItem('cod_company');
		this.config_initial = AppSettings.CONFIG[this.cod_company];
	}

  ngOnInit() {
  	this.getAllVirtualClasses();
  }

  getAllVirtualClasses(){
  	this.loading = true;
  	this.docenteS.getVirtualSchedule(this.user.emplid_moodle)
  		.then((res) => {
			this.allClasses = res['data'];
  			this.closeOpenMonthViewDay();
  			this.docenteS.getCampus()
  				.then((res) => {
  					this.allCampus = res['data'];
  					this.docenteS.getgrado()
  						.then((res) => {
  							this.loading = false;
  							this.allGrados = res['data'];
  						});
  				});
  		});
  }

  eventClicked(evt){
  	this.selectedDay = this.days[new Date(evt.start).getDay()];
  	let daySelected = evt.start.getFullYear() + '-' + (evt.start.getMonth() + 1) + '-' + evt.start.getDate();
  	this.fullday = daySelected;
  	var minutesS = (evt.start.getMinutes() < 10 ? '0' : '') + evt.start.getMinutes();
	var hourS = (evt.start.getHours() < 10 ? '0' : '') + evt.start.getHours();
	var minutesE = (evt.end.getMinutes() < 10 ? '0' : '') + evt.end.getMinutes();
	var hourE = (evt.end.getHours() < 10 ? '0' : '') + evt.end.getHours();
  	this.virtual.start = hourS + ':' + minutesS;
  	this.virtual.end = hourE + ':' + minutesE;
  	this.updating = true;
  	this.selectedDisponibility = evt.meta;
	this.addModal.open();
  }

  hourSegmentClicked(evt){
  	this.selectedDay = this.days[new Date(evt.date).getDay()];
  	this.addedDate(evt.date);
  }

  addedDate(date){
  	let daySelected = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
  	this.fullday = daySelected;
  	var seconds = date.getSeconds();
	var minutes = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
	var hour = (date.getHours() < 10 ? '0' : '') + date.getHours();
	this.virtual.start = hour + ':' + minutes;
	this.virtual.end = '';
	this.updating = false;
	this.selectedDisponibility = '';
	this.addModal.open();
  }

  validateMinutes(){
  	let startM = this.virtual.start.split(':')[1];
  	let endM = this.virtual.end.split(':')[1];
  	if (Number.isInteger(Number(startM) / 15) && Number.isInteger(Number(endM) / 15)) {
  		return true
  	}else {
  		this.toastr.warning('Los minutos tienen que acabar en 00,15,30,45');
  		this.loading = false;
  		return false
  	}
  }

  save(){
  	this.loading = true;
	if (this.updating) {
  		let data = {
	  		institucion: "UCS",
	  		description: this.user.emplid_moodle,
	  		profesor: this.user.name,
	  		oprid: "PEOPLE",
	  		date: this.selectedDisponibility.date,
	  		end: this.selectedDisponibility.end,
	  		newdate: this.fullday + ' ' + this.virtual.start + ':00',
	  		newend: this.fullday + ' ' + this.virtual.end + ':00',
	  	}

	  	if (this.virtual.end > this.virtual.start) {
	  		this.docenteS.updateDisponibility(data).then((res) => {
		  		if (res['status']) {
		  			this.ngOnInit();
		  			this.toastr.success('Disponibilidad Actualizada');
		  			this.loading = false;
		  			this.addModal.close();
		  		} else {
		  			this.loading = false;
					this.toastr.error(res['mensaje']);
		  		}
		  	});
	  	} else {
	  		this.loading = false;
	  		this.toastr.warning('El tiempo fin es menor al tiempo de inicio');
	  	}
  	} else {
  		let data = {
	  		institucion: "UCS",
	  		description: this.user.emplid_moodle,
	  		profesor: this.user.name,
	  		date: this.fullday + ' ' + this.virtual.start + ':00',
	  		end: this.fullday + ' ' + this.virtual.end + ':00',
	  		proceso: 1
	  	}
	  	if (this.virtual.end > this.virtual.start) {
	  		this.docenteS.saveDisponibility(data).then((res) => {
		  		if (res['status']) {
		  			this.ngOnInit();
		  			this.toastr.success('Disponibilidad Creada');
		  			this.loading = false;
		  			this.addModal.close();
		  		} else {
		  			this.loading = false;
	  				this.toastr.error(res['mensaje']);
		  		}
		  	});
	  	} else {
	  		this.loading = false;
	  		this.toastr.warning('El tiempo fin es menor al tiempo de inicio');
	  	}
  	}
  }

  closeOpenMonthViewDay(){
  	var firstDate = GetFirstDayWeek(this.viewDate);
	var days = {
		MON:  RealDate(firstDate),
		TUES: RealDate(AddDay(firstDate, 1)),
		WED: RealDate(AddDay(firstDate, 2)),
		THURS: RealDate(AddDay(firstDate, 3)),
		FRI: RealDate(AddDay(firstDate, 4)),
		SAT: RealDate(AddDay(firstDate, 5)),
		SUN: RealDate(AddDay(firstDate, 6)),
	}
	var events = [];
	var objEvents = {};
	let dates: any = {};
	this.allClasses.forEach(myclase => {
		for(var kDay in days){
			if(SameDay2(RealDate(new Date(myclase.date)), days[kDay])){
				var rDay = days[kDay].year + '-' + days[kDay].month + '-' + days[kDay].day;
				myclase.secondDate = rDay;
				if(!objEvents[rDay + ' ' + fullHour(RealDate(new Date(myclase.date))) + ' ' + myclase.description]){
					dates = this.getDates(rDay, fullHour(RealDate(new Date(myclase.date))), fullHour(RealDate(new Date(myclase.end))));
					let hourandMinutesS = fullHour(RealDate(new Date(myclase.date)));
					let hourandMinutesE = fullHour(RealDate(new Date(myclase.end)));
					events.push({
						start: dates.start,//new Date(rDay + ' ' + classD.MEETING_TIME_START),
						end: dates.end,//new Date(rDay + ' ' + classD.MEETING_TIME_END),
						title: hourandMinutesS.slice(0, -3) + '-' + hourandMinutesE.slice(0,-3),
						actions: this.actions,
						allDay: false,
						resizable: {
							beforeStart: true,
							afterEnd: true,
						},
						meta: myclase,
					});
					objEvents[rDay + ' ' + fullHour(RealDate(new Date(myclase.date))) + ' ' + myclase.description] = true;
				}
			}
		}
		this.events = events;
	});
  }

  getDates(rDay: string, MEETING_TIME_START: string, MEETING_TIME_END: string) {
		let start: Date;
		let end: Date;
		const ua = navigator.userAgent.toLowerCase();
		if (ua.indexOf('safari') !== -1) {
			if (ua.indexOf('chrome') > -1) {
				start = new Date(rDay + 'T' + MEETING_TIME_START);
				end = new Date(rDay + 'T' + MEETING_TIME_END);
			} else {
				start = new Date(this.getDay(rDay, this.getHour(MEETING_TIME_START)));
				end = new Date(this.getDay(rDay, this.getHour(MEETING_TIME_END)));
			}
		} else {
			start = new Date(rDay + 'T' + MEETING_TIME_START);
			end = new Date(rDay + 'T' + MEETING_TIME_END);
		}

		return { start, end };
	}

	getHour(pHour: string): string {

		const arrHour = pHour.split(':');
		let hour =  Number(arrHour[0]);
		hour += 5;
		const hourModified = this.pad(hour, 2);
		const minute =  arrHour[1];
		const second =  arrHour[2];

		return `${hourModified}:${minute}:${second}`;
	}

	getDay(pDay: string, pHour: string): string {

		let rDate = `${pDay}T${pHour}`;

		const arrHour = pHour.split(':');
		let hour =  Number(arrHour[0]);
		if (hour > 23) {

			const arrDate = pDay.split('-'); // 2020-07-06

			let day =  Number(arrDate[2]);
			day += 1;

			const dayModified = this.pad(day, 2);
			const month =  arrDate[1];
			const year =  arrDate[0];

			const vDate = `${year}-${month}-${dayModified}`;

			hour -= 24;
			const hourModified = this.pad(hour, 2);
			const minute =  arrHour[1];
			const second =  arrHour[2];

			const vHour = `${hourModified}:${minute}:${second}`;

			rDate = `${vDate}T${vHour}`;
		}
		return rDate;
	}

	pad(num: number, size: number): string {
		let s = num + '';
		while (s.length < size) { s = '0' + s; }
		return s;
	}

	segmentClicked(type, segment){
		
	}

	delete(){
		this.docenteS.deleteDisponibility({
			description: this.user.emplid_moodle,
			institucion: 'UCS',
			date: this.fullday + ' ' + this.virtual.start + ':00',
	  		end: this.fullday + ' ' + this.virtual.end + ':00',
		})
			.then((res) => {
				this.toastr.success('Disponibilidad Eliminada');
				this.events = [];
				this.ngOnInit();
				this.addModal.close();
			});
	}

}