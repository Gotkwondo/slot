import { Button } from '@/components/ui/Button';
import { userStore } from '@/hooks/store/loginStore';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ROUTER_MAP } from '../lnb/constants';
import { RouterMap } from '../lnb/type';

const ROUTER_HEADER_MAP = {
  'naver-shopping-slots': '네이버 쇼핑 슬롯',
  'naver-place-slots': '네이버 플레이스 슬롯',
  'naver-shopping-users': '네이버 쇼핑 유저',
  'naver-place-users': '네이버 플레이스 유저',
  'naver-shopping-log-slots': '네이버 쇼핑 로그',
  'naver-place-log-slots': '네이버 플레이스 로그',
  'slot-type-manage': '슬롯 타입관리',
  'table-header-manage': '슬롯 헤더관리',
  'naver-shopping-request-manage': '네이버 쇼핑 요청관리',
  'naver-place-request-manage': '네이버 플레이스 요청관리',
  'settlement-manage': '정산',
  notice: '공지사항',
};

const Header = () => {
  const userInfo = userStore((state) => state.userInfo);
  const setUserInfo = userStore((state) => state.setUserInfo);
  const navigate = useNavigate();
  const [fixedMenu, setFixedMenu] = useState<RouterMap | ''>('');

  const currentSubUrl = location.pathname.split('/').filter(Boolean).shift();

  // 올바른 서브 URL인지 확인
  useEffect(() => {
    if (!currentSubUrl) return;

    setFixedMenu(
      currentSubUrl in ROUTER_MAP ? (currentSubUrl as RouterMap) : ''
    );
  }, [currentSubUrl]);

  const logout = async () => {
    document.cookie = 'Authorization=; max-age=0; path=/';
    setUserInfo({ loginId: '', memberPermission: '', trafficTypes: [] });
    await navigate('/');

    toast.success('로그아웃에 성공하셨습니다.');
  };

  return (
    <div className="w-full mb-5 min-w-96">
      <div className="flex items-center justify-between gap-2 p-3 bg-white rounded-md mr-7 mt-7">
        <p className="font-bold">{fixedMenu && ROUTER_HEADER_MAP[fixedMenu]}</p>
        <div className="flex items-center gap-2 ">
          <div className="font-bold text-green-600">{userInfo.loginId}</div>
          <div>님, 안녕하세요!</div>
          <Button onClick={logout}>로그아웃</Button>
        </div>
      </div>
    </div>
  );
};

export { Header };
