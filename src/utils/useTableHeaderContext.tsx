import { getCookieValue } from '@/utils/cookie';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const useTableHeaderContext = (trafficType: 'SHOP' | 'PLACE') => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const { data, isPending } = useQuery({
    queryKey: ['trafficTab', trafficType],
    queryFn: async () => {
      const authorization = getCookieValue('Authorization');
      if (!authorization) {
        toast.warning('로그인이 해제되었습니다.');
        navigate('/');
        return;
      }

      const response = await fetch(`${apiUrl}/slots/${trafficType}/tab`, {
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

export { useTableHeaderContext };
