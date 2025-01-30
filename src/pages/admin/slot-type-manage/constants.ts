import { HeaderInfo } from '@/components/ui/table/type';

const HEADER_INFO: HeaderInfo[] = [
  { label: '타입', value: 'trafficName', minWidth: '100px' },
  { label: '총 수량', value: 'totalQuantity', minWidth: '100px' },
  { label: '남은 수량', value: 'remainQuantity', minWidth: '100px' },
  { label: '시작시간', value: 'startAt', minWidth: '100px' },
  { label: '종료시간', value: 'endAt', minWidth: '100px' },
  { label: '슬롯상태', value: 'trafficStatus', minWidth: '100px' },
  { label: '수정', value: 'edit', minWidth: '70px' },
  { label: '삭제', value: 'delete', minWidth: '70px' },
];

export { HEADER_INFO };
