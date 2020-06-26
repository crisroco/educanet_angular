export function UpperFirstLetter(txt){
	if(txt==undefined) return '';
	var arr = txt.split(' ');
	var concat = '';
	arr.filter(function(el, index){
		concat += el.charAt(0).toUpperCase() + el.slice(1).toLowerCase()+' ';
	});
	return concat
}