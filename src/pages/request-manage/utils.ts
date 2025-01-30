import { getCookieValue } from '@/utils/cookie';
import { requestApproveType, requestSearchOptionType, shoppingRequestType } from './type';
import { toast } from 'react-toastify';

const makeQueryString = (searchOption: requestSearchOptionType) => {
  let queryString = '';
  for (let key in searchOption) {
    if (searchOption[key]) {
      queryString += `&${key}=${searchOption[key]}`;
    }
  }
  return queryString;
};

const getRequestIdWithCheckedIndex = (checkedIndexArr: number[], dataList: shoppingRequestType[]) => {
  const result = [];
  for (let n of checkedIndexArr) {
    result.push(dataList[n].requestId);
  }
  return result;
}

const requestApprove = async ({ trafficType, requestIdArr, refetch }: requestApproveType) => {
  const authorization = getCookieValue("Authorization");
  const apiUrl = import.meta.env.VITE_API_URL;
  if (!authorization) {
    toast.error("로그인이 만료되었습니다.");
    return;
  }
  try {
    const response = await fetch(`${apiUrl}/requests/${trafficType}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authorization,
      },
      body: JSON.stringify({
        'requestIds': requestIdArr,
      }),
    });
    if (response.status === 400) {
      toast.error("지금은 승인할 수 없습니다.");
      return;
    }
    else if (response.status === 401) {
      toast.error("로그인이 만료되었습니다.");
      return;
    }
    else if (!response.ok) {
      toast.error("서버 내부에 오류가 발생했습니다.");
      return;
    }
    toast.success('요청이 승인되었습니다.')
  }
  catch (error) {
    toast.error('승인에 실패했습니다.');
    console.log(error);
  }
  finally {
    refetch();
  }
}

export { makeQueryString, getRequestIdWithCheckedIndex, requestApprove };