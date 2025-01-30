import { Table } from '@/components/ui/table/Table';
import { useSettlementContext } from './useSettlementContext';
import { HeaderInfo } from '@/components/ui/table/type';
import { ReactNode, useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { IoSearch } from 'react-icons/io5';
import { Input } from '@/components/ui/Input';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PageNation } from '@/components/ui/PageNation';

const summaryHeaderInfo: HeaderInfo[] = [
  { label: '슬롯타입', value: 'trafficName', minWidth: '140px' },
  { label: '추가', value: 'sales', minWidth: '80px' },
  { label: '환불', value: 'refunds', minWidth: '140px' },
  { label: '정산', value: 'total', minWidth: '140px' },
];

const closingHeaderInfo: HeaderInfo[] = [
  { label: '정산일시', value: 'closingDate', minWidth: '140px' },
  { label: '아이디', value: 'loginId', minWidth: '140px' },
  { label: '슬롯ID', value: 'slotId', minWidth: '140px' },
  { label: '슬롯타입', value: 'trafficName', minWidth: '140px' },
  { label: '요청분류', value: 'status', minWidth: '140px' },
  { label: '작업일수', value: 'workDay', minWidth: '140px' },
  { label: '유입량', value: 'inflow', minWidth: '140px' },
  { label: '시작일', value: 'startAt', minWidth: '140px' },
  { label: '종료일', value: 'endAt', minWidth: '140px' },
  // { label: '플레이스/쇼핑', value: 'trafficType', minWidth: '140px' },3
];

type SummarySettlement = {
  trafficName: string;
  trafficType: string;
  sales: number;
  refunds: number;
  total: number;
};

type closingSettlement = {
  slotHistoryId: number;
  closingDate: string;
  slotId: number;
  trafficType: string;
  creatorId: string;
  loginId: string;
  trafficName: string;
  status: string;
  workDay: number;
  inflow: number;
  startAt: string;
  endAt: string;
};

const SettlementManage = () => {
  const today = new Date().toISOString().split('T')[0];
  const [startAt, setStartAt] = useState(today);
  const [endAt, setEndAt] = useState(today);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const { data, refetch } = useSettlementContext({
    name,
    page: searchParams.get('page') ?? '1',
    startDate: startAt,
    endDate: endAt,
  });

  useEffect(() => {
    if (!searchParams.has('page')) {
      navigate('/settlement-manage?page=1');
    }
  }, [searchParams]);

  const convertDataToSummaryTableBodyInfo = (datas: SummarySettlement[]) => {
    if (!datas) return;
    return datas.map((data) => {
      const ary: ReactNode[] = [];

      summaryHeaderInfo.forEach(({ value }) => {
        if (value === 'trafficName') {
          ary.push(
            <p>
              {data.trafficName}({data.trafficType})
            </p>
          );
        } else if (value === 'trafficType') {
          return;
        } else if (value in data)
          ary.push(<p>{data[value as keyof SummarySettlement]}</p>);
      });

      return ary;
    });
  };

  const convertDataToClosingTableBodyInfo = (datas: closingSettlement[]) => {
    if (!datas) return;
    return datas.map((data) => {
      const ary: ReactNode[] = [];

      closingHeaderInfo.forEach(({ value }) => {
        if (value === 'closingDate') {
          ary.push(<p>{data[value].split('T')[0]}</p>);
        } else if (value in data)
          ary.push(<p>{data[value as keyof closingSettlement]}</p>);
      });

      return ary;
    });
  };

  console.log(data);

  return (
    <>
      <div className="flex justify-between p-4 bg-white rounded-md">
        <div className="text-lg font-bold">정산</div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <p>기간</p>
            <Input
              type="date"
              value={startAt}
              onInput={(e) => setStartAt(e.currentTarget.value)}
            />
            <p>~</p>
            <Input
              type="date"
              value={endAt}
              onInput={(e) => setEndAt(e.currentTarget.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <p>사용자 이름</p>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
            <Button inverted className="w-10 h-10 " onClick={() => refetch()}>
              <IoSearch style={{ height: '1rem', width: '1rem' }} />
            </Button>
          </div>
        </div>
      </div>
      <div className="p-4 mt-8 bg-white rounded-md">
        <p className="mb-2 font-bold">요약</p>
        <Table
          disableCheckBox
          headerInfo={summaryHeaderInfo}
          bodyInfo={
            convertDataToSummaryTableBodyInfo(data?.summaries.summary) ?? []
          }
        />
      </div>
      <div className="p-4 mt-8 bg-white rounded-md">
        <p className="mb-2 font-bold">상세</p>
        <Table
          disableCheckBox
          headerInfo={closingHeaderInfo}
          bodyInfo={
            convertDataToClosingTableBodyInfo(data?.closings.data) ?? []
          }
        />
        <PageNation
          totalPage={data?.closings?.totalPage}
          currentPage={searchParams.get('page') ?? '1'}
        />
      </div>
    </>
  );
};

export { SettlementManage };
