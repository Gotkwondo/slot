import { getCookieValue } from '@/utils/cookie';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const useSettlementContext = ({
  name,
  page,
  startDate,
  endDate,
}: {
  name?: string;
  page: string;
  startDate?: string;
  endDate?: string;
}) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const { data, isPending, refetch } = useQuery({
    queryKey: ['settlement', page],
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
        startDate: startDate ? startDate : '2024-01-01',
        endDate: endDate ? endDate : '2024-12-31',
        keyword: name ?? '',
      });

      const response = await fetch(
        `${apiUrl}/histories/calculation?${params}`,
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

export { useSettlementContext };
