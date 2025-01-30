import { ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';

type Props = {
  children: ReactNode;
  onClose: VoidFunction;
  disableCloseButton?: boolean;
};

const Modal = ({ children, onClose, disableCloseButton }: Props) => {
  useEffect(() => {
    // 모달이 열릴 때 body의 스크롤을 막음
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';

    // ESC 키를 눌렀을 때 모달을 닫음
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      // 모달이 닫힐 때 body의 스크롤을 복원하고 이벤트 리스너를 제거
      document.body.style.overflow = originalStyle;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  // 포탈 박스 가져오기
  const portalElement = document.getElementById('modal');
  if (!portalElement) return null;

  const handleModalArea = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className="flex flex-col w-2/3 max-h-[80%] p-4 overflow-y-auto bg-white rounded-md shadow-lg min-h-[300px]"
        onClick={handleModalArea}
      >
        <div className="flex-grow">{children}</div>
        {!disableCloseButton && (
          <div className="flex justify-center mt-4">
            <button
              className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
              onClick={onClose}
            >
              닫기
            </button>
          </div>
        )}
      </div>
    </div>,
    portalElement
  );
};

export default Modal;
