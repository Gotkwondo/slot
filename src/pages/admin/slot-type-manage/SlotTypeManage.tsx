import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { SelectInfo } from '@/components/ui/select.type';
import { ReactNode, useState } from 'react';
import { RiDeleteBinLine } from 'react-icons/ri';
import { useShopSlotTypeContext } from './useShopSlotTypeContext';
import { Table } from '@/components/ui/table/Table';
import { HEADER_INFO } from './constants';
import { SlotType } from './type';
import { FaRegEdit } from 'react-icons/fa';
import { IoSearch } from 'react-icons/io5';
import { usePlaceSlotTypeContext } from './usePlaceSlotTypeContext';
import { toast } from 'react-toastify';
import { getCookieValue } from '@/utils/cookie';
import { useNavigate } from 'react-router-dom';
import { EditSlotTypeModal } from './modal/EditSlotTypeModal';
import { AddSlotTypeModal } from './modal/AddSlotTypeModal';

//@NOTE: 편의상 모달,토스트 예시 넣어둠. 페이지 제작 시 삭제하고 구현
const SlotTypeManage = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [showAddSlotTypeModal, setShowAddSlotTypeModal] = useState(false);
  const [showAddSlotTypeModalType, setShowAddSlotTypeModalType] =
    useState('SHOP');
  const [showEditSlotTypeModal, setShowEditSlotTypeModal] = useState(-1);
  const [showEditSlotTypeModalType, setShowEditSlotTypeModalType] =
    useState('SHOP');
  const [shopCheckedIndexList, setShopCheckedIndexList] = useState<number[]>(
    []
  );
  const [shopSlotStatus, setShopSlotStatus] = useState<SelectInfo>({
    value: 'ACTIVE',
    label: '활성',
  });
  const shopSelectInfo = [
    { value: '', label: '전체' },
    { value: 'ACTIVE', label: '활성' },
    { value: 'DELETED', label: '삭제대기' },
  ];

  const { data: shopData, refetch: shopRefetch } = useShopSlotTypeContext({
    activeType: shopSlotStatus.value as 'ACTIVE' | 'DELETED' | '',
  });

  const [placeCheckedIndexList, setPlaceCheckedIndexList] = useState<number[]>(
    []
  );
  const [placeSlotStatus, setPlaceSlotStatus] = useState<SelectInfo>({
    value: 'ACTIVE',
    label: '활성',
  });
  const placeSelectInfo = [
    { value: '', label: '전체' },
    { value: 'ACTIVE', label: '활성' },
    { value: 'DELETED', label: '삭제대기' },
  ];

  const { data: placeData, refetch: placeRefetch } = usePlaceSlotTypeContext({
    activeType: placeSlotStatus.value as 'ACTIVE' | 'DELETED' | '',
  });

  const convertDataToTableBodyInfo = (
    datas: SlotType[],
    trafficType: 'SHOP' | 'PLACE'
  ) => {
    if (!datas) return;

    return datas.map((data, rowIndex) => {
      const ary: ReactNode[] = [];

      HEADER_INFO.forEach(({ value }) => {
        if (value === 'edit') {
          ary.push(
            <div
              className="flex justify-center cursor-pointer"
              onClick={() => {
                setShowEditSlotTypeModal(rowIndex);
                setShowEditSlotTypeModalType(trafficType);
              }}
            >
              <FaRegEdit />
              {showEditSlotTypeModal === rowIndex &&
                showEditSlotTypeModalType === trafficType && (
                  <EditSlotTypeModal
                    trafficId={data.trafficId}
                    setShow={setShowEditSlotTypeModal}
                    trafficType={trafficType}
                    refetch={
                      trafficType === 'SHOP' ? shopRefetch : placeRefetch
                    }
                  />
                )}
            </div>
          );
        }
        if (value === 'delete') {
          ary.push(
            <div
              className="flex justify-center cursor-pointer"
              onClick={() => deleteSlotType(trafficType, rowIndex)}
            >
              <RiDeleteBinLine />
            </div>
          );
        } else if (value in data)
          ary.push(<p>{data[value as keyof SlotType]}</p>);
      });

      return ary;
    });
  };

  const activeSlotType = async (trafficType: 'SHOP' | 'PLACE') => {
    const data = trafficType === 'SHOP' ? shopData : placeData;
    const checkedList =
      trafficType === 'SHOP' ? shopCheckedIndexList : placeCheckedIndexList;

    const checkedIds = checkedList.map((index) => data?.data[index].trafficId);

    if (checkedIds.length === 0) {
      toast.warning('활성화할 슬롯을 선택해주세요.');
      return;
    }

    const authorization = getCookieValue('Authorization');
    if (!authorization) {
      toast.warning('로그인이 해제되었습니다.');
      navigate('/');
      return;
    }

    const response = await fetch(`${apiUrl}/traffics/manage/active`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authorization,
      },
      body: JSON.stringify({
        trafficIds: checkedIds,
      }),
    });

    if (!response.ok) {
      toast.warning('슬롯타입 활성화에 실패하였습니다.');
    }

    if (trafficType === 'SHOP') shopRefetch();
    else placeRefetch();
    toast.success('슬롯타입 활성화에 성공하였습니다.');
  };

  const deleteSlotType = async (
    trafficType: 'SHOP' | 'PLACE',
    index: number
  ) => {
    const data = trafficType === 'SHOP' ? shopData : placeData;
    const trafficId = data?.data[index].trafficId;

    const authorization = getCookieValue('Authorization');
    if (!authorization) {
      toast.warning('로그인이 해제되었습니다.');
      navigate('/');
      return;
    }

    const response = await fetch(
      `${apiUrl}/traffics/${trafficId}?trafficId=${trafficId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authorization,
        },
      }
    );

    if (!response.ok) {
      toast.error('슬롯타입 삭제에 실패하였습니다.');
      return;
    }

    if (trafficType === 'SHOP') shopRefetch();
    else placeRefetch();
    toast.success('슬롯타입 삭제에 성공하였습니다.');
  };

  return (
    <>
      <div className="p-4 bg-white rounded-md">
        <div className="flex justify-between mb-4">
          <p className="font-bold">
            슬롯 네이버 쇼핑 ({shopData?.data.length ?? 0})
          </p>
          <div className="flex items-center gap-4">
            <p>슬롯 상태</p>
            <Select
              className="min-w-56"
              select={shopSlotStatus}
              setSelect={setShopSlotStatus}
              selectInfo={shopSelectInfo}
            ></Select>
            <Button inverted className="w-10 " onClick={() => shopRefetch()}>
              <IoSearch style={{ height: '1rem', width: '1rem' }} />
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between mb-4">
          <div></div>
          <div className="flex gap-2">
            <Button onClick={() => activeSlotType('SHOP')}>활성화</Button>
            <Button
              className="w-20"
              onClick={() => {
                setShowAddSlotTypeModal(true);
                setShowAddSlotTypeModalType('SHOP');
              }}
            >
              추가
            </Button>
            {showAddSlotTypeModal && showAddSlotTypeModalType === 'SHOP' && (
              <AddSlotTypeModal
                setShow={setShowAddSlotTypeModal}
                trafficType="SHOP"
                refetch={shopRefetch}
              />
            )}
          </div>
        </div>
        <Table
          checkedIndexList={shopCheckedIndexList}
          setCheckedIndexList={setShopCheckedIndexList}
          headerInfo={HEADER_INFO}
          bodyInfo={convertDataToTableBodyInfo(shopData?.data, 'SHOP') ?? []}
        />
      </div>
      {/* 플레이스 */}
      <div className="p-4 mt-8 bg-white rounded-md">
        <div className="flex justify-between mb-4">
          <p className="font-bold">
            슬롯 네이버 플레이스 ({placeData?.data.length ?? 0})
          </p>
          <div className="flex items-center gap-4">
            <p>슬롯 상태</p>
            <Select
              className="min-w-56"
              select={placeSlotStatus}
              setSelect={setPlaceSlotStatus}
              selectInfo={placeSelectInfo}
            ></Select>
            <Button inverted className="w-10 " onClick={() => placeRefetch()}>
              <IoSearch style={{ height: '1rem', width: '1rem' }} />
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between mb-4">
          <div></div>
          <div className="flex gap-2">
            <Button onClick={() => activeSlotType('PLACE')}>활성화</Button>
            <Button
              className="w-20"
              onClick={() => {
                setShowAddSlotTypeModal(true);
                setShowAddSlotTypeModalType('PLACE');
              }}
            >
              추가
            </Button>
            {showAddSlotTypeModal && showAddSlotTypeModalType === 'PLACE' && (
              <AddSlotTypeModal
                setShow={setShowAddSlotTypeModal}
                trafficType="PLACE"
                refetch={placeRefetch}
              />
            )}
          </div>
        </div>
        <Table
          checkedIndexList={placeCheckedIndexList}
          setCheckedIndexList={setPlaceCheckedIndexList}
          headerInfo={HEADER_INFO}
          bodyInfo={convertDataToTableBodyInfo(placeData?.data, 'PLACE') ?? []}
        />
      </div>
    </>
  );
};

export { SlotTypeManage };
