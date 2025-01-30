import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { ReactNode, useEffect, useState } from 'react';
import { IoSearch } from 'react-icons/io5';
import { Table } from '@/components/ui/table/Table';
import { useUserContext } from '../useUserContext';
import { HEADER_INFO } from '../constants';
import { User } from '../type';
import { IoMdAdd } from 'react-icons/io';
import { CiStickyNote } from 'react-icons/ci';
import { FaRegEdit } from 'react-icons/fa';
import { MemoModal } from '../modals/MemoModal';
import { AddUserModal } from '../modals/AddUserModal';
import { getCookieValue } from '@/utils/cookie';
import { toast } from 'react-toastify';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { UpdateUserModal } from '../modals/UpdateUserModal';
import { AddSlotModal } from '../modals/AddSlotModal';
import { PageNation } from '@/components/ui/PageNation';

const NaverShoppingUsers = () => {
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;
  const [searchParams] = useSearchParams();

  const [searchType, setSearchType] = useState({
    value: 'ID',
    label: 'ID',
  });

  const [checkedIndexList, setCheckedIndexList] = useState<number[]>([]);
  const [keyword, setKeyword] = useState('');
  const [showMemoModal, setShowMemoModal] = useState(-1);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showUpdateUserModal, setShowUpdateUserModal] = useState(-1);
  const [showAddSlotModal, setShowAddSlotModal] = useState(-1);

  const [permissionSelect, setPermissionSelect] = useState({
    value: '',
    label: '전체',
  });

  const { isPending, data, refetch } = useUserContext({
    searchType: searchType.value,
    trafficType: 'SHOP',
    permissionType: permissionSelect.value,
    keyword,
    page: searchParams.get('page') ?? '1',
  });

  useEffect(() => {
    if (!searchParams.has('page')) {
      navigate('/naver-shopping-users?page=1');
    }
  }, [searchParams]);

  const permissionSelectInfo = [
    { value: '', label: '전체' },
    { value: 'MASTER', label: '마스터' },
    { value: 'MANAGER', label: '총판' },
    { value: 'AGENCY', label: '대행' },
    { value: 'SELLER', label: '셀러' },
  ];

  const serarchTypeSelectInfo = [
    { value: 'ID', label: 'ID' },
    { value: 'MEMO', label: 'MEMO' },
  ];

  const convertDataToTableBodyInfo = (datas: User[]) => {
    if (!datas) return;
    return datas.map((data, rowIndex) => {
      const ary: ReactNode[] = [];

      HEADER_INFO.forEach(({ value }) => {
        if (value === 'addSlot') {
          ary.push(
            <>
              <Button inverted onClick={() => setShowAddSlotModal(rowIndex)}>
                <IoMdAdd />
              </Button>
              {showAddSlotModal === rowIndex && (
                <AddSlotModal
                  setShow={setShowAddSlotModal}
                  user={data}
                  type={'SHOP'}
                />
              )}
            </>
          );
        } else if (value === 'edit') {
          ary.push(
            <div className="flex justify-center cursor-pointer">
              <FaRegEdit onClick={() => setShowUpdateUserModal(rowIndex)} />
              {showUpdateUserModal === rowIndex && (
                <UpdateUserModal setShow={setShowUpdateUserModal} user={data} />
              )}
            </div>
          );
        } else if (value === 'memo') {
          ary.push(
            <div className="flex justify-center cursor-pointer">
              <CiStickyNote onClick={() => setShowMemoModal(rowIndex)} />
              {showMemoModal === rowIndex && (
                <MemoModal
                  memo={data.memo}
                  id={data.loginId}
                  setShow={setShowMemoModal}
                />
              )}
            </div>
          );
        } else if (value === 'loginId') {
          ary.push(
            <div className="flex justify-center cursor-pointer">
              <Link
                to={`/naver-shopping-users-detail?id=${data.memberId}&permission=${data.permission}`}
              >
                {data[value as keyof User]}
              </Link>
            </div>
          );
        } else if (value in data) ary.push(<p>{data[value as keyof User]}</p>);
      });

      return ary;
    });
  };

  const deleteUsers = async (datas: User[]) => {
    const authorization = getCookieValue('Authorization');
    if (!authorization) {
      toast.warning('로그인이 해제되었습니다.');
      navigate('/');
      return;
    }

    if (checkedIndexList.length === 0) {
      toast.warning('삭제할 유저를 선택해주세요.');
      return;
    }

    const usersToDelete = checkedIndexList.map(
      (index) => datas[index].memberId
    );
    let successCount = 0;
    let failureCount = 0;

    for (const memberId of usersToDelete) {
      const response = await fetch(`${apiUrl}/users/${memberId}/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authorization,
        },
      });

      if (response.ok) {
        successCount++;
      } else {
        failureCount++;
      }
    }

    if (successCount === usersToDelete.length) {
      toast.success('모든 유저가 삭제요청 되었습니다.');
    } else if (successCount > 0) {
      toast.warning(
        `일부 유저만 삭제요청 되었습니다. 성공: ${successCount}, 실패: ${failureCount}`
      );
    } else {
      toast.error('모든 유저 삭제요청에 실패하였습니다.');
    }

    refetch();
  };

  useEffect(() => {
    refetch();
  }, [showAddUserModal]);

  return (
    <>
      <div className="flex flex-col justify-between gap-4 p-8 mb-8 bg-white rounded-md md:flex-row ">
        <div className="flex items-center gap-2 md:w-1/3">
          <p className="w-10">권한</p>
          <Select
            className="w-full"
            select={permissionSelect}
            setSelect={setPermissionSelect}
            selectInfo={permissionSelectInfo}
          ></Select>
        </div>
        <div className="flex items-center gap-2 md:w-1/3">
          <p className="min-w-20">검색타입</p>
          <Select
            className="w-full"
            select={searchType}
            setSelect={setSearchType}
            selectInfo={serarchTypeSelectInfo}
          ></Select>
        </div>
        <div className="flex items-center gap-2 md:w-1/3">
          <Input
            placeholder="검색어 입력"
            className="w-full"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
        <div className="flex justify-center">
          <Button inverted className="w-10 " onClick={() => refetch()}>
            <IoSearch style={{ height: '1rem', width: '1rem' }} />
          </Button>
        </div>
      </div>

      <div className="p-4 bg-white rounded-md">
        <div className="flex justify-between pb-4">
          <p className="text-xl font-bold">네이버 쇼핑</p>
          <div className="flex gap-3">
            <Button onClick={() => setShowAddUserModal(true)}>유저 추가</Button>
            {showAddUserModal && (
              <AddUserModal setShow={setShowAddUserModal} type={'SHOP'} />
            )}
            <Button onClick={() => deleteUsers(data?.data)}>유저 삭제</Button>
          </div>
        </div>
        {!isPending && (
          <Table
            headerInfo={HEADER_INFO}
            bodyInfo={convertDataToTableBodyInfo(data?.data)!}
            checkedIndexList={checkedIndexList}
            setCheckedIndexList={setCheckedIndexList}
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

export { NaverShoppingUsers };
