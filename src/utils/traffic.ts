import { useQuery } from '@tanstack/react-query';
import { getCookieValue } from './cookie';
import { toast } from 'react-toastify';

type getTrafficListType = {
  trafficType: 'SHOP' | 'PLACE';
  trafficStatus: 'ACTIVE' | 'DELETED' | '';
};

const useTrafficListContext = ({ trafficType }: getTrafficListType) => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const { data, isPending } = useQuery({
    queryKey: ['trafficList', trafficType],
    queryFn: async () => {
      const authorization = getCookieValue('Authorization');
      if (!authorization) {
        toast.warning('로그인이 해제되었습니다.');
        //   navigate('/');
        return;
      }

      const params = new URLSearchParams({
        // 세연이가 일단 매직넘버 박으라고 함 (start,end)
        page: '1',
        size: '9999',
        startDate: '2024-01-01',
        endDate: '2124-12-31', // 매직 넘버
        keyword: '',
        trafficType: trafficType,
      });

      const response = await fetch(`${apiUrl}/traffics?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authorization,
        },
      });
      return response.json();
    },
  });

  return { data, isPending };
};

/**
 * 로그 관리 페이지에서 사용하는 traffic을 받는 함수
 * @returns
 */
const useLogManagementTrafficContext = () => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const { data, isPending } = useQuery({
    queryKey: ['logTraffic'],
    queryFn: async () => {
      const authorization = getCookieValue('Authorization');
      if (!authorization) {
        toast.warning('로그인이 해제되었습니다.');
        //   navigate('/');
        return;
      }

      const response = await fetch(`${apiUrl}/histories/traffics/names`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authorization,
        },
      });
      return response.json();
    },
  });
  return { data, isPending };
};

export { useTrafficListContext, useLogManagementTrafficContext };
