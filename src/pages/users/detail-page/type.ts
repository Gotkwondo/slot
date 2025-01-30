export type userDetailTitleType = {
  activeStatus: string;
  createdAt: string;
  createdBy: string;
  loginId: string;
  memo: string;
  permission: string;
};

export type infoType = {
  main: JSX.Element[];
  sub: {
    title: JSX.Element[];
    info: JSX.Element[][];
  };
};

export type subInfoType = {
  title: JSX.Element[];
  info: JSX.Element[][];
};