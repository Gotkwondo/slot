import { Button } from '@/components/ui/Button';
import { useEffect } from 'react';
import { AiFillNotification } from 'react-icons/ai';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useNoticeContext } from '../useNoticeContext';
import { userStore } from '@/hooks/store/loginStore';

const NoticeList = () => {
  const navigate = useNavigate();

  const { noticeContext } = useNoticeContext();

  const userInfo = userStore((state) => state.userInfo);

  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (!searchParams.has('page')) {
      navigate('/notice/list?page=1');
    }
  }, [searchParams]);

  const currentPage = searchParams.get('page')
    ? Number(searchParams.get('page'))
    : 1;
  const itemsPerPage = 10;

  const totalPages = Math.ceil(noticeContext.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = noticeContext.slice(startIndex, endIndex);
  const maxPageNumbers = 10;
  const startPage =
    Math.floor((currentPage - 1) / maxPageNumbers) * maxPageNumbers + 1;
  const endPage = Math.min(startPage + maxPageNumbers - 1, totalPages);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      navigate(`/notice/list?page=${currentPage - 1}`);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      navigate(`/notice/list?page=${currentPage + 1}`);
    }
  };

  const handlePageChange = (pageNumber: number) => {
    navigate(`/notice/list?page=${pageNumber}`);
  };

  const navigateNoticeView = (noticeId: number) => {
    navigate(`/notice/view?id=${noticeId}`);
  };

  return (
    <div className="p-4 bg-white rounded-md">
      <div className="flex justify-between mb-8">
        <p className="flex items-center gap-1 text-xl font-bold">
          공지사항 <AiFillNotification />
        </p>
        {userInfo.memberPermission === 'MASTER' && (
          <Button
            className="text-sm"
            onClick={() => {
              navigate('/notice/edit');
            }}
          >
            글 쓰기
          </Button>
        )}
      </div>
      {currentItems.map((notice, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-4 border-b cursor-pointer last:border-b-0 hover:bg-green-100"
          onClick={() => navigateNoticeView(notice.id)}
        >
          <p className="truncate">{notice.title}</p>
          <div className="flex items-center">
            <p className="text-gray-400 min-w-28 ">{notice.date}</p>
            {userInfo.memberPermission === 'MASTER' && (
              <p
                className={`w-16 h-8 p-2 border rounded-md ${notice.isShow ? 'bg-green-300' : 'bg-red-300 text-white'} text-gray-600 ml-2 min-w-20 flex justify-center items-center`}
              >
                {notice.isShow ? '공개' : '비공개'}
              </p>
            )}
          </div>
        </div>
      ))}
      {/* 페이지네이션 */}
      <div className="flex items-center justify-center gap-1 mt-4">
        {currentPage !== 1 && (
          <Button
            className="flex items-center justify-center h-8 w-13"
            onClick={handlePreviousPage}
          >
            이전
          </Button>
        )}

        <div className="flex items-center justify-center">
          {Array.from({ length: endPage - startPage + 1 }, (_, i) => (
            <button
              key={startPage + i}
              className={`px-1 py-1 mx-1 rounded-md ${
                currentPage === startPage + i && 'text-green-700'
              }`}
              onClick={() => handlePageChange(startPage + i)}
            >
              {startPage + i}
            </button>
          ))}
        </div>
        {currentPage !== totalPages && (
          <Button
            className="flex items-center justify-center h-8 w-13"
            onClick={handleNextPage}
          >
            다음
          </Button>
        )}
      </div>
    </div>
  );
};

export { NoticeList };
