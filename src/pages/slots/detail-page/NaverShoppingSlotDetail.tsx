import { getCookieValue } from '@/utils/cookie';
import { useEffect, useState } from 'react';
import { redirect, useSearchParams } from 'react-router-dom';
import { slotDetailInfoType, slotReactElementType, titleConstantsType } from './type';
import { generateSlotDetailTsxCode } from '@/pages/slots/detail-page/utils';
import { DetailInfo } from '@/components/ui/DetailInfo/DetailInfo';


const NaverShoppingSlotDetail = () => {
  /**
   * Shopping 슬롯에서 사용되는 Title을 모아둔 상수
   */
  const titleConstants: titleConstantsType = {
    'slotId': '번호',
    'status': '상태',
    'loginId': '아이디',
    'trafficName': '슬롯명',
    'storeName': '스토어명',
    'keyword': '키워드',
    'url': 'url',
    'item4': '묶음MID',
    'item5': '단품MID',
    'inflow': '유입수',
    'startAt': '시작일',
    'endAt': '종료일',
    'creatorName': '생성자',
    'groupMid': '묶음MID',
    'productMid': '단품MID',
    'workday': '적용일수',
    'requestStatus': '요청 종류',
  };

  const [searchParams] = useSearchParams();
  const [slotInfo, setSlotInfo] = useState<slotDetailInfoType>();
  const [dataSheetType, setDataSheetType] = useState<string>('');
  const [slotReactElement, setSlotReactElement] = useState<slotReactElementType>();
  
  const getSlotDetailInfo = async (slotId: number) => {
    const authorization = getCookieValue('Authorization');
    const apiUrl = import.meta.env.VITE_API_URL;

    if (!authorization) {
      alert('로그인이 만료되었습니다.');
      return;
    }

    const response = await fetch(
      `${apiUrl}/slots/SHOP/${slotId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authorization,
        },
      }
    );

    if (response.status === 401) {
      alert('로그인이 만료되었습니다.');
      return;
    }
    if (!response.ok) {
      alert('정보를 불러오는데 실패하였습니다.');
      redirect('/');
      return;
    }

    const slotDetailData = await response.json();
    setSlotInfo(slotDetailData);
  }

  useEffect(() => {
    if (searchParams.has('type')) {
      setDataSheetType(`${searchParams.get('type')}`);
    }
    if (searchParams.has('id')) {
      const slotId = Number(searchParams.get('id'));
      getSlotDetailInfo(slotId);
    }
  }, [searchParams]);
  
  useEffect(() => {
    if (slotInfo) {
      const elements = generateSlotDetailTsxCode(slotInfo, dataSheetType, titleConstants);
      if (elements) setSlotReactElement(elements);
    }
    
  }, [slotInfo])

  return (
    <>
      {slotReactElement && (
        <DetailInfo
          key={`${dataSheetType}_detail_table`}
          mainInfo={slotReactElement.dtoElement}
          subInfoTitle={slotReactElement.slotRequests.title}
          subInfo={slotReactElement.slotRequests.info}
          mainTitle='슬롯 상세'
          subTitle='슬롯 요청'
        />
      )}
    </>
  );
};

export { NaverShoppingSlotDetail };