import { tableDataType } from '@/components/ui/ChartTable/types';

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

/**
 * 원본 데이터와 수정된 데이터를 비교하여 체크된 컬럼 데이터를 API Request 형식의 데이터로 반환
 * @param originDatas API를 통해 받아온 원본 데이터
 * @param editedDatas 수정된 State의 데이터
 * @returns [
    {
      "slotId": number,
      "slotDataDto": {
        "storeName": string,
        "keyword": string,
        "url": string,
        "item4": string,
        "item5": string
      }
    }
  ]
 */
const checkDifferentData = (
  originDatas: tableDataType[],
  editedDatas: tableDataType[]
) => {
  const result = [];
  for (let i = 0; i < originDatas.length; i++) {
    if (editedDatas[i][0].type === 'checkbox' && !editedDatas[i][0].val)
      continue;
    const differentCheck: { [key: string]: number | boolean | string | null } =
      { slotId: editedDatas[i][1].val };
    const dataArr = {};
    for (let j = 3; j < editedDatas[i].length; j++) {
      if (editedDatas[i][j].type !== 'input') continue;
      else
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-expect-error
        dataArr[editedDatas[i][j].col] = editedDatas[i][j].val
          ? editedDatas[i][j].val
          : ('' as string);
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    differentCheck['slotDataDto'] = dataArr;
    result.push(differentCheck);
  }
  return result;
};

export { getMaxTextLength, checkDifferentData };
