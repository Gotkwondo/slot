import { Header } from '@/layouts/header/Header';
import { Outlet, redirect } from 'react-router-dom';
import { Lnb } from '@/layouts/lnb/Lnb';
import { checkAuthorizationCookie } from '@/utils/cookie';
import { useState } from 'react';
import { IoArrowForwardOutline } from 'react-icons/io5';

const LoginLayout = () => {
  const [showLnb, setShowLnb] = useState(true);
  const toggleLnb = () => setShowLnb((showLnb) => !showLnb);

  return (
    <div className="flex ">
      {showLnb ? (
        <Lnb toggleLnb={toggleLnb} />
      ) : (
        <div
          className="p-4 bg-white rounded-lg cursor-pointer m-7 hover:bg-green-300"
          onClick={() => setShowLnb(true)}
        >
          <IoArrowForwardOutline className="size-6" />
        </div>
      )}
      <div className="flex-grow overflow-auto">
        <Header></Header>
        <div className="w-full h-fit">
          <div className="rounded-md mr-7 mb-7 min-w-96 h-fit">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

LoginLayout.loader = async () => {
  try {
    // Authorization cookie가 없다면 로그인이 안된 것으로 확인
    if (!checkAuthorizationCookie()) {
      return redirect(`/`);
    }
  } catch {
    return null;
  }
};

export { LoginLayout };
