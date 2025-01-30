import { useNavigate } from 'react-router-dom';
import { getCookieValue } from '@/utils/cookie';
import { toast } from 'react-toastify';
import { useQuery } from '@tanstack/react-query';

const useTrafficSelectListContext = (trafficType: 'SHOP' | 'PLACE') => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const { data, isPending, refetch } = useQuery({
    queryKey: ['trafficSelectList'],
    queryFn: async () => {
      const authorization = getCookieValue('Authorization');
      if (!authorization) {
        toast.warning('로그인이 해제되었습니다.');
        navigate('/');
        return;
      }
      
      const response = await fetch(`${apiUrl}/traffics/${trafficType}/tab`, {
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

export { useTrafficSelectListContext };