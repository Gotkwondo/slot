import { useNavigate } from 'react-router-dom';
import { Button } from './Button';
import { useEffect, useState } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa6';

type Props = {
  totalPage: string;
  currentPage: string;
};

const PageNation = ({ totalPage, currentPage }: Props) => {
  const navigate = useNavigate();

  const handlePageClick = (page: number) => {
    navigate(`?page=${page}`);
  };

  const getPageRange = (page: string) => {
    return Math.floor(+page / 10);
  };

  const [pageRange, setPageRange] = useState(getPageRange(currentPage));
  useEffect(() => {
    setPageRange(getPageRange(currentPage));
  }, [currentPage]);

  const handlePrevPage = () => {
    const nextPage = +currentPage - 1;
    navigate(`?page=${nextPage}`);
  };

  const handleNextPage = () => {
    const nextPage = +currentPage + 1;
    navigate(`?page=${nextPage}`);
  };

  if (!totalPage) return <div></div>;

  return (
    <div className="flex justify-center gap-2 mt-4">
      {getPageRange(currentPage) !== 0 && (
        <Button onClick={handlePrevPage}>
          <FaArrowLeft />
        </Button>
      )}
      {[...Array(+totalPage)].map((_, idx) => {
        const page = idx + 1;
        if (Math.floor(page / 10) !== pageRange) return;
        return (
          <Button
            key={page}
            onClick={() => handlePageClick(page)}
            className={`min-w-10 ${page === +currentPage && 'bg-green-500 text-white'}`}
          >
            {page}
          </Button>
        );
      })}
      {getPageRange(totalPage) !== getPageRange(currentPage) && (
        <Button onClick={handleNextPage}>
          <FaArrowRight />
        </Button>
      )}
    </div>
  );
};

export { PageNation };
