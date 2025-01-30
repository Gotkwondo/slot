import { getCookieValue } from '@/utils/cookie';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


const useUserManageList = ({
  memberId,
  permission,
  keyword,
  searchType
}: {
  memberId: string;
  permission: string;
  keyword?: string;
  searchType?: string;
}) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const { isPending, data, refetch } = useQuery({
    queryKey: [`userManageList${memberId}`],
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
        endDate: '2124-12-31',
        keyword: keyword ?? '',
        ...(searchType && { searchType: searchType }),
      });

      const response = await fetch(
        `${apiUrl}/users/${memberId}/${permission === '총판' || permission === '대행' || permission === '마스터' ? 'lists' : 'slots'}?${params}`,
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
  return { isPending, data, refetch };
};

export { useUserManageList };