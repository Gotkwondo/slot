import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { StyledFixedMenu } from './styled';
import { MENU_INFO, PERMISSION_MENU_MAP, ROUTER_MAP } from './constants';
import { MenuInfo, RouterMap } from './type';
import { userStore } from '@/hooks/store/loginStore';
import { checkAuthorizationCookie, getCookieValue } from '@/utils/cookie';
import { IoArrowBackOutline } from 'react-icons/io5';

type Props = {
  toggleLnb: () => void;
};

const Lnb = ({ toggleLnb }: Props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [fixedMenu, setFixedMenu] = useState<RouterMap | ''>('');
  const currentSubUrl = location.pathname.split('/').filter(Boolean).shift();

  const userInfo = userStore((state) => state.userInfo);

  // 올바른 서브 URL인지 확인
  useEffect(() => {
    if (!currentSubUrl) return;

    setFixedMenu(
      currentSubUrl in ROUTER_MAP ? (currentSubUrl as RouterMap) : ''
    );
  }, [currentSubUrl]);

  const [openMenuList, setOpenMenuList] = useState<MenuInfo[]>([]);
  const apiUrl = import.meta.env.VITE_API_URL;
  const setUserInfo = userStore((state) => state.setUserInfo);

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
          return navigate('/');
        }
        const isLogin = await loginCheckApi();
        if (!isLogin) {
          return navigate('/');
        }
        return;
      }

      setOpenMenuList(PERMISSION_MENU_MAP[userInfo.memberPermission]);
    };

    asyncEffect();
  }, [userInfo, openMenuList]);

  return (
    <div className="relative bg-white rounded-lg w-60 m-7 min-w-60">
      <div
        className="absolute cursor-pointer top-4 right-4"
        onClick={toggleLnb}
      >
        <IoArrowBackOutline className="size-6" />
      </div>
      {openMenuList.map((menuName, idx) => {
        const menu = MENU_INFO[menuName];

        // 마지막 라인이면 border 없이
        const isLastMenu = idx + 1 === openMenuList.length;

        return (
          <div key={menu.title} className={`p-3 ${!isLastMenu && 'border-b'}`}>
            <p className="m-3 mb-0 font-bold ">{menu.title}</p>

            {menu.children.map((subMenu) => {
              // 접근 가능한 trafficType인지 확인
              const isCorrectTrafficType = userInfo.trafficTypes.find((type) =>
                subMenu.trafficTypes.includes(type)
              );
              if (!isCorrectTrafficType) {
                return null;
              }
              return (
                <button
                  key={subMenu.title}
                  className="flex items-center w-full gap-2 p-2 m-1 text-sm rounded-md hover:bg-green-100 hover:text-green-900 hover:cursor-pointer"
                  style={{
                    ...(fixedMenu === subMenu.url && StyledFixedMenu),
                  }}
                  onClick={() =>
                    navigate(
                      subMenu.realLinkUrl ? subMenu.realLinkUrl : subMenu.url
                    )
                  }
                >
                  {subMenu.icon}
                  {subMenu.title}
                </button>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export { Lnb };
