import { getCookieValue } from '@/utils/cookie';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface Notice {
  id: number;
  title: string;
  date: string;
  content: string;
  isShow: boolean;
}

const useNoticeContext = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [noticeList, setNoticeList] = useState<Notice[]>([]);

  const { data, isPending, refetch } = useQuery({
    queryKey: ['userInfo'],
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
        endDate: '2024-12-31',
        keyword: '',
      });

      const response = await fetch(`${apiUrl}/notices?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authorization,
        },
      });

      return response.json();
    },
  });

  useEffect(() => {
    if (!data) {
      setNoticeList([]);
      return;
    }
    setNoticeList(
      data.data.map((item: any) => ({
        id: item.noticeSeq,
        title: item.subject,
        date: item.createdAt,
        content: item.content,
        isShow: item.isShow,
      }))
    );
  }, [data]);

  return { noticeContext: noticeList, data, isPending, refetch };
};

export { useNoticeContext };
