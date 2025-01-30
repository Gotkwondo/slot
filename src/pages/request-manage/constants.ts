import { HeaderInfo } from '@/components/ui/table/type';

const HEADER_INFO: HeaderInfo[] = [
  { label: '슬롯ID', value: 'slotId', minWidth: '80px' },
  { label: '로그인ID', value: 'ownerId', minWidth: '140px' },
  { label: '구분', value: 'requestStatus', minWidth: '120px' },
  { label: '슬롯타입', value: 'trafficName', minWidth: '140px' },
  { label: '개수', value: 'slotCount', minWidth: '80px' },
  { label: '기간', value: 'requestWorkDay', minWidth: '100px' },
  { label: '스토어명', value: 'storeName', minWidth: '140px' },
  { label: '키워드', value: 'keyword', minWidth: '100px' },
  { label: 'url', value: 'url', minWidth: '200px' },
  { label: '묶음MID', value: 'item4', minWidth: '100px' },
  { label: '단품MID', value: 'item5', minWidth: '100px' },
  { label: '유입수', value: 'inflow', minWidth: '100px' },
  { label: '생성자', value: 'creatorId', minWidth: '140px' },
  { label: '요청일', value: 'requestDate', minWidth: '140px' },
];

const PLACE_HEADER_INFO: HeaderInfo[] = [
  { label: '슬롯ID', value: 'slotId', minWidth: '80px' },
  { label: '로그인ID', value: 'ownerId', minWidth: '140px' },
  { label: '구분', value: 'requestStatus', minWidth: '120px' },
  { label: '슬롯타입', value: 'trafficName', minWidth: '140px' },
  { label: '개수', value: 'slotCount', minWidth: '80px' },
  { label: '기간', value: 'requestWorkDay', minWidth: '100px' },
  { label: '스토어명', value: 'storeName', minWidth: '140px' },
  { label: '키워드', value: 'keyword', minWidth: '100px' },
  { label: 'url', value: 'url', minWidth: '200px' },
  { label: '플레이스명', value: 'item4', minWidth: '140px' },
  { label: '플레이스코드', value: 'item5', minWidth: '140px' },
  { label: '유입수', value: 'inflow', minWidth: '100px' },
  { label: '생성자', value: 'creatorId', minWidth: '140px' },
  { label: '요청일', value: 'requestDate', minWidth: '140px' },
];

export { HEADER_INFO, PLACE_HEADER_INFO };