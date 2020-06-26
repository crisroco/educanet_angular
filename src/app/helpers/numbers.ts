export function Rounded(number, decimals){
	var str = Math.round(number * Math.pow(10.0, decimals)) + '';
	return str.substring(0, str.length - 2) + '.' + str.substring(str.length - 2, str.length);
}