import * as Excel from 'exceljs';
import { saveAs } from 'file-saver';
import { ChangeEvent } from 'react';
import { toast } from 'react-toastify';
import { getCookieValue } from './cookie';

type excelDownloadType = {
  fileName: string;
  headerInfo: string[];
  bodyInfo: string[][];
};

type registrationRowType = {
  "slotName": string;
  "storeName": string;
  "keyword": string;
  "url": string;
  "item4": string;
  "item5": string;
  "startAt": string;
  "workDays": string;
  "inflows": string
};

const EXCEL_UPLOAD_TYPE = {
  "슬롯명": 'slotName',
  "시작일": 'startAt',
  "기간": 'workDays',
  "스토어명": 'storeName',
  "키워드": 'keyword',
  "url": 'url',
  "묶음MID": 'item4',
  "단품MID": 'item5',
  "유입수": 'inflows',
  "플레이스명": 'item4',
  "플레이스코드": 'item5',
};

// 헤더 부분 스타일
const styleHeaderCell = (cell: Excel.Cell) => {
  cell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'ffa4ffa4' },
  };
  cell.border = {
    bottom: { style: 'thin', color: { argb: '-100000f' } },
    right: { style: 'thin', color: { argb: '-100000f' } },
  };
  cell.font = {
    name: 'Arial',
    size: 12,
    bold: true,
    color: { argb: 'ff252525' },
  };
  cell.alignment = {
    vertical: 'middle',
    horizontal: 'center',
    wrapText: true,
  };
};

// 바디 부분 스타일
const styleDataCell = (cell: Excel.Cell) => {
  cell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'ffffffff' },
  };
  cell.border = {
    bottom: { style: 'thin', color: { argb: '-100000f' } },
    right: { style: 'thin', color: { argb: '-100000f' } },
  };
  cell.font = {
    name: 'Arial',
    size: 10,
    color: { argb: 'ff252525' },
  };
  cell.alignment = {
    vertical: 'middle',
    horizontal: 'center',
    wrapText: true,
  };
};

const excelDownload = async ({
  fileName,
  headerInfo,
  bodyInfo,
}: excelDownloadType) => {
  try {
    const workBook = new Excel.Workbook();
    const sheet = workBook.addWorksheet(fileName);

    // 상단 헤더(TH) 추가
    const headerRow = sheet.addRow(headerInfo);
    // 헤더의 높이값 지정
    headerRow.height = 30.75;
    // 각 헤더 cell에 스타일 지정
    headerRow.eachCell((cell: Excel.Cell, colNum: number) => {
      styleHeaderCell(cell);
      sheet.getColumn(colNum).width = 30;
    });

    for (let body of bodyInfo!) {
      const rowData = [];
      for (let val of body) {
        rowData.push(!isNaN(Number(val)) ? +val : val);
      }
      const appendRow = sheet.addRow(rowData);

      appendRow.eachCell((cell: Excel.Cell) => styleDataCell(cell));
    }

    // 파일 생성
    const fileData = await workBook.xlsx.writeBuffer(); // Promise를 반환하기에 비동기 필수
    const blob = new Blob([fileData], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(blob, fileName);
  } catch (e) {
    toast.error('다운로드에 실패했습니다.');
    console.log(e);
  }
};

const downloadExcelFormat = async (trafficType: 'SHOP' | 'PLACE') => {
  try {
    const workBook = new Excel.Workbook();
    const fileName = '양식)_쇼핑과_플레이스_동일합니다';
    const sheet = workBook.addWorksheet(fileName);
    const headerInfo = [
      '슬롯명',
      '시작일',
      '종료일',
      '기간',
      '스토어명',
      '키워드',
      'url',
      `${trafficType === 'SHOP' ? '묶음MID' : '플레이스명'}`,
      `${trafficType === 'SHOP' ? '단품MID' : '플레이스코드'}`,
      '유입수'
    ];

    // 상단 헤더(TH) 추가
    const headerRow = sheet.addRow(headerInfo);
    // 헤더의 높이값 지정
    headerRow.height = 30.75;
    // 각 헤더 cell에 스타일 지정
    headerRow.eachCell((cell: Excel.Cell, colNum: number) => {
      styleHeaderCell(cell);
      sheet.getColumn(colNum).width = 30;
    });
    // for (let body of bodyInfo!) {
    //   const rowData = [];
    //   for (let val of body) {
    //     rowData.push(!isNaN(Number(val)) ? +val : val);
    //   }
    //   const appendRow = sheet.addRow(rowData);

    //   appendRow.eachCell((cell: Excel.Cell) => styleDataCell(cell));
    // }

    // 파일 생성
    const fileData = await workBook.xlsx.writeBuffer(); // Promise를 반환하기에 비동기 필수
    const blob = new Blob([fileData], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(blob, fileName);
  } catch (e) {
    toast.error('다운로드에 실패했습니다.');
    console.log(e);
  }
};

const requestSlotRegistration = async (
  rows: registrationRowType[],
  trafficType: 'SHOP' | 'PLACE'
) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const authorization = getCookieValue('Authorization');

  if (!authorization) {
    toast.error('로그인이 만료되었습니다.');
    return;
  }
  try {
    const response = await fetch(`${apiUrl}/slots/${trafficType}/excel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authorization,
      },
      body: JSON.stringify({
        rows: rows,
      }),
    });
    if (response.status === 400) {
      toast.error(`등록에 실패했습니다. 에러코드: ${response.status}`);
      return;
    } else if (response.status === 401) {
      toast.error(`로그인이 만료되었습니다. 에러코드: ${response.status}`);
      return;
    } else if (!response.ok) {
      const errorData = await response.json();
      toast.error(
        `슬롯 추가 요청이 실패하였습니다 (${errorData.errorData.errorMessage})`
      );
      return null;
    }
    toast.success('등록되었습니다.');
  } catch (error) {
    toast.error('등록에 실패했습니다.');
    console.log(error);
  }
};

const fileInputSubmit = (
  event: ChangeEvent<HTMLInputElement>,
  trafficType: 'SHOP' | 'PLACE'
) => {
  const targetFile = event.target.files?.[0];
  const jsonAry: { [key: string]: string }[] = [];
  if (!targetFile) return;

  const reader = new FileReader();
  reader.onload = async (e: ProgressEvent<FileReader>) => {
    if (!e.target) {
      toast.error('파일을 선택해주세요.');
      return;
    }
    const aryBuffer = e.target.result;
    const workbook = new Excel.Workbook();
    if (!(aryBuffer instanceof ArrayBuffer)) {
      toast.error('유효하지 않은 파일 형식입니다.');
      return;
    }
    try {
      await workbook.xlsx.load(aryBuffer);
      const headers: string[] = [];
      const data: string[][] = [];
      workbook.worksheets.forEach((worksheet: Excel.Worksheet) => {
        let isFirstRow = true;
        worksheet.eachRow({ includeEmpty: true }, (row: Excel.Row) => {
          const rowValues = row.values;
          if (!rowValues || !(rowValues instanceof Array)) return;

          if (isFirstRow) {
            const filteredHeaders = rowValues.filter(
              (value: Excel.CellValue) =>
                value !== null && value !== undefined
            );
            for (let header of filteredHeaders) {
              headers.push(`${header}`);
            }
            isFirstRow = false;
          } else {
            const processedRow = rowValues.slice(1).map((value: Excel.CellValue) => {
              if (value instanceof Date) {
                return value.toISOString().split('T')[0];
              }
              else if (
                typeof value === "object" &&
                value !== null &&
                "hyperlink" in value &&
                "text" in value
              ) {
                return `${value.text}`;
              }
              else if (
                typeof value === "object" &&
                value !== null &&
                "formula" in value &&
                "result" in value
              ) {
                return `${value.result}`;
              }
              else return `${value}`;
            });

            if (processedRow.length !== headers.length) return;
            else data.push(processedRow);
          }
        });
      });
      for (let idx = 0; idx < data.length; idx++) {
        const colData = data[idx];
        const colPreset: { [key: string]: string } = {};
        for (let i = 0; i < colData.length; i++) {
          if(i === 2) continue; // 종료일을 제외한 데이터 수집
          colPreset[EXCEL_UPLOAD_TYPE[headers[i] as keyof typeof EXCEL_UPLOAD_TYPE]] = `${colData[i] ?? ''}`;
        }
        jsonAry.push(colPreset)
      }
      
      await requestSlotRegistration(
        jsonAry as registrationRowType[],
        trafficType
      );
    } catch (error) {
      toast.error('엑셀 업로드 중 에러가 발생했습니다.')
      console.log(error)
    }
  };
  reader.readAsArrayBuffer(targetFile);
};

export { excelDownload, downloadExcelFormat, fileInputSubmit };
