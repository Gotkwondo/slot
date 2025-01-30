import { getCookieValue } from '@/utils/cookie';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const useShopSlotTypeContext = ({
  activeType,
}: {
  activeType: '' | 'ACTIVE' | 'DELETED';
}) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const { data, isPending, refetch } = useQuery({
    queryKey: ['shopSlotType', activeType],
    queryFn: async () => {
      const authorization = getCookieValue('Authorization');
      if (!authorization) {
        toast.warning('로그인이 해제되었습니다.');
        navigate('/');
        return;
      }

      const params = new URLSearchParams({
        // 세연이가 일단 매직넘버 박으라고 함 (start,end)
        page: '1',
        size: '9999',
        startDate: '2024-01-01',
        endDate: '2125-12-31',
        keyword: '',
        trafficType: 'SHOP',
        trafficStatus: activeType,
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
  return { data, isPending, refetch };
};

export { useShopSlotTypeContext };
