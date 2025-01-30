import { ReactNode, useEffect, useState } from 'react';
import {
  shoppingRequestType,
  tableHeaderListType,
  trafficInfoType,
  trafficListType,
} from '../type';
import { useRequestManageContext } from '../useRequestManageContext';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { IoSearch } from 'react-icons/io5';
import { Table } from '@/components/ui/table/Table';
import { HEADER_INFO, PLACE_HEADER_INFO } from '../constants';

// 날짜 선택 기능
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getRequestIdWithCheckedIndex, requestApprove } from '../utils';
import { useTrafficSelectListContext } from '../useTrafficSelectListContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { excelDownload } from '@/utils/exelDownload';
import { useTableHeaderContext } from '@/utils/useTableHeaderContext';

const NaverPlaceRequestManage = () => {
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
  const [checkedIndexList, setCheckedIndexList] = useState<number[]>([]);
  const [filterDate, setFilterDate] = useState<{ startAt: Date; endAt: Date }>({
    startAt: new Date('2024-01-01'),
    endAt: new Date(),
  });

  const [trafficList, setTrafficList] = useState<trafficListType[]>([]);
  const [searchTableList, setSearchTableList] = useState<tableHeaderListType[]>(
    []
  );
  const [excelHeaderList, setExcelHeaderList] = useState<string[]>([]);

  const formatDate = (date: Date): string => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  useEffect(() => {
    if (!searchParams.has('page')) {
      navigate('/naver-place-request-manage?page=1');
    }
  }, [searchParams]);

  const { isPending, data, refetch } = useRequestManageContext({
    searchOption: {
      slotRequestStatus: requestType.value,
      trafficId: +trafficType.value,
      searchType: table.value,
    },
    trafficType: 'PLACE',
    keyword: searchInfo,
    startDate: formatDate(filterDate.startAt),
    endDate: formatDate(filterDate.endAt),
    page: searchParams.get('page') ?? '1',
  });
  const trafficState = useTrafficSelectListContext('PLACE');
  const tableHeaderState = useTableHeaderContext('SHOP');

  useEffect(() => {
    if (
      !trafficState.isPending &&
      !tableHeaderState.isPending &&
      trafficState.data
    ) {
      const excelHeaderResult = [];
      const tableHeaderList = [];
      const newTrafficList = [
        { value: '0', label: '전체' },
        ...trafficState.data.trafficMenus.map((e: trafficInfoType) => ({
          value: `${e.trafficId}`,
          label: e.trafficName,
        })),
      ];
      for (const { headerName, searchName } of tableHeaderState.data
        .headerTabs) {
        tableHeaderList.push({
          value: searchName,
          label: headerName,
          minWidth: searchName === 'url' ? '200px' : '140px',
        });
        excelHeaderResult.push(headerName);
      }
      const newTableHeaderList = [
        { value: '', label: '전체' },
        ...tableHeaderList,
      ];

      setExcelHeaderList([...excelHeaderResult, '유입수', '생성자', '요청일']);
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
    return datas.map((data) => {
      const ary: ReactNode[] = [];
      HEADER_INFO.forEach(({ value }) => {
        if (value in data)
          ary.push(<p>{data[value as keyof shoppingRequestType]}</p>);
      });
      return ary;
    });
  };

  const dataForExcel = (datas: shoppingRequestType[]) => {
    if (!datas) return [];
    const result = [];
    for (let i = 0; i < datas.length; i++) {
      const temp = [];
      for (const key in datas[i]) {
        temp.push(datas[i][key] ? `${datas[i][key]}` : '없음');
      }
      result.push(temp);
    }
    return result.map((e) => e.slice(7, e.length));
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
                <div className="flex justify-center h-10 ">
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
            네이버 플레이스 ({`${data ? data.data.length : 0}`})
          </p>
          {!tableHeaderState.isPending && tableHeaderState.data && (
            <div>
              <Button
                onClick={() => {
                  excelDownload({
                    fileName: 'Request_Excel_shopping',
                    headerInfo: excelHeaderList,
                    bodyInfo: dataForExcel(data.data),
                  });
                }}
                className="mr-2"
              >
                엑셀로 내려받기
              </Button>
              <Button
                onClick={() => {
                  requestApprove({
                    trafficType: 'PLACE',
                    requestIdArr: getRequestIdWithCheckedIndex(
                      checkedIndexList,
                      data.data
                    ),
                    refetch: refetch,
                  });
                  setCheckedIndexList([]);
                }}
              >
                요청 승인
              </Button>
            </div>
          )}
        </div>
        {!isPending && (
          <Table
            headerInfo={PLACE_HEADER_INFO}
            bodyInfo={convertDataToTableBodyInfo(data.data)}
            checkedIndexList={checkedIndexList}
            setCheckedIndexList={setCheckedIndexList}
          />
        )}
      </div>
    </>
  );
};

export { NaverPlaceRequestManage };
