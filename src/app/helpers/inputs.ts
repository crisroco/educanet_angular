export function OnlyNumbers(evt) {
  var theEvent = evt || window.event;
  if (theEvent.type === 'paste') {
      key = evt.clipboardData.getData('text/plain');
  } else {
      var key = theEvent.keyCode || theEvent.which;
      key = String.fromCharCode(key);
  }
  var regex = /[0-9]|\./;
  if( !regex.test(key) ) {
    theEvent.returnValue = false;
    if(theEvent.preventDefault) theEvent.preventDefault();
  }
}

export function MinMaxNumber(evt, number, min, max){
  var theEvent = evt || window.event;
  if(theEvent.target.value < min) { theEvent.target.value = min; number = min}
  else if(theEvent.target.value > max) { theEvent.target.value = max; number = max}
  else if(theEvent.target.value == '') { theEvent.target.value = min; number = min}
  return number;
}

export function MaxLengthString(evt, str, max){
  var theEvent = evt || window.event;
  if( theEvent.target.value.length >= max ) { theEvent.target.value = theEvent.target.value.substring(0, max); str.substring(0, max); }
  return str;
}

export function UpperCase(evt, str){
  var theEvent = evt || window.event;
  theEvent.target.value = theEvent.target.value.toUpperCase();
  return str.toUpperCase();
}