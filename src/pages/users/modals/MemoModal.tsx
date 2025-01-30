import Modal from '@/components/modal/Modal';

type Props = {
  memo: string;
  id: string;
  setShow: (show: number) => void;
};

const MemoModal = ({ memo, id, setShow }: Props) => {
  return (
    <Modal onClose={() => setShow(-1)}>
      <div className="mb-4 ">
        <h1 className="text-xl font-bold">{id}</h1>
      </div>
      <div className="mb-4">
        <p className="text-gray-700">{memo}</p>
      </div>
    </Modal>
  );
};

export { MemoModal };
