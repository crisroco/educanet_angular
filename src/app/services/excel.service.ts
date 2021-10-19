import { Injectable } from '@angular/core';
import * as Excel from "exceljs/dist/exceljs.min.js";
import * as ExcelProper from "exceljs";
import * as fs from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {
  constructor() { }
  generateExcel(headers, data){
  	// Create workbook and worksheet
	let workbook:ExcelProper.Workbook = new Excel.Workbook();
	let worksheet = workbook.addWorksheet('reporte_desempeno_docente');
	

	worksheet.mergeCells('A1', 'E1');
	worksheet.getCell('A1').value = 'EVALUACIÓN DE DESEMPEÑO DOCENTE TOTAL (SEMESTRE ACADÉMICO - PERÍODO) (LA CALIFICACIÓN DE "NO APLICA" EQUIVALE A SIN INFORMACIÓN O QUE NO LE CORRESPONDE)'	
	worksheet.getCell('A1').font = {
		name: 'Dosis',
		color: { argb: 'FFFFFFFF' },
		family: 2,
		size: 12,
		bold: true,
	  };

	worksheet.getCell('A1').fill = {
		type: 'pattern',
		pattern:'solid',
		fgColor:{argb:'568EBF'},
		bgColor:{argb:'FF0000FF'}
	};
	worksheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' };

	worksheet.mergeCells('F1', 'I1');
	worksheet.getCell('F1').value = 'ENCUESTA (35%)'

	worksheet.getCell('F1').font = {
		name: 'Dosis',
		color: { argb: 'FFFFFFFF' },
		family: 2,
		size: 12,
		bold: true,
	  };

	worksheet.getCell('F1').fill = {
		type: 'pattern',
		pattern:'solid',
		fgColor:{argb:'F5E306'},
		bgColor:{argb:'FF0000FF'}
	};
	worksheet.getCell('F1').alignment = { vertical: 'middle', horizontal: 'center' };

	worksheet.mergeCells('J1', 'L1');
	worksheet.getCell('J1').value = 'EVALUACIÓN DE CLASE (35%)'

	worksheet.getCell('J1').font = {
		name: 'Dosis',
		color: { argb: 'FFFFFFFF' },
		family: 2,
		size: 12,
		bold: true,
	  };

	worksheet.getCell('J1').fill = {
		type: 'pattern',
		pattern:'solid',
		fgColor:{argb:'F26E22'},
		bgColor:{argb:'FF0000FF'}
	};
	worksheet.getCell('J1').alignment = { vertical: 'middle', horizontal: 'center' };

	worksheet.mergeCells('M1', 'R1');
	worksheet.getCell('M1').value = 'DESARROLLO Y CAPACITACIÓN (MIN. 08 HORAS ) 20%'

	worksheet.getCell('M1').font = {
		name: 'Dosis',
		color: { argb: 'FFFFFFFF' },
		family: 2,
		size: 12,
		bold: true,
	  };

	worksheet.getCell('M1').fill = {
		type: 'pattern',
		pattern:'solid',
		fgColor:{argb:'BD26A1'},
		bgColor:{argb:'FF0000FF'}
	};
	worksheet.getCell('M1').alignment = { vertical: 'middle', horizontal: 'center' };

	worksheet.mergeCells('S1', 'AA1');
	worksheet.getCell('S1').value = 'COMPROMISO DOCENTE (10%)'

	worksheet.getCell('S1').font = {
		name: 'Dosis',
		color: { argb: 'FFFFFFFF' },
		family: 2,
		size: 12,
		bold: true,
	  };

	worksheet.getCell('S1').fill = {
		type: 'pattern',
		pattern:'solid',
		fgColor:{argb:'0468BF'},
		bgColor:{argb:'FF0000FF'}
	};
	worksheet.getCell('S1').alignment = { vertical: 'middle', horizontal: 'center' };

	worksheet.mergeCells('AB1', 'AF1');
	worksheet.getCell('AB1').value = 'RESULTADO FINAL (>01 DESAP=DESAPROBADO)'

	worksheet.getCell('AB1').font = {
		name: 'Dosis',
		color: { argb: 'FFFFFFFF' },
		family: 2,
		size: 12,
		bold: true,
	  };

	worksheet.getCell('AB1').fill = {
		type: 'pattern',
		pattern:'solid',
		fgColor:{argb:'71BF65'},
		bgColor:{argb:'FF0000FF'}
	};
	worksheet.getCell('AB1').alignment = { vertical: 'middle', horizontal: 'center' };

	//titleRow.font = {name: 'Dosis', size: 16, bold: true};

	//Add Header Row
	let headerRow = worksheet.addRow(headers);
	let row;
	headerRow.eachCell((cell, number) => {
		cell.fill = {
			type: 'pattern',
			pattern: 'solid',
			fgColor: { argb: 'FF1F2D4F'},
			bgColor: { argb: 'FFffc000'}
		};
		cell.border = { top: {style: 'thin'}, left: {style: 'thin'}, bottom: {style: 'thin'}, right: { style: 'thin'} };
		cell.font = { color: { argb: 'FFFFFFFF'}};
	})

	data.forEach(d => {
		row = worksheet.addRow(d);
	});
    worksheet.properties.defaultColWidth = 35;
    worksheet.properties.defaultRowHeight = 20;
	//Generate Excel File
	workbook.xlsx.writeBuffer()
		.then((data:any) => {
			let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
			fs.saveAs(blob, 'reporte_desempeno_docente' + '.xlsx');
		});
  }
}