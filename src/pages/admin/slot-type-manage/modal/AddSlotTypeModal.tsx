import Modal from '@/components/modal/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { getCookieValue } from '@/utils/cookie';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

type Props = {
  trafficType: 'SHOP' | 'PLACE';
  setShow: (show: boolean) => void;
  refetch: () => void;
};

const trafficMap = {
  SHOP: '쇼핑',
  PLACE: '플레이스',
};

const AddSlotTypeModal = ({ setShow, trafficType, refetch }: Props) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const [slotType, setSlotType] = useState('');
  const [slotCount, setSlotCount] = useState(0);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const fetchAddSlotType = async () => {
    if (slotType === '') {
      toast.warning('슬롯 타입을 입력해주세요.');
      return;
    }

    if (slotCount === 0) {
      toast.warning('슬롯 수량을 입력해주세요.');
      return;
    }

    if (startTime === '') {
      toast.warning('시작시간을 입력해주세요.');
      return;
    }

    if (endTime === '') {
      toast.warning('종료시간을 입력해주세요.');
      return;
    }

    const authorization = getCookieValue('Authorization');
    if (!authorization) {
      toast.warning('로그인이 해제되었습니다.');
      navigate('/');
      return;
    }

    const response = await fetch(`${apiUrl}/traffics/${trafficType}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authorization,
      },
      body: JSON.stringify({
        name: slotType,
        totalQuantity: slotCount,
        startAt: startTime,
        endAt: endTime,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      toast.error(
        `슬롯타입 추가 요청이 실패하였습니다 (${errorData.errorData.errorMessage})`
      );
      return null;
    }

    refetch();
    toast.success('슬롯타입 추가 요청이 완료되었습니다.');
    setShow(false);
    return response.json();
  };

  return (
    <Modal onClose={() => setShow(false)} disableCloseButton>
      <p className="text-lg font-bold">슬롯타입 추가</p>
      <div className="flex flex-col">
        <p className="mt-4 font-bold">
          네이버 {trafficMap[trafficType]} 슬롯 타입
        </p>
        <Input value={slotType} onChange={(e) => setSlotType(e.target.value)} />
        <p className="mt-4 font-bold">
          네이버 {trafficMap[trafficType]} 슬롯 수량
        </p>
        <Input
          value={slotCount}
          onChange={(e) => setSlotCount(+e.target.value)}
          type="number"
        />
        <p className="mt-4 font-bold">시작시간</p>
        <Input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
        <p className="mt-4 font-bold">종료시간</p>
        <Input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />
      </div>
      <div className="flex justify-center gap-4 mt-2">
        <Button onClick={() => setShow(false)}>취소</Button>
        <Button onClick={fetchAddSlotType}>생성</Button>
      </div>
    </Modal>
  );
};

export { AddSlotTypeModal };
