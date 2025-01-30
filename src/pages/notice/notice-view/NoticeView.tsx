import { useNavigate, useSearchParams } from 'react-router-dom';
import { useNoticeContext } from '../useNoticeContext';
import { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import './notice-view.css';
import { Button } from '@/components/ui/Button';
import { userStore } from '@/hooks/store/loginStore';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa6';
import { IoMdArrowRoundBack } from 'react-icons/io';

const NoticeView = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { noticeContext } = useNoticeContext();

  const [notice, setNotice] = useState({
    title: '',
    content: '',
    date: '',
    isShow: false,
  });
  const [currentOrder, setCurrentOrder] = useState(0);

  const userInfo = userStore((state) => state.userInfo);

  useEffect(() => {
    if (!searchParams.has('id')) {
      navigate('/notice/list?page=1');
    }

    const noticeId = Number(searchParams.get('id'));
    const noticeIdx = noticeContext.findIndex(
      (notice) => notice.id === noticeId
    );
    if (noticeIdx !== -1) {
      setNotice(noticeContext[noticeIdx]);
      setCurrentOrder(noticeIdx);
    }
  }, [searchParams, noticeContext]);

  const handlePrevNotice = () => {
    navigate(`/notice/view?id=${noticeContext[currentOrder - 1].id}`);
  };

  const handleNextNotice = () => {
    navigate(`/notice/view?id=${noticeContext[currentOrder + 1].id}`);
  };

  const navigateEditNotice = () => {
    if (!searchParams.has('id')) return;
    const noticeId = Number(searchParams.get('id'));
    const notice = noticeContext.find((notice) => notice.id === noticeId);
    navigate(`/notice/edit?id=${notice?.id}`);
  };

  return (
    <div className="p-8 bg-white rounded-md view-editor ">
      {userInfo.memberPermission === 'MASTER' && (
        <div className="flex justify-between mb-2">
          <div>
            <Button onClick={() => navigate('/notice/list')}>
              <IoMdArrowRoundBack />
            </Button>
          </div>
          <div className="flex">
            {userInfo.memberPermission === 'MASTER' && (
              <p
                className={`w-16 p-2 border rounded-md ${notice.isShow ? 'bg-green-300' : 'bg-red-300 hover:bg-red-400 text-white'} text-gray-600 mr-2 flex justify-center items-center border-none`}
              >
                {notice.isShow ? '공개' : '비공개'}
              </p>
            )}
            <Button onClick={navigateEditNotice}>수정</Button>
          </div>
        </div>
      )}
      <p className="pb-2 text-3xl break-all whitespace-normal border-b ">
        {notice.title}
        <div className="flex justify-between pt-2">
          <div></div>
          <p className="text-sm text-gray-700 min-w-24">{notice.date}</p>
        </div>
      </p>

      <ReactQuill
        value={notice.content}
        readOnly={true}
        className="min-h-[500px]"
      />
      <div className="flex justify-between w-full pt-8 mt-10 border-t">
        <div>
          {currentOrder !== 0 && (
            <div className="flex items-center gap-2">
              <Button
                className="flex items-center justify-center h-8 w-13 min-w-8"
                onClick={handlePrevNotice}
                style={currentOrder === 0 ? { display: 'none' } : {}}
              >
                <FaArrowLeft />
              </Button>
              <p className="max-w-[150px] truncate">
                {noticeContext[currentOrder - 1].title}
              </p>
            </div>
          )}
        </div>
        {currentOrder !== noticeContext.length - 1 && (
          <div className="flex items-center gap-2">
            <p className="max-w-[150px] truncate">
              {noticeContext[currentOrder + 1]?.title}
            </p>
            <Button
              className="flex items-center justify-center h-8 w-13 min-w-8"
              onClick={handleNextNotice}
            >
              <FaArrowRight />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export { NoticeView };
