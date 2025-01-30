import { useEffect, useMemo, useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import { ReactModule } from '../editor/reactQuillModule';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './notice-edit-editor.css';
import { Button } from '@/components/ui/Button';
import { useNoticeContext } from '../useNoticeContext';
import { getCookieValue } from '@/utils/cookie';
import { toast } from 'react-toastify';

const NoticeEdit = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const formats: string[] = [
    'header',
    'size',
    'font',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
    'color',
    'background',
    'align',
    'script',
    'code-block',
    'clean',
  ];

  const [searchParams] = useSearchParams();
  const [title, setTitle] = useState('');
  const { noticeContext, refetch } = useNoticeContext();
  const [content, setContent] = useState('');
  const [date, setDate] = useState('');
  const [isShow, setIsShow] = useState(true);

  const quillRef = useRef<ReactQuill>(null);

  const isEdit = () => searchParams.has('id');

  const toggleIsShow = () => setIsShow((isShow) => !isShow);

  useEffect(() => {
    if (isEdit()) {
      const noticeId = Number(searchParams.get('id'));
      const notice = noticeContext.find((notice) => notice.id === noticeId);
      if (notice) {
        setContent(notice.content);
        setTitle(notice.title);
        setDate(notice.date);
        setIsShow(notice.isShow);
      }
    }
  }, [searchParams, noticeContext]);

  const createPost = async () => {
    const authorization = getCookieValue('Authorization');
    if (!authorization) {
      toast.warning('로그인이 해제되었습니다.');
      navigate('/');
      return;
    }

    const response = await fetch(`${apiUrl}/notices`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authorization,
      },
      body: JSON.stringify({
        subject: title,
        content,
        isShow,
      }),
    });

    if (!response.ok) {
      toast.error('공지사항 작성에 실패하였습니다.');
      return;
    }

    navigate('/notice/list');
    toast.success('공지사항이 작성 되었습니다.');
    refetch();
  };

  const editPost = async () => {
    const authorization = getCookieValue('Authorization');
    if (!authorization) {
      toast.warning('로그인이 해제되었습니다.');
      navigate('/');
      return;
    }

    const response = await fetch(
      `${apiUrl}/notices/${searchParams.get('id')}?noticeSeq=${searchParams.get('id')}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authorization,
        },
        body: JSON.stringify({
          subject: title,
          content,
          isShow,
        }),
      }
    );

    if (!response.ok) {
      toast.error('공지사항 수정에 실패하였습니다.');
      return;
    }

    navigate('/notice/list');
    toast.success('공지사항이 수정되었습니다.');
    refetch();
  };

  const handleImageUpload = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files ? input.files[0] : null;
      if (file) {
        const formData = new FormData();
        formData.append('file', file);

        const authorization = getCookieValue('Authorization');
        if (!authorization) {
          toast.warning('로그인이 해제되었습니다.');
          navigate('/');
          return;
        }

        try {
          const response = await fetch(`${apiUrl}/common/image/upload/url`, {
            method: 'POST',
            headers: {
              Authorization: authorization,
            },
            body: formData,
          });

          if (!response.ok) {
            throw new Error('이미지 업로드에 실패했습니다.');
          }

          const imageUrl = await response.text();
          const quill = quillRef?.current?.getEditor();
          const range = quill?.getSelection();
          quill?.insertEmbed(
            range?.index ?? quill?.getLength(),
            'image',
            imageUrl
          );
        } catch {
          toast.error('이미지 업로드에 실패했습니다.');
        }
      }
    };
  };

  const modules = useMemo(
    () => ({
      toolbar: {
        container: '#toolBar',
        handlers: {
          image: handleImageUpload,
        },
      },
    }),
    []
  );

  const handleOkButton = () => {
    if (isEdit()) {
      editPost();
    } else {
      createPost();
    }
  };

  const deletePost = async () => {
    const authorization = getCookieValue('Authorization');
    if (!authorization) {
      toast.warning('로그인이 해제되었습니다.');
      navigate('/');
      return;
    }

    const response = await fetch(
      `${apiUrl}/notices/${searchParams.get('id')}?noticeSeq=${searchParams.get('id')}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authorization,
        },
      }
    );

    if (!response.ok) {
      toast.error('공지사항 삭제에 실패하였습니다.');
      return;
    }

    navigate('/notice/list');
    toast.success('공지사항이 삭제되었습니다.');
    return response.json();
  };

  return (
    <div className="p-4 bg-white rounded-md edit-editor">
      <input
        type="text"
        placeholder="제목을 입력하세요"
        className="w-full p-1 my-8 text-3xl border-b focus:outline-none"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <div className="flex justify-between mb-2">
        <div className="flex items-center gap-2">
          공지사항 상태:
          <Button
            className={`w-18 h-8 p-2 border rounded-md ${isShow ? 'bg-green-300' : 'bg-red-300 hover:bg-red-400 text-white'} text-gray-600 mr-2 flex justify-center items-center border-none`}
            onClick={toggleIsShow}
          >
            {isShow ? '공개' : '비공개'}
          </Button>
        </div>
        <p className="text-gray-400 min-w-28 ">{date}</p>
      </div>
      <div id="toolBar">
        <ReactModule />
      </div>
      <ReactQuill
        ref={quillRef}
        modules={modules}
        formats={formats}
        value={content}
        onChange={setContent}
        style={{ minHeight: '400px' }}
      />
      <div className="flex justify-center w-full gap-2">
        {isEdit() && (
          <Button
            className="mt-4 text-white bg-red-400 border-none hover:bg-red-500"
            onClick={deletePost}
          >
            삭제
          </Button>
        )}
        <Button className="mt-4" onClick={handleOkButton}>
          완료
        </Button>
      </div>
    </div>
  );
};

export { NoticeEdit };
