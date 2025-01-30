export type trafficListType = {
  value: string;
  label: string;
};

export type tableHeaderListType = {
  value: string;
  label: string;
};

export type slotRequestStatusType = 'null' | 'REFUND' | 'REGISTERED' | 'FIX' | 'EXTENSION' | string;

export type searchOptionType = {
  slotRequestStatus: slotRequestStatusType;
  trafficName: string;
  searchType: string;
  [key: string]: string | number | undefined | null;
}

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
  [key: string]: string | number | null
};