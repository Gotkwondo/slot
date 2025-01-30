import Modal from '@/components/modal/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { userStore } from '@/hooks/store/loginStore';
import { getCookieValue } from '@/utils/cookie';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { USER_PERMISSION } from '../constants';

type Props = {
  setShow: (show: boolean) => void;
  type: 'SHOP' | 'PLACE';
};

const AddUserModal = ({ setShow, type }: Props) => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [memo, setMemo] = useState('');
  const userInfo = userStore((state) => state.userInfo);

  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  const [permission, setPermission] = useState({
    value: 'MASTER',
    label: '마스터',
  });

  useEffect(() => {
    if (!userInfo) return;
    const permission = USER_PERMISSION[userInfo.memberPermission][0];
    setPermission({
      value: permission.value,
      label: permission.label,
    });
  }, [userInfo]);

  const fetchAddUser = async () => {
    const authorization = getCookieValue('Authorization');
    if (!authorization) {
      toast.warning('로그인이 해제되었습니다.');
      navigate('/');
      return;
    }

    const response = await fetch(`${apiUrl}/sign-up?trafficType=${type}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authorization,
      },
      body: JSON.stringify({
        id,
        password,
        permission: permission.value,
        memo,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      toast.error(`${errorData.errorData.errorMessage}`);
      return null;
    }

    toast.success('유저 추가 요청이 완료되었습니다.');
    setShow(false);
    return response.json();
  };

  const handleAddButton = async () => {
    if (!id) {
      toast.warning('아이디를 입력해주세요');
      return;
    }

    if (!password) {
      toast.warning('비밀번호를 입력해주세요');
      return;
    }

    if (!permission) {
      toast.warning('권한을 선택해주세요');
      return;
    }

    fetchAddUser();
  };

  return (
    <Modal onClose={() => setShow(false)} disableCloseButton>
      <div className="py-2">
        <p className="mb-2 font-bold">유저 추가</p>
        <div className="flex flex-col gap-5">
          <Input
            placeholder="아이디"
            value={id}
            onChange={(e) => {
              setId(e.target.value);
            }}
          />
          <Input
            placeholder="비밀번호"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            type="password"
          />
        </div>
        <p className="mt-8 mb-2 font-bold">권한</p>
        <Select
          className="w-full"
          select={permission}
          setSelect={setPermission}
          selectInfo={
            userInfo ? USER_PERMISSION[userInfo?.memberPermission] : []
          }
        />

        <p className="mt-8 font-bold">메모</p>
        <textarea
          className="w-full h-32 p-2 border rounded-md resize-none resize-noe "
          value={memo}
          onChange={(e) => {
            setMemo(e.target.value);
          }}
        />
        <div className="flex justify-center w-full gap-4 mt-4">
          <Button onClick={() => setShow(false)}>취소</Button>
          <Button onClick={handleAddButton}>생성</Button>
        </div>
      </div>
    </Modal>
  );
};

export { AddUserModal };
