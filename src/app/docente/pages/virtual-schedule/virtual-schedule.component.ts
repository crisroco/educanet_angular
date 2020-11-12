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
    viewDate: Date = new Date();
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
    public selectedCampus = '';
    public selectedGrado = '';
    public fullday;
    public virtual = {
    	start: '',
    	end: ''
    }
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
  	this.docenteS.getVirtualSchedule(this.user.emplid_moodle)
  		.then((res) => {
  			this.allClasses = res['data'];
  			this.closeOpenMonthViewDay();
  			this.docenteS.getCampus()
  				.then((res) => {
  					this.allCampus = res['data'];
  					this.docenteS.getgrado()
  						.then((res) => {
  							this.allGrados = res['data'];
  						});
  				});
  		});
  }

  eventClicked(evt, modal){
  	console.log(evt);
  	let daySelected = evt.start.getFullYear() + '-' + (evt.start.getMonth() + 1) + '-' + evt.start.getDate();
  	this.fullday = daySelected;
  	var minutesS = (evt.start.getMinutes() < 10 ? '0' : '') + evt.start.getMinutes();
	var hourS = (evt.start.getHours() < 10 ? '0' : '') + evt.start.getHours();
	var minutesE = (evt.end.getMinutes() < 10 ? '0' : '') + evt.end.getMinutes();
	var hourE = (evt.end.getHours() < 10 ? '0' : '') + evt.end.getHours();
  	this.virtual.start = hourS + ':' + minutesS;
  	this.virtual.end = hourE + ':' + minutesE;
  	this.updating = true;
  	this.selectedGrado = evt.meta.grado;
  	this.selectedDisponibility = evt.meta;
  	this.selectedCampus = evt.meta.campus;
	this.addModal.open();
  }

  hourSegmentClicked(evt){
  	this.selectedDay = this.days[new Date(evt.date).getDay()];
  	this.addedDate(evt.date);
  }

  addedDate(date){
  	console.log(date);
  	let daySelected = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
  	this.fullday = daySelected;
  	var seconds = date.getSeconds();
	var minutes = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
	var hour = (date.getHours() < 10 ? '0' : '') + date.getHours();
	this.virtual.start = hour + ':' + minutes;
	this.updating = false;
	this.selectedDisponibility = '';
	this.selectedGrado = '';
	this.selectedCampus = '';
	this.addModal.open();
  }

  save(){
  	if (this.updating) {
  		let data = {
  			id: this.selectedDisponibility.id,
	  		institucion: "UCS",
	  		grado: this.selectedGrado,
	  		campus: this.selectedCampus,
	  		title: "x",
	  		description: this.user.emplid_moodle,
	  		profesor: this.user.name,
	  		oprid: "PEOPLE",
	  		date: this.fullday + ' ' + this.virtual.start + ':00',
	  		end: this.fullday + ' ' + this.virtual.end + ':00',
	  		lvf_cod_empl: null,
	  		fecha_reg: new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate(),
	  		proceso: 1
	  	}
	  	this.docenteS.updateDisponibility(data).then((res) => {
	  		this.ngOnInit();
	  		this.toastr.success('Disponibilidad Actualizada');
	  		this.addModal.close();
	  	});
  	} else {
  		let data = {
	  		institucion: "UCS",
	  		grado: this.selectedGrado,
	  		campus: this.selectedCampus,
	  		title: "x",
	  		description: this.user.emplid_moodle,
	  		profesor: this.user.name,
	  		oprid: "PEOPLE",
	  		date: this.fullday + ' ' + this.virtual.start + ':00',
	  		end: this.fullday + ' ' + this.virtual.end + ':00',
	  		lvf_cod_empl: null,
	  		fecha_reg: new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate(),
	  		proceso: 1
	  	}
	  	this.docenteS.saveDisponibility(data).then((res) => {
	  		this.ngOnInit();
	  		this.toastr.success('Disponibilidad Creada');
	  		this.addModal.close();
	  	});
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
				console.log(myclase);
				if(!objEvents[rDay + ' ' + fullHour(RealDate(new Date(myclase.date))) + ' ' + myclase.description]){
					dates = this.getDates(rDay, fullHour(RealDate(new Date(myclase.date))), fullHour(RealDate(new Date(myclase.end))));
					events.push({
						start: dates.start,//new Date(rDay + ' ' + classD.MEETING_TIME_START),
						end: dates.end,//new Date(rDay + ' ' + classD.MEETING_TIME_END),
						title: fullHour(RealDate(new Date(myclase.date))) + '-' + fullHour(RealDate(new Date(myclase.end))) + '<br>' + myclase.grado,
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
		this.docenteS.deleteDisponibility({id: this.selectedDisponibility.id, institucion: 'UCS'})
			.then((res) => {
				this.toastr.error('Disponibilidad Eliminada');
			});
	}

}