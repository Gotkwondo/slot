import { getCookieValue } from '@/utils/cookie';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { requestSearchOptionType } from './type';
import { makeQueryString } from './utils';

const useRequestManageContext = ({
  searchOption,
  trafficType,
  keyword,
  startDate,
  endDate,
  page,
}: {
  searchOption: requestSearchOptionType;
  trafficType: 'SHOP' | 'PLACE';
  keyword?: string;
  startDate?: string;
  endDate?: string;
  page: string;
}) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const { data, isPending, refetch } = useQuery({
    queryKey: ['requestManagement', trafficType, page],
    queryFn: async () => {
      const authorization = getCookieValue('Authorization');
      if (!authorization) {
        toast.warning('로그인이 해제되었습니다.');
        navigate('/');
        return;
      }

      const params = new URLSearchParams({
        // 세연이가 일단 매직넘버 박으라고 함 (start,end)
        page: page,
        size: '20',
        startDate: startDate ?? '2024-01-01',
        endDate: endDate ?? '2125-12-31',
        keyword: keyword ?? '',
      });
      const queryString = makeQueryString(searchOption);
      const response = await fetch(
        `${apiUrl}/requests/${trafficType}?${params}${queryString}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: authorization,
          },
        }
      );
      return response.json();
    },
  });
  return { data, isPending, refetch };
};

export { useRequestManageContext };
