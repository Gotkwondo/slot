import { SelectInfo } from '@/components/ui/select.type';
import { HeaderInfo } from '@/components/ui/table/type';
import { MemberPermission } from '@/hooks/store/loginStore';

// TODO: 만약 API에 따라 달라진다면 constants -> 로직으로 이동
const HEADER_INFO: HeaderInfo[] = [
  { label: 'id', value: 'loginId', minWidth: '140px' },
  { label: '비밀번호', value: 'password', minWidth: '140px' },
  { label: '권한', value: 'permission', minWidth: '80px' },
  { label: '생성자', value: 'createdBy', minWidth: '140px' },
  { label: '생성일', value: 'createdAt', minWidth: '140px' },
  { label: '슬롯', value: 'shopSlotCounts', minWidth: '80px' },
  { label: '슬롯추가', value: 'addSlot', minWidth: '100px' },
  { label: '메모', value: 'memo', minWidth: '70px' },
  { label: '수정', value: 'edit', minWidth: '100px' },
];

const USER_PERMISSION: Record<MemberPermission, SelectInfo[]> = {
  MASTER: [
    { value: 'MANAGER', label: '총판' },
    { value: 'AGENCY', label: '대행' },
    { value: 'SELLER', label: '셀러' },
  ],
  MANAGER: [
    { value: 'AGENCY', label: '대행' },
    { value: 'SELLER', label: '셀러' },
  ],
  AGENCY: [{ value: 'SELLER', label: '셀러' }],
  SELLER: [],
  '': [],
};

const PERMISSION_LABEL = {
  마스터: 'MASTER',
  총판: 'MANAGER',
  대행: 'AGENCY',
  셀러: 'SELLER',
};

export { HEADER_INFO, USER_PERMISSION, PERMISSION_LABEL };
