import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';

export type slotRequestStatusType = 'null' | 'REFUND' | 'REGISTERED' | 'FIX' | 'EXTENSION' | string;

export type requestSearchOptionType = {
  slotRequestStatus: slotRequestStatusType;
  trafficId: number | undefined;
  searchType: string;
  [key: string]: string | number | undefined | null;
};

export type trafficListType = {
  value: string;
  label: string;
};

export type tableHeaderListType = {
  value: string;
  label: string;
  minWidth?: string;
};

export type shoppingRequestType = {
  creatorId: string;
  inflow: number;
  item4: string | null;
  item5: string | null;
  keyword: string | null;
  ownerId: string;
  requestDate: string;
  requestId: number;
  requestStatus: string;
  requestWorkDay: number | null;
  slotCount: number;
  slotId: number;
  storeName: string | null;
  trafficName: string;
  url: string | null;
  [key: string]: string | number | null;
};

export type requestApproveType = {
  trafficType: 'SHOP' | 'PLACE';
  requestIdArr: number[];
  refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<any, Error>>
};

export type trafficInfoType = {
  endAt: string;
  remainQuantity: number;
  startAt: string;
  totalQuantity: number;
  trafficId: number;
  trafficName: string;
  trafficStatus: string;
  trafficType: 'SHOP' | 'PLACE';
  updatedAt: string;
  updatedBy: string;
};