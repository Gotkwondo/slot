const STATE_INFO = [
  { value: '', label: '전체' },
  { value: 'ACTIVE', label: '사용중' },
  { value: 'DONE', label: '사용종료' },
];

const INITIAL_MODAL_ACCEPT_BTN_INFO = {
  edit: [
    { col: '스토어명', val: '', type: 'storeName' },
    { col: '키워드', val: '', type: 'keyword' },
    { col: 'url', val: '', type: 'url' },
    { col: '묶음 MID', val: '', type: 'item4' },
    { col: '단품 MID', val: '', type: 'item5' },
  ],
  delay: [{ col: '연장 기간', val: '', type: 'delayDate' }],
};

const SHOPPING_TABLE_TYPES = [
  { type: 'text', val: 'slotId', text: '번호' },
  { type: 'text', val: 'status', text: '상태' },
  { type: 'text', val: 'loginId', text: '아이디' },
  { type: 'text', val: 'trafficName', text: '슬롯명' },
  { type: 'text', val: 'inflow', text: '유입수' },
  { type: 'text', val: 'startAt', text: '시작일' },
  { type: 'text', val: 'endAt', text: '종료일' },
  { type: 'text', val: 'creatorName', text: '생성자' },
];

export { STATE_INFO, INITIAL_MODAL_ACCEPT_BTN_INFO, SHOPPING_TABLE_TYPES };
