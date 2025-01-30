import Modal from '@/components/modal/Modal';
import { Button } from '@/components/ui/Button';
import { LoginInput } from '@/components/ui/LoginInput';
import { trafficType, userStore } from '@/hooks/store/loginStore';
import { checkAuthorizationCookie, getCookieValue } from '@/utils/cookie';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [open, setOpen] = useState(false);
  const [reLogin, setReLogin] = useState(false);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_API_URL;

  const setUserInfo = userStore((state) => state.setUserInfo);
  const userInfo = userStore((state) => state.userInfo);

  // 현재 토큰을 활용한 로그인 체크
  const loginCheckApi = async () => {
    const authorization = getCookieValue('Authorization');
    if (!authorization) {
      return false;
    }
    const response = await fetch(`${apiUrl}/token`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authorization,
      },
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();

    setUserInfo({
      loginId: data.loginId,
      memberPermission: data.memberPermission,
      trafficTypes: data.trafficTypes,
    });

    return true;
  };

  // 로그인 유무 확인 ( api가 아닌 store로 확인 )
  // TODO: api로 확인하고 store로 업데이트 하도록 변경 예정
  useEffect(() => {
    const asyncEffect = async () => {
      if (userInfo.loginId === '' || userInfo.memberPermission === '') {
        if (!checkAuthorizationCookie()) {
          return;
        }
        const isLogin = await loginCheckApi();
        if (!isLogin) {
          return;
        }
      }
      navigateSlotPage(userInfo.trafficTypes);
    };

    asyncEffect();
  }, [userInfo]);

  const navigateSlotPage = async (trafficTypes: trafficType[]) => {
    if (trafficTypes.includes('SHOP')) await navigate('/naver-shopping-slots');
    else await navigate('/naver-place-slots');
  };

  const onClickButton = () => {
    if (isLoginLoading) return; // 이미 요청 중이면 추가 요청을 막음

    setIsLoginLoading(true);
    loginRequest();
  };

  // 로그인 요청 함수
  const loginRequest = async () => {
    try {
      const response = await fetch(`${apiUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: userId, password }),
      });

      if (!response.ok) {
        throw new Error('로그인 요청 실패');
      }

      //쿠키값 하루로 설정
      const authorization = response.headers.get('Authorization');
      document.cookie = `Authorization=${authorization}; max-age=86400; path=/`;

      const data = await response.json();

      setUserInfo({
        loginId: data.loginId,
        memberPermission: data.memberPermission,
        trafficTypes: data.trafficTypes,
      });

      await navigateSlotPage(data.trafficTypes);

      // 로그인 성공 시 처리 로직
      toast.success('로그인에 성공하셨습니다.');
    } catch (error) {
      toast.error('로그인에 실패하였습니다.');
      console.log(error);
      setOpen(true);
      setReLogin(true);
    } finally {
      setIsLoginLoading(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isLoginLoading) return; // 이미 요청 중이면 추가 요청을 막음

      if (e.key === 'Enter') {
        setIsLoginLoading(true);
        loginRequest();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [userId, password, isLoginLoading]);

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-slate-200">
      <div className="flex flex-col items-center w-2/5 bg-white rounded-lg h-2/5 justify-evenly">
        <div className="w-3/4">
          <p className="mb-2 font-semibold">아이디</p>
          <LoginInput
            value={userId}
            onChange={(e) => {
              setUserId(e.target.value);
            }}
            setter={setUserId}
            style={{ width: '100%' }}
          />
        </div>
        <div className="w-3/4">
          <p className="mb-2 font-semibold">비밀 번호</p>
          <LoginInput
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            setter={setPassword}
            blind={true}
            style={{ width: '90%' }}
          />
        </div>
        {reLogin && <p className="text-red-600">다시 로그인해 주세요.</p>}
        <Button
          onClick={onClickButton}
          inverted={true}
          style={{ width: '75%' }}
        >
          로그인
        </Button>
        <p className="text-xs text-slate-500">Copyright © 2024</p>
      </div>
      {open && (
        <Modal onClose={() => setOpen(false)}>
          <div className="flex flex-col items-center h-full p-2 justify-evenly">
            <p className="text-2xl md:text-4xl">로그인 실패</p>
            <p className="text-sm md:text-2xl">
              아이디나 비밀번호를 확인해주세요.
            </p>
            <Button
              onClick={() => {
                setOpen(false);
              }}
              style={{ width: '50%' }}
            >
              확인
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export { Login };
