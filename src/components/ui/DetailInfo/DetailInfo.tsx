import { ReactNode } from 'react';

type DetailInfoType = {
  mainInfo: JSX.Element[];
  subInfoTitle?: JSX.Element[];
  subInfo?: JSX.Element[][];
  mainTitle: string;
  subTitle: string;
  children?: ReactNode;
};

const DetailInfo = ({
  mainInfo,
  subInfoTitle,
  subInfo,
  mainTitle,
  subTitle,
  children,
}: DetailInfoType) => {
  return (
    <div
      className={`w-full mt-5 bg-white rounded-md mr-7 flex flex-col p-5 h-fit`}
    >
      <div className="mb-5 text-xl font-bold">{mainTitle}</div>
      <div className="w-full border-2 rounded-md">{mainInfo}</div>
      <div className="flex justify-between mt-8 mb-3 text-base font-bold">
        {`${subTitle} (${subInfo?.length})`}
        {children}
      </div>
      <div className="w-full overflow-x-scroll border-2 rounded-md h-1/3 mr-7">
        <div className="flex content-center justify-between w-full mb-3 font-bold text-gray-600">
          {subInfoTitle}
        </div>
        <div className="flex flex-col w-full">
          {subInfo?.map((el, idx) => {
            return (
              <div
                key={`slotRequests_${idx}`}
                className="flex content-center justify-between w-full mb-3"
              >
                {el}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export { DetailInfo };