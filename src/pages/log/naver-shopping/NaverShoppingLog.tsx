import { getTableHeaderContext } from '@/utils/tableHeader';
import { useLogManagementTrafficContext } from '@/utils/traffic';
import { ReactNode, useEffect, useState } from 'react';
import {
  shoppingRequestType,
  tableHeaderListType,
  trafficListType,
} from '../type';
import { Button } from '@/components/ui/Button';
import { IoSearch } from 'react-icons/io5';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useLogContext } from '../useLogContext';
import { Table } from '@/components/ui/table/Table';
import { SHOP_HEADER_INFO } from '../constants';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PageNation } from '@/components/ui/PageNation';
import { excelDownload } from '@/utils/exelDownload';

const NaverShoppingLog = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [requestType, setRequestType] = useState({
    value: 'null',
    label: '전체',
  });
  const [trafficType, setTrafficType] = useState({
    value: '0',
    label: '전체',
  });
  const [table, setTable] = useState({
    value: '',
    label: '전체',
  });

  const [searchInfo, setSearchInfo] = useState('');
  const [filterDate, setFilterDate] = useState<{ startAt: Date; endAt: Date }>({
    startAt: new Date(),
    endAt: new Date(),
  });

  const [trafficList, setTrafficList] = useState<trafficListType[]>([]);
  const [searchTableList, setSearchTableList] = useState<tableHeaderListType[]>(
    []
  );

  const { isPending, data, refetch } = useLogContext({
    searchOption: {
      slotRequestStatus: requestType.value,
      trafficName: trafficType.label,
      searchType: table.value,
      keyword: searchInfo,
    },
    trafficType: 'SHOP',
    page: searchParams.get('page') ?? '1',
  });

  useEffect(() => {
    if (!searchParams.has('page')) {
      navigate('/naver-shopping-log-slots?page=1');
    }
  }, [searchParams]);

  const trafficState = useLogManagementTrafficContext();
  const tableHeaderState = getTableHeaderContext('shop');

  useEffect(() => {
    if (!trafficState.isPending && !tableHeaderState.isPending) {
      const newTrafficList = [
        { value: '0', label: '전체' },
        ...trafficState.data.names.map((e: string, idx: number) => ({
          value: `${idx + 1}`,
          label: e,
        })),
      ];
      const newTableHeaderList = [
        { value: '', label: '전체' },
        ...tableHeaderState.data,
      ];
      setSearchTableList(newTableHeaderList);
      setTrafficList(newTrafficList);
    }
  }, [trafficState.isPending, tableHeaderState.isPending]);

  const requestTypeSelectInfo = [
    { value: 'null', label: '전체' },
    { value: 'REGISTERED', label: '신규요청' },
    { value: 'EXTENSION', label: '연장요청' },
    { value: 'FIX', label: '수정요청' },
    { value: 'REFUND', label: '삭제요청' },
  ];

  const convertDataToTableBodyInfo = (datas: shoppingRequestType[]) => {
    if (!datas) return [];
    return datas.map((data: shoppingRequestType) => {
      const ary: ReactNode[] = [];
      SHOP_HEADER_INFO.forEach(({ value }) => {
        if (value in data)
          ary.push(<p>{data[value as keyof shoppingRequestType]}</p>);
      });
      return ary;
    });
  };

  const changePresetForExcel = (datas: shoppingRequestType[]) => {
    if (!datas) return [];
    const result = [];
    for (let i = 0; i < datas.length; i++) {
      const temp = [];
      for (const key in datas[i]) {
        if (key === 'loginId' || key === 'slotHistoryId' || key === 'workDay')
          continue;
        else temp.push(datas[i][key] ? `${datas[i][key]}` : '없음');
      }
      result.push(temp);
    }
    return result;
  };

  return (
    <>
      <div className="flex flex-col justify-between gap-4 p-8 mb-8 bg-white rounded-md md:flex-row ">
        {!trafficState.isPending && (
          <div className="flex flex-col justify-between w-full">
            <div className="flex flex-col w-full mb-5 lg:gap-8 lg:justify-between lg:items-center lg:flex-row">
              <div className="flex items-center w-full mb-3 lg:mb-0">
                <p className="min-w-16 lg:w-16">구분</p>
                <Select
                  className="w-full min-w-28"
                  select={requestType}
                  setSelect={setRequestType}
                  selectInfo={requestTypeSelectInfo}
                />
              </div>
              <div className="flex items-center w-full mb-3 lg:mb-0">
                <p className="min-w-16 lg:mr-3 lg:text-center lg:w-16">
                  슬롯타입
                </p>
                <Select
                  className="w-full min-w-28"
                  select={trafficType}
                  setSelect={setTrafficType}
                  selectInfo={trafficList}
                />
              </div>

              <div className="flex items-center mb-3 lg:mb-0">
                <p className="min-w-16 lg:w-16">기간</p>
                <div className="w-full p-2 mr-3 text-center border rounded-md">
                  <DatePicker
                    className="w-24 text-center border-none rounded"
                    selected={filterDate.startAt}
                    onChange={(date) =>
                      setFilterDate({ ...filterDate, startAt: date! })
                    }
                    dateFormat="yyyy-MM-dd"
                  />
                </div>
                {'~'}
                <div className="w-full p-2 ml-3 text-center border rounded-md">
                  <DatePicker
                    className="w-24 text-center"
                    selected={filterDate.endAt}
                    onChange={(date) =>
                      setFilterDate({ ...filterDate, endAt: date! })
                    }
                    dateFormat="yyyy-MM-dd"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col w-full gap-2 lg:justify-between lg:items-center lg:flex-row">
              <Select
                className="min-w-28"
                select={table}
                setSelect={setTable}
                selectInfo={searchTableList}
              />
              <Input
                className="w-full lg:mr-3 min-w-40"
                value={searchInfo}
                onChange={(e) => setSearchInfo(e.target.value)}
              />

              <div className="flex justify-end lg:justify-start">
                <div className="flex justify-center h-10">
                  <Button inverted className="w-10" onClick={() => refetch()}>
                    <IoSearch style={{ height: '1rem', width: '1rem' }} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-col justify-between gap-4 p-8 mb-8 bg-white rounded-md md:flex-col ">
        <div className="flex items-center justify-between w-full">
          <p className="font-bold">
            네이버 쇼핑 ({`${data ? data.data.length : 0}`})
          </p>
          <Button
            onClick={() => {
              excelDownload({
                fileName: 'Log_Excel_shopping',
                headerInfo: SHOP_HEADER_INFO.map((e) => e.label),
                bodyInfo: changePresetForExcel(data.data),
              });
            }}
          >
            엑셀로 내려받기
          </Button>
        </div>
        {!isPending && (
          <Table
            disableCheckBox
            headerInfo={SHOP_HEADER_INFO}
            bodyInfo={convertDataToTableBodyInfo(data.data)}
          />
        )}
        <PageNation
          totalPage={data?.totalPage}
          currentPage={searchParams.get('page') ?? '1'}
        />
      </div>
    </>
  );
};

export { NaverShoppingLog };
