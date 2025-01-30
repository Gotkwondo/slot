import Modal from '@/components/modal/Modal';
import { User } from '../type';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/Input';
import { useQuery } from '@tanstack/react-query';
import { getCookieValue } from '@/utils/cookie';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

type Props = {
  setShow: (show: number) => void;
  user: User;
  type: 'SHOP' | 'PLACE';
};

const AddSlotModal = ({ user, setShow, type }: Props) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [slotType, setSlotType] = useState({ value: '', label: '' });
  const [workDays, setWorkDays] = useState(0);
  const [inFlows, setInFlows] = useState<
    { inflow: number; slotCount: number }[]
  >([{ inflow: 0, slotCount: 1 }]);

  const [startedAt, setStartedAt] = useState('');
  const [endAt, setEndAt] = useState('');

  // startedAt이 변경될 때 작업일수를 업데이트;
  useEffect(() => {
    if (startedAt && endAt) {
      const endDate = new Date(startedAt);
      endDate.setDate(endDate.getDate() + workDays - 1);
      const newEndDate = endDate.toISOString().split('T')[0];
      setEndAt(newEndDate);
    }
  }, [startedAt]);

  // 작업일수가 변경될 때 endAt을 업데이트
  useEffect(() => {
    if (startedAt && workDays > 0) {
      const startDate = new Date(startedAt);
      startDate.setDate(startDate.getDate() + workDays - 1);
      const newEndDate = startDate.toISOString().split('T')[0]; // YYYY-MM-DD 형식으로 변환
      if (newEndDate !== endAt) {
        setEndAt(newEndDate);
      }
    }
  }, [workDays]);

  const { data: trafficMenu } = useQuery({
    queryKey: ['trafficeMenu'],
    queryFn: async () => {
      const authorization = getCookieValue('Authorization');
      if (!authorization) {
        toast.warning('로그인이 해제되었습니다.');
        navigate('/');
        return;
      }

      const response = await fetch(
        `${apiUrl}/traffics/${type}/tab?trafficType=${type}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: authorization,
          },
        }
      );

      if (!response.ok) {
        toast.warning('슬롯 타입 정보를 가져오는데 실패하였습니다');
      }

      return response.json();
    },
  });

  useEffect(() => {
    if (!trafficMenu) return;
    setSlotType({
      value: trafficMenu.trafficMenus[0].trafficId,
      label: trafficMenu.trafficMenus[0].trafficName,
    });
  }, [trafficMenu]);

  const { data: selectedTrafficInfo } = useQuery({
    queryKey: ['selectedTrafficInfo', slotType],
    queryFn: async () => {
      if (!trafficMenu || !slotType.value) return [];
      const authorization = getCookieValue('Authorization');
      if (!authorization) {
        toast.warning('로그인이 해제되었습니다.');
        navigate('/');
        return [];
      }

      const response = await fetch(
        `${apiUrl}/traffics/${slotType.value}/remain`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: authorization,
          },
        }
      );

      return response.json();
    },
  });

  const handleAddTrafficAmount = () => {
    setInFlows([...inFlows, { inflow: 0, slotCount: 1 }]);
  };

  const handleRemoveTrafficAmount = (index: number) => {
    setInFlows(inFlows.filter((_, i) => i !== index));
  };

  const handleInflow = (index: number, inflow: number) => {
    const newinFlows = [...inFlows];
    newinFlows[index].inflow = inflow;
    setInFlows(newinFlows);
    // if (workDays) {
    //   setEndAt();
    // }
  };

  // const handleSlotCount = (index: number, slotCount: number) => {
  //   const newinFlows = [...inFlows];
  //   newinFlows[index].slotCount = slotCount;
  //   setInFlows(newinFlows);
  // };

  const handleNextDayStart = () => {
    const today = new Date();
    today.setDate(today.getDate() + 1); // 오늘 날짜에 1일을 더하여 내일 날짜로 설정
    const tomorrow = today.toISOString().split('T')[0]; // YYYY-MM-DD 형식으로 변환
    setStartedAt(tomorrow);
  };

  const handleDateChanged = (additionalDay: number) => {
    if (startedAt === '') {
      handleNextDayStart();
    }
    setWorkDays(additionalDay);
  };

  const getSelectInfo = () => {
    return trafficMenu
      ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-expect-error
        trafficMenu.trafficMenus.map((v) => ({
          value: v.trafficId,
          label: v.trafficName,
        }))
      : [];
  };

  const fetchAddSlot = async () => {
    if (workDays === 0) {
      toast.warning('작업 일수를 입력해주세요');
      return;
    }

    if (workDays < 0) {
      toast.warning('종료일이 시작일보다 빠릅니다.');
      return;
    }

    if (inFlows.some((v) => v.inflow === 0 || v.slotCount === 0)) {
      toast.warning('유입량과 개수를 입력해주세요');
      return;
    }

    if (!startedAt) {
      toast.warning('시작일을 입력해주세요');
      return;
    }

    if (!trafficMenu) return;
    const authorization = getCookieValue('Authorization');
    if (!authorization) {
      toast.warning('로그인이 해제되었습니다.');
      navigate('/');
      return;
    }

    const response = await fetch(
      `${apiUrl}/slots/users/${user.memberId}?memberId=${user.memberId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authorization,
        },
        body: JSON.stringify({
          trafficId: slotType.value,
          workDays,
          startAt: startedAt,
          inFlows,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      toast.error(
        `슬롯 추가 요청이 실패하였습니다 (${errorData.errorData.errorMessage})`
      );
      return null;
    }

    toast.success('슬롯 추가 요청이 완료되었습니다.');
    setShow(-1);
    return response.json();
  };

  const handleAddNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAddNumber = +e.target.value;

    if (newAddNumber > inFlows.length) {
      const newInFlows = [
        ...inFlows,
        ...Array(newAddNumber - inFlows.length)
          .fill(0)
          .map(() => ({
            inflow: 0,
            slotCount: 1,
          })),
      ];
      setInFlows(newInFlows);
    } else {
      setInFlows((inFlows) => inFlows.slice(0, newAddNumber));
    }
  };

  return (
    <Modal disableCloseButton onClose={() => setShow(-1)}>
      <div className="flex flex-col">
        <p className="mb-2 font-bold">추가 개수</p>
        <Input
          value={inFlows.length}
          onChange={handleAddNumberChange}
          type="number"
        />
        <div className="flex flex-col gap-2 p-2 mt-2 border rounded-md ">
          <div className="flex items-center">
            <p className="w-full mt-2 mb-2 font-bold">유입량</p>
            {/* <p className="w-1/2 mt-2 mb-2 font-bold">개수</p> */}
            <Button
              className="flex items-center justify-center h-8"
              inverted
              onClick={handleAddTrafficAmount}
            >
              +
            </Button>
          </div>
          {inFlows.map((amount, index) => {
            return (
              <div className="flex items-center gap-2" key={index}>
                <Input
                  className="w-full"
                  value={amount.inflow}
                  onChange={(e) => handleInflow(index, +e.target.value)}
                  type="number"
                  step="100"
                />
                {/* <Input
                  className="w-1/2"
                  value={amount.slotCount}
                  onChange={(e) => handleSlotCount(index, +e.target.value)}
                  type="number"
                /> */}
                <Button
                  className="flex items-center justify-center h-8 bg-red-400 border-none hover:bg-red-500 hover:text-white"
                  onClick={() => handleRemoveTrafficAmount(index)}
                  inverted
                >
                  x
                </Button>
              </div>
            );
          })}
        </div>
        <p className="mt-2 mb-2 font-bold">슬롯 타입</p>
        <Select
          select={slotType}
          setSelect={setSlotType}
          selectInfo={getSelectInfo()}
        />
        <p className="mt-2 mb-2 font-bold">작업 일수</p>
        <div className="flex gap-2">
          <Input
            className="w-full"
            value={workDays}
            onChange={(e) => handleDateChanged(+e.target.value)}
            type="number"
          />
          <Button className="w-full" onClick={handleNextDayStart}>
            익일 구동
          </Button>
        </div>
        <div className="flex flex-col justify-around gap-2 mt-2 md:flex-row">
          <div className="flex flex-col w-full">
            <p className="font-bold">시작일</p>
            <Input
              type="date"
              value={startedAt}
              onChange={(e) => setStartedAt(e.target.value)}
            />
          </div>
          <div className="flex flex-col w-full">
            <p className="font-bold">종료일</p>
            <Input
              type="date"
              value={endAt}
              onChange={(e) => setEndAt(e.target.value)}
              readOnly
            />
          </div>
        </div>
        <p className="mt-2 font-bold text-red-500">현재 잔여수량</p>
        <Input
          className="text-red-500"
          value={selectedTrafficInfo?.remainQuantity}
          disabled
        />
        {/* <div>{selectedTrafficInfo?.remainQuantity}</div> */}
      </div>
      <div className="flex justify-center gap-2 mt-2">
        <Button onClick={() => setShow(-1)}>취소</Button>
        <Button onClick={fetchAddSlot}>추가</Button>
      </div>
    </Modal>
  );
};

export { AddSlotModal };
