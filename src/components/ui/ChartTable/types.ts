import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';

export type tableDataType = {
  type: 'checkbox' | 'text' | 'input';
  col: string;
  val: boolean | string | number | null;
  len?: number;
}[];

export type shoppingColumnTypes = {
  type: 'text' | 'input' | string;
  val: string;
  text: string;
};

export type allChangeInfoType = {
  storeName?: string;
  keyword?: string;
  url?: string;
  item4?: string;
  item5?: string;
};

export type applyDataType = {
  slotId: number;
  slotDataDto: {
    storeName?: string;
    keyword?: string;
    url?: string;
    item4?: string;
    item5?: string;
  };
};

export type newSlotType = {
  slotId: number;
  slotDataDto: {
    storeName: string | number | true;
    keyword: string | number | true;
    url: string | number | true;
    item4: string | number | true;
    item5: string | number | true;
  };
  workday: number;
};

export type buttonMethodType = {
  idArr?: number[];
  id?: number;
  DtoData?: applyDataType[];
  modalOpenSetter?: React.Dispatch<React.SetStateAction<boolean>>;
  newWorkDay?: string;
  allChangeInfo?: allChangeInfoType;
  newSlotData?: newSlotType[];
  requestType?: 'SHOP' | 'PLACE';
  refetch?: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<any, Error>>;
  excelHeaders?: string[];
  columnData?: tableDataType[];
  idxArr?: number[];
};

export type buttonInfo = {
  length: number;
  types: {
    value: number;
    type: string;
    method: (params: buttonMethodType) => void;
    title: string;
  }[];
};

export type clickBtnInfoType = {
  type: string;
  value: {
    col: string;
    val: string;
    type: string;
  }[];
  method: (params: buttonMethodType) => void;
};

// export type
