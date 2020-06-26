export function DownLoadFile(data: any, type: string) {
    let blob = new Blob([data], { type: type});
    let url = window.URL.createObjectURL(blob);
    let pwa = window.open(url);
    if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') return false;
    else return true;
}

export function DownloadFileLink(data, filename){
	var url = window.URL.createObjectURL(data);
	var a = document.createElement('a');
	document.body.appendChild(a);
	a.setAttribute('style', 'display: none');
	a.href = url;
	a.download = filename;
	a.click();
	window.URL.revokeObjectURL(url);
	a.remove();
}