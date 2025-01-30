import { getCookieValue } from '@/utils/cookie';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { searchOptionType } from './type';
import { makeQueryString } from './utils';

const useLogContext = ({
  searchOption,
  trafficType,
  page,
  keyword,
}: {
  searchOption: searchOptionType;
  trafficType: 'SHOP' | 'PLACE';
  page: string;
  keyword?: string;
}) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const { data, isPending, refetch } = useQuery({
    queryKey: ['shoppingLog', trafficType, page],
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
        startDate: '2025-01-20',
        endDate: '2125-12-31',
        keyword: keyword ?? '',
      });
      const queryString = makeQueryString(searchOption);
      const response = await fetch(
        `${apiUrl}/histories/slots/${trafficType}?${params}${queryString}`,
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

export { useLogContext };
