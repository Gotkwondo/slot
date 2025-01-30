import { CharTable } from '@/components/ui/ChartTable/ChartTable';
import { SHOPPING_TABLE_TYPES, STATE_INFO } from './constants';
import {
  shoppingColumnTypes,
  tableDataType,
} from '@/components/ui/ChartTable/types';
import { useState } from 'react';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { IoSearch } from 'react-icons/io5';
import { selectType } from './types';
import { getCookieValue } from '@/utils/cookie';
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { changeSlotData } from '@/utils/slotData';
import { BUTTON_INFO } from '../requestBtnFunction';
import { useSlotContext } from '../useSlotContext';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { PageNation } from '@/components/ui/PageNation';
import { useTableHeaderContext } from '@/utils/useTableHeaderContext';

const NaverShoppingSlots = () => {
  const [searchParams] = useSearchParams();
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const [tableData, setTableData] = useState<tableDataType[]>([]);
  const [trafficList, setTrafficList] = useState<selectType[]>([]);
  const [idList, setIdList] = useState<selectType[]>([]);
  const [newTableHeader, setNewTableHeader] = useState<shoppingColumnTypes[]>(
    []
  );
  const [slotStatus, setSlotStatus] = useState<selectType>({
    value: 'ACTIVE',
    label: '사용중',
  });
  const [slotType, setSlotType] = useState<selectType>({
    value: '',
    label: '전체',
  });
  const [id, setId] = useState<selectType>({
    value: '',
    label: '전체',
  });
  const [word, setWord] = useState<string>('');
  const [checkedIndexList, setCheckedIndexList] = useState<number[]>([]);

  const { data, isPending, refetch } = useSlotContext({
    trafficType: 'SHOP',
    slotStatus: slotStatus.value,
    trafficId: slotType.value,
    keyword: word,
    searchType: id.value,
    page: searchParams.get('page') ?? '1',
  });

  const { data: tableHeader } = useTableHeaderContext('SHOP');
  useEffect(() => {
    if (tableHeader) {
      const result = [{ value: '', label: '전체' }];
      const newTableHeaderType = [];
      for (const { headerName, searchName } of tableHeader.headerTabs) {
        result.push({ value: searchName, label: headerName });
        newTableHeaderType.push({
          type: 'input',
          val: searchName,
          text: headerName,
        });
      }
      result.push({ label: '생성자', value: 'CREATOR' });
      setIdList(result);
      setNewTableHeader(newTableHeaderType);
    }
  }, [tableHeader]);

  useEffect(() => {
    if (!searchParams.has('page')) {
      navigate('/naver-shopping-slots?page=1');
    }
  }, [searchParams]);

  const { data: trafficMenu } = useQuery({
    queryKey: ['trafficMenu'],
    queryFn: async () => {
      const authorization = getCookieValue('Authorization');
      if (!authorization) {
        toast.warning('로그인이 해제되었습니다.');
        navigate('/');
        return;
      }

      const response = await fetch(`${apiUrl}/traffics/SHOP/tab`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authorization,
        },
      });

      if (!response.ok) {
        toast.warning('슬롯 타입 정보를 가져오는데 실패하였습니다');
      }

      return response.json();
    },
  });
  useEffect(() => {
    if (!trafficMenu) return;
    const newTrafficList: { value: string; label: string }[] = [
      { value: '', label: '전체' },
      ...trafficMenu.trafficMenus.map(
        ({
          trafficId,
          trafficName,
        }: {
          trafficId: number;
          trafficName: string;
        }) => {
          return { value: `${trafficId}`, label: trafficName };
        }
      ),
    ];
    setTrafficList(newTrafficList);
  }, [trafficMenu]);

  useEffect(() => {
    if (data) {
      setTableData(changeSlotData(data.data));
    }
  }, [isPending, data]);

  // const tableHeaderType = [];

  return (
    <div className="mb-7">
      {trafficMenu && trafficList && tableHeader && (
        <div className="flex flex-col items-center w-full h-64 p-4 mt-5 bg-white rounded-md lg:h-36 mr-7">
          <div className="flex flex-col items-end justify-between w-full pt-2 lg:items-center">
            <div className="flex flex-col justify-center w-full mb-2 lg:flex-row lg:items-center">
              {/* state */}
              <div className="flex items-center content-center justify-center w-full mb-2 lg:mr-5 lg:w-5/12 lg:mb-0">
                <p className="text-xs text-start lg:text-center lg:text-base lg:min-w-20 min-w-12">
                  상태
                </p>
                <Select
                  className="w-3/4 lg:mb-0 lg:w-96"
                  selectInfo={STATE_INFO}
                  select={slotStatus}
                  setSelect={setSlotStatus}
                ></Select>
              </div>

              {/* slotType */}
              <div className="flex items-center content-center justify-center w-full lg:w-5/12">
                <p className="text-xs text-start lg:text-center lg:text-base lg:min-w-20 min-w-12">
                  슬롯 타입
                </p>
                <Select
                  className="w-3/4 lg:w-96"
                  selectInfo={trafficList}
                  select={slotType}
                  setSelect={setSlotType}
                ></Select>
              </div>
              <div className="lg:w-1/12"></div>
            </div>

            <div className="flex flex-col justify-center w-full mb-2 lg:flex-row lg:items-center">
              {/* id */}
              <div className="flex items-center content-center justify-center w-full mb-2 lg:mr-5 lg:w-5/12 lg:mb-0">
                <p className="text-xs text-start lg:text-center lg:text-base lg:min-w-20 min-w-12">
                  ID
                </p>
                <Select
                  className="w-3/4 lg:mb-0 lg:w-96"
                  selectInfo={idList}
                  select={id}
                  setSelect={setId}
                ></Select>
              </div>

              {/* keyword */}
              <div className="flex items-center content-center justify-center w-full lg:w-5/12">
                <p className="text-xs text-start lg:text-center lg:text-base lg:min-w-20 min-w-12">
                  검색어
                </p>
                <div className="flex justify-between w-3/4 lg:w-96">
                  <Input
                    value={word}
                    onChange={(e) => {
                      setWord(e.target.value);
                    }}
                    className="w-full"
                  />
                </div>
              </div>
              <div className="flex items-center content-center justify-center w-full mt-2 lg:items-center lg:w-1/12">
                <Button
                  onClick={() => refetch()}
                  inverted={true}
                  className="mr-2 min-w-5"
                >
                  <IoSearch style={{ height: '1rem', width: '1rem' }} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {!isPending && (
        <>
          <CharTable
            columnData={tableData}
            chartType="shopping"
            buttonInfo={BUTTON_INFO}
            tableTypes={SHOPPING_TABLE_TYPES}
            inputTableHeaderTypes={newTableHeader}
            refetch={refetch}
            checkedIndexList={checkedIndexList}
            setCheckedIndexList={setCheckedIndexList}
            idxArr={checkedIndexList}
          />
          <div className="flex justify-center w-full pb-2 bg-white rounded-md ">
            <PageNation
              totalPage={data?.totalPage}
              currentPage={searchParams.get('page') ?? '1'}
            />
          </div>
        </>
      )}
    </div>
  );
};

export { NaverShoppingSlots };
