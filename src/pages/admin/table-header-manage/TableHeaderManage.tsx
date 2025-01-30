import { Table } from '@/components/ui/table/Table';
import { useAdminHeaderContext } from './useAdminHeaderContext';
import { FaRegEdit } from 'react-icons/fa';
import { ReactNode, useEffect, useState } from 'react';
import { Input } from '@/components/ui/Input';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { getCookieValue } from '@/utils/cookie';

const HEADER_INFO = [
  { label: '번호', value: 'headerOrder', minWidth: '70px' },
  { label: '헤더이름', value: 'headerName', minWidth: '100px' },
  { label: '수정', value: 'edit', minWidth: '70px' },
];

type HeaderType = {
  headerId: number;
  headerOrder: number;
  headerName: string;
  searchName: string;
};

const TableHeaderManage = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [inputValues, setInputValues] = useState<{ [key: number]: string }>({});

  const handleInputChange = (headerId: number, value: string) => {
    setInputValues((prev) => ({ ...prev, [headerId]: value }));
  };

  const { data } = useAdminHeaderContext();

  useEffect(() => {
    if (data) {
      const obj: { [key: number]: string } = {};
      data.shop.header.forEach((header: HeaderType) => {
        obj[header.headerId] = header.headerName;
      });
      data.place.header.forEach((header: HeaderType) => {
        obj[header.headerId] = header.headerName;
      });
      setInputValues(obj);
    }
  }, [data]);

  const convertDataToTableBodyInfo = (datas: HeaderType[]) => {
    if (!datas) return;

    return datas.map((data) => {
      const ary: ReactNode[] = [];

      HEADER_INFO.forEach(({ value }) => {
        if (value === 'edit') {
          ary.push(
            <div
              className="flex justify-center cursor-pointer"
              onClick={() => handleEditClick(data.headerId)}
            >
              <FaRegEdit />
            </div>
          );
        } else if (value === 'headerName') {
          ary.push(
            <Input
              className="text-center"
              value={inputValues[data.headerId] || data.headerName}
              onChange={(e) => handleInputChange(data.headerId, e.target.value)}
            />
          );
        } else if (value in data)
          ary.push(<p>{data[value as keyof HeaderType]}</p>);
      });

      return ary;
    });
  };

  const handleEditClick = async (headerId: number) => {
    const authorization = getCookieValue('Authorization');
    if (!authorization) {
      toast.warning('로그인이 해제되었습니다.');
      navigate('/');
      return;
    }

    const response = await fetch(`${apiUrl}/admin/headers/${headerId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authorization,
      },
      body: JSON.stringify({
        headerName: inputValues[headerId],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      toast.error(
        `헤더 수정 요청이 실패하였습니다 (${errorData.errorMessage})`
      );
      return;
    }

    toast.success('헤더 수정 요청이 완료되었습니다.');
  };

  return (
    <div className="flex flex-col gap-4 lg:flex-row">
      <div className="w-full p-4 bg-white rounded-md">
        <p className="mb-2 font-bold">
          네이버 쇼핑 헤더 ({data?.shop.header.length ?? 0})
        </p>
        <Table
          disableCheckBox
          headerInfo={HEADER_INFO}
          bodyInfo={convertDataToTableBodyInfo(data?.shop.header) ?? []}
        />
      </div>
      <div className="w-full p-4 bg-white rounded-md">
        <p className="mb-2 font-bold">
          네이버 플레이스 헤더 ({data?.place.header.length ?? 0})
        </p>
        <Table
          disableCheckBox
          headerInfo={HEADER_INFO}
          bodyInfo={convertDataToTableBodyInfo(data?.place.header) ?? []}
        />
      </div>
    </div>
  );
};

export { TableHeaderManage };
