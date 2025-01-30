export type slotInfoDtoType = {
  "slotId": number;
  "status": string;
  "loginId": string;
  "trafficName": string;
  "storeName": string | null;
  "keyword": string | null;
  "url": string | null;
  "item4": string | null;
  "item5": string | null;
  "inflow": string;
  "startAt": string;
  "endAt": string;
  "creatorName": string;
  "inOperation": boolean;
  [key: string]: number | string | boolean | null;
};

export type slotDataType = {
  "storeName": string | null;
  "keyword": string | null;
  "url": string | null;
  "groupMid": string | null;
  "productMid": string | null;
  [key: string]: string | null
};

export type slotRequestType = {
  "slotId": number;
  "slotData": slotDataType
  "workday": number;
  "requestStatus": string;
  "startAt": string;
  "endAt": string;
  [key: string]: number | string | slotDataType;
};

export type slotDetailInfoType = {
  "slotInfoDto": slotInfoDtoType;
  "slotRequests": slotRequestType[];
};

export type requestInfoType = {
  col: string;
  val: string | number | boolean | null;
};

export type infoDtoType = {
  col: string;
  val: string | number | boolean | null;
  len?: number;
};

export type slotReactElementType = {
  dtoElement: JSX.Element[];
  slotRequests: {
    title: JSX.Element[];
    info: JSX.Element[][];
  };
};

export type titleConstantsType = {
  [key: string]: string
};