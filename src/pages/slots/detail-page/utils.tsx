import {
  infoDtoType,
  slotDetailInfoType,
  slotInfoDtoType,
  slotRequestType,
  titleConstantsType,
} from '@/pages/slots/detail-page/type';
import { formatDate } from '@/utils/dateCalc';

/**
 * 응답 받은 데이터를 기반으로 {col: 데이터 타입, val: 데이터 값}[] 형식의 배열을 반환
 * 2차원까지의 객체의 깊이는 잡아 1차원 배열의 값을 반환
 * @param data
 * @returns 데이터의 타입과 값의 갖는 객체의 배열
 */
const changeDataPresetToArray = (data: slotInfoDtoType | slotRequestType) => {
  const result = [];
  for (const key in data) {
    if (data[key] instanceof Object) {
      for (const k in data[key]) {
        result.push({ col: k, val: data[key][k] });
      }
    } else if (key === 'requestStatus') {
      result.unshift({ col: key, val: data[key] });
    } else {
      result.push({ col: key, val: data[key] });
    }
  }
  return result;
};

const getMaxColLength = (data: infoDtoType[][]) => {
  if (data.length === 0) return {};
  const lengthData: { [key: string]: number } = {};
  for (const row of data) {
    for (const { col, val } of row) {
      if (lengthData[col])
        lengthData[col] = Math.max(val ? `${val}`.length : 0, lengthData[col]);
      else lengthData[col] = `${val}`.length;
    }
  }
  return lengthData;
};

/**
 * 슬롯 세부 정보에 대한 목록의 tsx 코드의 배열을 생성하는 함수
 * @param data 슬롯의 상세 정보
 * @param type Shopping || Place
 * @param titleConstants => { engTitle: 한국 제목 } 
 */
const generateSlotDetailElement = (
  data: infoDtoType[],
  type: string,
  titleConstants: titleConstantsType
) => {
  const result = [];
  for (let i = 0; i < data.length - 1; i++) {
    result.push(
      <div
        className="flex items-center w-full p-3 border-b-2 h-14"
        key={`slot_detail_info_${type}_${i}`}
      >
        <div className="w-1/5 text-center border-r-2 pr-0.5 min-w-16">
          {
            titleConstants[data[i].col]// 이 부분에 플레이스 텍스트 지정
          }
        </div>
        <div className="w-4/5 pl-4">{data[i].val}</div>
      </div>
    );
  }
  return result;
};

/**
 * 슬롯 요청에 대한 목록의 tsx 코드의 배열을 생성하는 함수
 * @param data 요청할 때 수정 사항에 대한 정보
 * @param type Shopping || Place
 * @param startDate  시작일: 수정 요청 사항에 날짜 데이터가 없어 기존 시작일을 받아 연장일을 계산하기 위한 매개변수
 */
const generateRequestDetailElement = (
  data: infoDtoType[][],
  type: string,
  titleConstants: titleConstantsType
) => {
  const result: { title: JSX.Element[]; info: JSX.Element[][] } = {
    title: [],
    info: [],
  };
  const lengthData = getMaxColLength(data);
  const requestType = data.map((el) => {
    return el.reduce((acc, cur) => {
      if (
        cur.col === 'requestStatus' ||
        cur.col === 'workday' ||
        cur.col === 'startAt'
      ) {
        return { ...acc, [cur.col]: cur.val ? cur.val : '' };
      }
      return acc;
    }, {});
  });

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const temp = [];

    for (let j = 0; j < row.length; j++) {
      if (row[j].col === 'slotId') continue;
      if (i === 0) {
        result.title.push(
          <div
            className="w-full px-3 py-2 text-center border-b min-w-40"
            style={{
              width: `${lengthData[row[j].col] > 0 ? lengthData[row[j].col] : '10'}rem`,
            }}
            key={`slot_detail_request_${type}_${i}_${j}_title`}
          >
            {titleConstants[row[j].col]}
          </div>
        );
      }

      if (row[j].col === 'endAt') {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-expect-error
        const endDate = new Date(row[j].val);

        // 초기 날짜 출력
        let formattedDate = formatDate(endDate);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-expect-error
        endDate.setDate(endDate.getDate() + requestType[i].workday ? requestType[i].workday : 0);
        // 갱신된 날짜 출력
        formattedDate = formatDate(endDate);
        temp.push(
          <div
            className="w-full px-3 py-2 text-center border-b min-w-40"
            style={{
              width: `${lengthData[row[j].col] > 0 ? lengthData[row[j].col] : '10'}rem`,
            }}
            key={`slot_detail_request_${type}_${i}_${j}_info`}
          >
            {`${formattedDate}`}
          </div>
        );
      } else {
        temp.push(
          <div
            className="w-full px-3 py-2 text-center border-b min-w-40"
            style={{
              width: `${lengthData[row[j].col] > 0 ? lengthData[row[j].col] : '10'}rem`,
            }}
            key={`slot_detail_request_${type}_${i}_${j}_info`}
          >
            {row[j].val}
          </div>
        );
      }
    }
    result.info.push(temp);
  }
  return result;
};

/**
 * 슬롯 요청에 대한 상세 정보와 요청 정보의 tsx 코드를 생성한 정보를 종합하여 반환
 * @param slotInfo 특정 슬롯(id를 통해 전달 받은) 정보
 * @param dataType shopping || place
 * @returns result: {
    dtoElement: JSX.Element[],
    slotRequests: {
      title: JSX.Element[],
      info: JSX.Element[],
    }
  }
 */
const generateSlotDetailTsxCode = (
  slotInfo: slotDetailInfoType,
  dataType: string,
  titleConstants: titleConstantsType
) => {
  if (!slotInfo) return;
  const infoDto = changeDataPresetToArray(slotInfo.slotInfoDto);
  const requestInfo = slotInfo.slotRequests.map((request) =>
    changeDataPresetToArray(request)
  );
  const result: {
    dtoElement: JSX.Element[];
    slotRequests: {
      title: JSX.Element[];
      info: JSX.Element[][];
    };
  } = {
    dtoElement: [],
    slotRequests: {
      title: [],
      info: [],
    },
  };

  if (infoDto) {
    result['dtoElement'] = generateSlotDetailElement(
      infoDto,
      dataType,
      titleConstants
    );
  }
  if (requestInfo) {
    result['slotRequests'] = generateRequestDetailElement(
      requestInfo.map((e) => [
        ...e,
        { col: 'startAt', val: slotInfo.slotInfoDto.startAt },
        { col: 'endAt', val: slotInfo.slotInfoDto.endAt },
      ]),
      dataType,
      titleConstants
    );
  }

  return result;
};

export { generateSlotDetailTsxCode };
