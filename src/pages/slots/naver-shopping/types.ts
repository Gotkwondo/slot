
export type selectType = {
  value: string;
  label: string;
};

export type slotDataType = {
  slotId: number;  // 슬롯ID
  status: string; // 상태
  loginId: string;  // 사용자 로그인 아이디 => 권한별 접근 데이터 로직에 필요
  trafficName: string;  // 슬롯 명
  storeName: string | null; // 상점명
  keyword: string | null; // 키워드
  url: string | null; // URL
  item4: string | null; // 묶음MID
  item5: string | null; // 단품MID
  inflow: string; // 유입량
  startAt: string;  // 시작일
  endAt: string;  // 마감일
  creatorName: string;  // 생성자
  inOperation: true;  // 이건 뭔지 모름
  [key: string]: number | string | null | boolean;
};

// export type 