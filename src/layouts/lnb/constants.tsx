import { GrMoney, GrUserAdmin } from 'react-icons/gr';
import { MdOutlinePlace, MdOutlineShoppingBag } from 'react-icons/md';
import { AiFillNotification } from 'react-icons/ai';
import { MenuInfo, MenuInfoChildren } from './type';

const ROUTER_MAP = {
  'naver-shopping-slots': 'naver-shopping-slots',
  'naver-place-slots': 'naver-place-slots',
  'naver-shopping-users': 'naver-shopping-users',
  'naver-place-users': 'naver-place-users',
  'naver-shopping-log-slots': 'naver-shopping-log-slots',
  'naver-place-log-slots': 'naver-place-log-slots',
  'slot-type-manage': 'slot-type-manage',
  'table-header-manage': 'table-header-manage',
  'naver-shopping-request-manage': 'naver-shopping-request-manage',
  'naver-place-request-manage': 'naver-place-request-manage',
  'settlement-manage': 'settlement-manage',
  notice: 'notice',
};

// 유저 권한 별 MENU 리스트
// 순서또한 변경 가능
const MASTER_MENU: MenuInfo[] = [
  'slot',
  'user',
  'requestManage',
  'log',
  'notice',
  'admin',
  'settlement',
];
const MANAGER_MENU: MenuInfo[] = [
  'slot',
  'user',
  'log',
  'notice',
  'settlement',
];
const AGENCY_MENU: MenuInfo[] = ['slot', 'user', 'log', 'notice', 'settlement'];
const SELLER_MENU: MenuInfo[] = ['slot', 'user', 'log', 'notice', 'settlement'];

const PERMISSION_MENU_MAP = {
  MASTER: MASTER_MENU,
  MANAGER: MANAGER_MENU,
  AGENCY: AGENCY_MENU,
  SELLER: SELLER_MENU,
};

const MENU_INFO: Record<
  MenuInfo,
  {
    title: string;
    children: MenuInfoChildren[];
  }
> = {
  slot: {
    title: '슬롯',
    children: [
      {
        title: '네이버 쇼핑',
        icon: <MdOutlineShoppingBag size="20px" />,
        url: ROUTER_MAP['naver-shopping-slots'],
        trafficTypes: ['SHOP'],
      },
      {
        title: '네이버 플레이스',
        icon: <MdOutlinePlace size="20px" />,
        url: ROUTER_MAP['naver-place-slots'],
        trafficTypes: ['PLACE'],
      },
    ],
  },
  user: {
    title: '유저',
    children: [
      {
        title: '네이버 쇼핑 유저',
        icon: <MdOutlineShoppingBag size="20px" />,
        url: ROUTER_MAP['naver-shopping-users'],
        trafficTypes: ['SHOP'],
      },
      {
        title: '네이버 플레이스 유저',
        icon: <MdOutlinePlace size="20px" />,
        url: ROUTER_MAP['naver-place-users'],
        trafficTypes: ['PLACE'],
      },
    ],
  },
  requestManage: {
    title: '요청관리',
    children: [
      {
        title: '네이버 쇼핑 요청관리',
        icon: <MdOutlineShoppingBag size="20px" />,
        url: ROUTER_MAP['naver-shopping-request-manage'],
        trafficTypes: ['SHOP'],
      },
      {
        title: '네이버 플레이스 요청관리',
        icon: <MdOutlinePlace size="20px" />,
        url: ROUTER_MAP['naver-place-request-manage'],
        trafficTypes: ['PLACE'],
      },
    ],
  },
  log: {
    title: '로그',
    children: [
      {
        title: '네이버 쇼핑 로그',
        icon: <MdOutlineShoppingBag size="20px" />,
        url: ROUTER_MAP['naver-shopping-log-slots'],
        trafficTypes: ['SHOP'],
      },
      {
        title: '네이버 플레이스 로그',
        icon: <MdOutlinePlace size="20px" />,
        url: ROUTER_MAP['naver-place-log-slots'],
        trafficTypes: ['PLACE'],
      },
    ],
  },
  admin: {
    title: '관리',
    children: [
      {
        title: '슬롯 타입 관리',
        icon: <GrUserAdmin size="20px" />,
        url: ROUTER_MAP['slot-type-manage'],
        trafficTypes: ['SHOP', 'PLACE'],
      },
      {
        title: '테이블 헤더 관리',
        icon: <GrUserAdmin size="20px" />,
        url: ROUTER_MAP['table-header-manage'],
        trafficTypes: ['SHOP', 'PLACE'],
      },
    ],
  },
  notice: {
    title: '공지',
    children: [
      {
        title: '공지사항',
        icon: <AiFillNotification size="20px" />,
        url: ROUTER_MAP['notice'],
        realLinkUrl: '/notice/list',
        trafficTypes: ['SHOP', 'PLACE'],
      },
    ],
  },
  settlement: {
    title: '정산',
    children: [
      {
        title: '정산',
        icon: <GrMoney size="20px" />,
        url: ROUTER_MAP['settlement-manage'],
        trafficTypes: ['SHOP', 'PLACE'],
      },
    ],
  },
};

export {
  MENU_INFO,
  ROUTER_MAP,
  MASTER_MENU,
  MANAGER_MENU,
  AGENCY_MENU,
  SELLER_MENU,
  PERMISSION_MENU_MAP,
};
