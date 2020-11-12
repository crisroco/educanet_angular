import { AppSettings } from '../app.settings';

export function RealDate(d = null){
	var real = {
		year: '',
		month: '',
		day: '',
		hour: '',
		minute: '',
		second: '',
		nday: '',
		nmonth: ''
	};
	var date = d?d:(new Date());
	real.year = date.getFullYear() + '';
	var month = date.getMonth() + 1;
	real.month = (month < 10? '0':'') + month;
	var day = date.getDate();
	real.day = (day < 10? '0':'') + day;
	var hour = date.getHours();
	real.hour = (hour < 10? '0':'') + hour;
	var minute = date.getMinutes();
	real.minute = (minute < 10? '0':'') + minute;
	var second = date.getSeconds();
	real.second = (second < 10? '0':'') + second;
	real.nday = AppSettings.NAMES_DAYS[date.getDay()];
	real.nmonth = AppSettings.NAMES_MONTH[month - 1];
	return real;
}

export function GetFirstDayWeek(d) {
	d = new Date(d);
	var day = d.getDay(),
	diff = d.getDate() - day + (day == 0 ? -6:1);
	return new Date(d.setDate(diff));
}

export function GetLastDayWeek(d) {
	d = new Date(d);
	var day = d.getDay(),
	diff = d.getDate() + (day?(6 - (day - 1)):0);
	return new Date(d.setDate(diff));
}

export function AddDay(d, numDay){
	d = new Date(d);
	var diff = d.getDate() + numDay;
	return new Date(d.setDate(diff));
}

export function SubstractDay(d, numDay){
	d = new Date(d);
	var diff = d.getDate() - numDay;
	return new Date(d.setDate(diff));
}

export function SameDay(stDate, day){
	var sDay = day.year + '-' + day.month + '-' + day.day;
	if(sDay == stDate) return true;
	else return false;
}

export function SameDay2(stDate, day){
	var sDay = day.year + '-' + day.month + '-' + day.day;
	var sDay2 = stDate.year + '-' + stDate.month + '-' + stDate.day;
	if(sDay == sDay2) return true;
	else return false;
}

export function fullHour(stDate){
	var sDay = stDate.hour + ':' + stDate.minute + ':' + stDate.second;
	return sDay;
}