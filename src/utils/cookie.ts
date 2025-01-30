const checkAuthorizationCookie = () => {
  const name = 'Authorization=';
  const decodedCookie = decodeURIComponent(document.cookie); // 쿠키 값이 인코딩되어 있을 수 있으므로 디코딩
  const cookieArray = decodedCookie.split(';');

  for (let i = 0; i < cookieArray.length; i++) {
    const cookie = cookieArray[i].trim(); // 앞뒤 공백 제거
    if (cookie.indexOf(name) === 0) {
      return true; // Authorization 쿠키가 존재함
    }
  }

  return false; // Authorization 쿠키가 존재하지 않음
};

const getCookieValue = (name: string) => {
  const cookieString = document.cookie;
  const cookies = cookieString.split('; ');

  for (const cookie of cookies) {
    const [key, value] = cookie.split('=');
    if (key === name) {
      return value;
    }
  }
  return null;
};

export { checkAuthorizationCookie, getCookieValue };
