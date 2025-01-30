import { ROUTER_MAP } from './constants';

export type RouterMap = keyof typeof ROUTER_MAP;
export type MenuInfo =
  | 'slot'
  | 'user'
  | 'requestManage'
  | 'log'
  | 'admin'
  | 'notice'
  | 'settlement';

export interface MenuInfoChildren {
  title: string;
  icon: JSX.Element;
  url: string;
  trafficTypes: string[];
  realLinkUrl?: string;
}
