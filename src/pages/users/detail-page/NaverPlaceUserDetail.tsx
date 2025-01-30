import { Button } from '@/components/ui/Button';
import { DetailInfo } from '@/components/ui/DetailInfo/DetailInfo';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useEffect, useState } from 'react';
import { IoSearch } from 'react-icons/io5';
import { useUserManageList } from './useUserManageList';
import { useUserDetailContext } from './useUserDetailContext';
import { CiStickyNote } from 'react-icons/ci';
import { MemoModal } from '../modals/MemoModal';
import { useSearchParams } from 'react-router-dom';
import { infoType } from './type';

const NaverPlaceUserDetail = () => {
  const titleConstants = {
    activeStatus: '상태',
    createdAt: '생성일',
    createdBy: '생성자',
    loginId: '아이디',
    memo: '메모',
    permission: '권한',
  };

  const LIST_TITLE_INFO = {
    loginId: '아이디',
    permission: '권한',
    slot: '슬롯',
    createdBy: '생성자',
    memo: '메모',
  };

  const SLOTS_TITLE_INFO = {
    trafficName: '슬롯명',
    storeName: '스토어명',
    keyword: '키워드',
    url: 'url',
    item4: '플레이스명',
    item5: '플레이스코드',
    inflow: '유입수',
    startAt: '시작일',
    endAt: '종료일',
    creatorName: '생성자',
  };
  const searchTypeSelectInfo = [
    { value: 'ID', label: '아이디' },
    { value: 'MEMO', label: '메모' },
  ];

  const [searchParams] = useSearchParams();
  const [info, setInfo] = useState<infoType>({
    main: [],
    sub: {
      title: [],
      info: [[]],
    },
  });
  const [showMemoModal, setShowMemoModal] = useState(-1);
  const [searchText, setSearchText] = useState('');
  const [searchType, setSearchType] = useState({
    value: 'ID',
    label: '아이디',
  });
  const makeDataPresetArray = (
    data: { [key: string]: string | number | null },
    titleInfo: { [key: string]: string }
  ) => {
    const result = [];
    for (let key in titleInfo) {
      result.push(
        <div
          className="flex items-center w-full p-3 border-b-2 h-14"
          key={`user_detail_info_${key}_Info`}
        >
          <div className="w-1/5 text-center border-r-2 pr-0.5 min-w-16">
            {titleInfo[key]}
          </div>
          <div className="w-4/5 pl-4">{data[key]}</div>
        </div>
      );
    }
    return result;
  };

  const makeManageListPresetArray = (
    data: {
      placeSlotCounts: number;
      shopSlotCounts: number;
      [key: string]: string | number | null;
    }[],
    subTitleInfo: { [key: string]: string },
    requestType: 'SHOP' | 'PLACE'
  ) => {
    const result: { title: JSX.Element[]; info: JSX.Element[][] } = {
      title: [],
      info: [],
    };
    
    for (let i = 0; i < data.length; i++) {
      const temp: JSX.Element[] = [];
      if (i === 0) {
        for (let key in subTitleInfo) {
          result.title.push(
            <div
              className="w-full px-3 py-2 text-center min-w-40"
              key={`user_detail_subInfo_${requestType}_${i}_${key}_title`}
            >
              {subTitleInfo[key]}
            </div>
          );
        }
      }
      for (let key in subTitleInfo) {
        if (key === 'slot') {
          temp.push(
            <div
              className="w-full px-3 py-2 text-center border-b min-w-40"
              key={`user_detail_subInfo_${requestType}_${i}_${key}_info`}
            >
              {data[i]['placeSlotCounts'] + data[i]['shopSlotCounts']}
            </div>
          );
        } else if (key === 'memo') {
          temp.push(
            <div
              className="flex items-center justify-center w-full px-3 py-2 border-b cursor-pointer min-w-40"
              key={`user_detail_subInfo_${requestType}_${i}_${key}_memo`}
            >
              <CiStickyNote onClick={() => setShowMemoModal(i)} />
              {showMemoModal === i && (
                <MemoModal
                  memo={`${data[i].memo}`}
                  id={`${data[i].loginId}`}
                  setShow={setShowMemoModal}
                />
              )}
            </div>
          );
        } else {
          temp.push(
            <div
              className="w-full px-3 py-2 text-center border-b min-w-40"
              key={`user_detail_subInfo_${requestType}_${i}_${key}_info`}
            >
              {data[i][key]}
            </div>
          );
        }
      }
      result.info.push(temp);
    }
    return result;
  };

  const { isPending, data } = useUserDetailContext({
    memberId: searchParams.get('id') as string,
  });
  const manageList = useUserManageList({
    memberId: searchParams.get('id') as string,
    permission: searchParams.get('permission') as string,
    searchType: searchType.value,
    keyword: searchText ? searchText : undefined,
  });

  const checkPermission = () => {
    if (
      searchParams.get('permission') === '총판' ||
      searchParams.get('permission') === '대행' ||
      searchParams.get('permission') === '마스터'
    ) {
      return 'lists';
    } else return 'slots';
  };

  useEffect(() => {
    if (!isPending && !manageList.isPending) {
      const mainInfo = makeDataPresetArray(data, titleConstants);
      const subInfo = makeManageListPresetArray(
        manageList.data.data,
        checkPermission() === 'lists' ? LIST_TITLE_INFO : SLOTS_TITLE_INFO,
        'SHOP'
      );
      setInfo({ main: mainInfo, sub: subInfo });
    }
  }, [isPending, manageList.isPending, manageList.data, showMemoModal]);

  return (
    <>
      {!isPending && !manageList.isPending && (
        <DetailInfo
          mainInfo={info.main}
          mainTitle="유저 상세"
          subTitle={`${checkPermission() === 'lists' ? '관리 유저' : '슬롯'}`}
          subInfoTitle={info.sub.title}
          subInfo={info.sub.info}
        >
          <div className="flex min-w-60">
            <Select
              className="w-40 mr-2"
              select={searchType}
              setSelect={setSearchType}
              selectInfo={searchTypeSelectInfo}
            ></Select>
            <Input
              placeholder="검색어 입력"
              className="w-full"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Button
              inverted
              className="w-10 "
              onClick={() => manageList.refetch()}
            >
              <IoSearch style={{ height: '1rem', width: '1rem' }} />
            </Button>
          </div>
        </DetailInfo>
      )}
    </>
  );
};

export { NaverPlaceUserDetail };
