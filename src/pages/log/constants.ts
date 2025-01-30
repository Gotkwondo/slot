import { HeaderInfo } from '@/components/ui/table/type';

const SHOP_HEADER_INFO: HeaderInfo[] = [
  { label: '슬롯ID', value: 'slotId', minWidth: '80px' },
  { label: '로그인ID', value: 'loginId', minWidth: '140px' },
  { label: '구분', value: 'status', minWidth: '100px' },
  { label: '개수', value: 'slotCount', minWidth: '80px' },
  { label: '슬롯타입', value: 'trafficName', minWidth: '140px' },
  { label: '스토어명', value: 'storeName', minWidth: '140px' },
  { label: '키워드', value: 'keyword', minWidth: '100px' },
  { label: 'url', value: 'url', minWidth: '140px' },
  { label: '묶음MID', value: 'groupMid', minWidth: '100px' },
  { label: '단품MID', value: 'productMid', minWidth: '100px' },
  { label: '유입수', value: 'inflow', minWidth: '100px' },
  // { label: '요청일', value: 'workDay', minWidth: '140px' },
  { label: '시작일', value: 'startAt', minWidth: '140px' },
  { label: '종료일', value: 'endAt', minWidth: '140px' },
  { label: '생성자', value: 'slotCreatedBy', minWidth: '140px' },
];

const PLACE_HEADER_INFO: HeaderInfo[] = [
  { label: '슬롯ID', value: 'slotId', minWidth: '80px' },
  { label: '로그인ID', value: 'loginId', minWidth: '140px' },
  { label: '구분', value: 'status', minWidth: '100px' },
  { label: '개수', value: 'slotCount', minWidth: '80px' },
  { label: '슬롯타입', value: 'trafficName', minWidth: '140px' },
  { label: '스토어명', value: 'storeName', minWidth: '140px' },
  { label: '키워드', value: 'keyword', minWidth: '100px' },
  { label: 'url', value: 'url', minWidth: '140px' },
  { label: '플레이스명', value: 'groupMid', minWidth: '140px' },
  { label: '플레이스코드', value: 'productMid', minWidth: '140px' },
  { label: '유입수', value: 'inflow', minWidth: '100px' },
  // { label: '요청일', value: 'workDay', minWidth: '140px' },
  { label: '시작일', value: 'startAt', minWidth: '140px' },
  { label: '종료일', value: 'endAt', minWidth: '140px' },
  { label: '생성자', value: 'slotCreatedBy', minWidth: '140px' },
];

export { SHOP_HEADER_INFO, PLACE_HEADER_INFO };