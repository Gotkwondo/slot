import Modal from '@/components/modal/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { userStore } from '@/hooks/store/loginStore';
import { getCookieValue } from '@/utils/cookie';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { User } from '../type';
import { PERMISSION_LABEL, USER_PERMISSION } from '../constants';

type Props = {
  setShow: (show: number) => void;
  user: User;
};

const UpdateUserModal = ({ setShow, user }: Props) => {
  const [id, setId] = useState(user.loginId);
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [memo, setMemo] = useState(user.memo);
  const [showPasswordChangeArea, setShowPasswordChangeArea] = useState(false);
  const userInfo = userStore((state) => state.userInfo);

  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  const [permission, setPermission] = useState({
    value: '',
    label: '',
  });

  useEffect(() => {
    const permission = user.permission as keyof typeof PERMISSION_LABEL;
    setPermission({
      value: PERMISSION_LABEL[permission],
      label: permission,
    });
  }, [user]);

  const fetchUpdateUser = async () => {
    const authorization = getCookieValue('Authorization');
    if (!authorization) {
      toast.warning('로그인이 해제되었습니다.');
      navigate('/');
      return;
    }

    const response = await fetch(
      `${apiUrl}/users/${user.memberId}/info/change`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authorization,
        },
        body: JSON.stringify({
          loginId: id,
          permission: permission.value,
          memo,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      toast.error(`${errorData.errorData.errorMessage}`);
      return null;
    }

    toast.success('유저 수정 요청이 완료되었습니다.');
    setShow(-1);
    return response.json();
  };

  const fetchUpdatePassword = async () => {
    if (showPasswordChangeArea && !password) {
      toast.warning('비밀번호를 입력해주세요');
      return;
    }

    if (password !== passwordCheck) {
      toast.warning('비밀번호가 일치하지 않습니다');
      return;
    }

    const authorization = getCookieValue('Authorization');
    if (!authorization) {
      toast.warning('로그인이 해제되었습니다.');
      navigate('/');
      return;
    }

    const response = await fetch(
      `${apiUrl}/users/${user.memberId}/password/change`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authorization,
        },
        body: JSON.stringify({
          newPassword: password,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      toast.error(`${errorData.errorData.errorMessage}`);
      return null;
    }

    toast.success('비밀번호 요청이 완료되었습니다.');
    setShowPasswordChangeArea(false);
    return response.json();
  };

  const handleAddButton = async () => {
    if (!id) {
      toast.warning('아이디를 입력해주세요');
      return;
    }

    if (!permission) {
      toast.warning('권한을 선택해주세요');
      return;
    }

    fetchUpdateUser();
  };

  return (
    <Modal onClose={() => setShow(-1)} disableCloseButton>
      <div className="py-2">
        <p className="mb-2 font-bold">유저 수정</p>
        <p className="mb-2 font-bold">ID</p>
        <div className="flex flex-col gap-5">
          <Input
            placeholder="아이디"
            value={id}
            onChange={(e) => {
              setId(e.target.value);
            }}
          />
        </div>
        <p className="mt-2 mb-2 font-bold">권한</p>
        <Select
          className="w-full"
          select={permission}
          setSelect={setPermission}
          selectInfo={
            userInfo ? USER_PERMISSION[userInfo?.memberPermission] : []
          }
        />

        <p className="mt-2 font-bold">메모</p>
        <textarea
          className="w-full h-32 p-2 border rounded-md resize-none resize-noe "
          value={memo}
          onChange={(e) => {
            setMemo(e.target.value);
          }}
        />
        <div className="flex flex-col my-2">
          {showPasswordChangeArea ? (
            <div className="flex flex-col justify-center gap-4 p-4 border rounded-md md:flex-row">
              <div className="flex flex-col gap-2">
                <Input
                  placeholder="새 비밀번호"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  type="password"
                />
                <Input
                  placeholder="새 비밀번호 확인"
                  value={passwordCheck}
                  onChange={(e) => {
                    setPasswordCheck(e.target.value);
                  }}
                  type="password"
                />
              </div>
              <div className="flex items-center">
                <Button className="h-10" onClick={fetchUpdatePassword}>
                  비밀번호 변경
                </Button>
              </div>
            </div>
          ) : (
            <Button
              className="border-gray-200"
              onClick={() => {
                setShowPasswordChangeArea(true);
              }}
            >
              비밀번호 변경
            </Button>
          )}
        </div>
        <div className="flex justify-center gap-2">
          <Button onClick={() => setShow(-1)}>닫기</Button>
          <Button onClick={handleAddButton}>유저정보 수정</Button>
        </div>
      </div>
    </Modal>
  );
};

export { UpdateUserModal };
