import { tableDataType } from '@/components/ui/ChartTable/types';
import { slotDataType } from '@/pages/slots/naver-shopping/types';

/**
 * 해당 데이터가 input필드로 렌더링 되는지 확인
 * @param type: string
 * @returns boolean
 */
const checkInput = (type: string) => {
  if (
    type === 'storeName' ||
    type === 'keyword' ||
    type === 'url' ||
    type === 'item4' ||
    type === 'item5'
  ) {
    return true;
  } else return false;
};

/**
 * 테이블 컬럼의 데이터 타입에 맞게 변환한뒤 한 줄의 데이터를 생성
 * @param colData: slotDataType
 * @returns 한줄에 들어가는 데이터 배열
 */
const generateColumn = (colData: slotDataType) => {
  const keys = Object.keys(colData);
  const col = [];
  // 이 부분에서 keys.length - 1을 한 이유는 API를 통해 들어오는 데이터의 마지막은
  // inOperation이라는 정보인데, 해당 페이지에서는 사용하지 않기 때문입니다.
  for (let i = 0; i < keys.length; i++) {
    // 요청수 필드 삭제
    if (keys[i] === 'requestSlotCounts') continue;
    col.push({
      type: checkInput(keys[i]) ? 'input' : 'text',
      col: keys[i],
      val: colData[keys[i]],
      len: `${colData[keys[i]]}`.length,
    });
  }
  return col;
};

const changeSlotData = (slotDatas: slotDataType[]) => {
  const newData = Array.from({ length: slotDatas.length }, (_, idx) => [
    ...generateColumn(slotDatas[idx]),
  ]);
  return newData as tableDataType[];
};

const getMaxTextLength = (datas: tableDataType[]) => {
  let maxLength = 0;

  for (const data of datas) {
    for (const row of data) {
      if (row.type !== 'input' || typeof row.len !== 'number' || !row.len)
        continue;

      if (maxLength < row.len) maxLength = row.len;
    }
  }
  return maxLength;
};

export { changeSlotData, getMaxTextLength };
