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
	diff = d.getDate() + 6 - (day - 1);
	return new Date(d.setDate(diff));
}