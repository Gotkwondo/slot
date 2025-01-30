import { ComponentProps, useEffect, useRef, useState } from 'react';
import { SelectInfo } from './select.type';
import { IoMdArrowDropdown } from 'react-icons/io';

type Props = {
  selectInfo: SelectInfo[];
  defaultIdx?: number;
  setSelect: React.Dispatch<React.SetStateAction<SelectInfo>>;
  select: SelectInfo;
} & ComponentProps<'div'>;

const Select = ({
  selectInfo,
  select,
  className,
  setSelect,
  ...rest
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const handleSelect = ({ value, label }: SelectInfo) => {
    setIsOpen(false);
    setSelect({ value, label });
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      selectRef.current &&
      !selectRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={`relative ${className}`} {...rest} ref={selectRef}>
      <div className="w-full">
        <button
          type="button"
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-green-500"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center justify-between">
            {selectInfo.find((info) => info.value === select.value)?.label ?? (
              <div></div>
            )}
            <IoMdArrowDropdown size="20px" />
          </div>
        </button>
      </div>
      {isOpen && (
        <ul className="absolute z-10 w-full overflow-auto bg-white border rounded-md shadow-lg max-h-72">
          {selectInfo.map((info) => (
            <button
              key={info.value}
              className="w-full px-3 py-2 text-left cursor-pointer hover:bg-green-100 hover:rounded-md"
              onClick={() =>
                handleSelect({ value: info.value, label: info.label })
              }
            >
              {info.label}
            </button>
          ))}
        </ul>
      )}
    </div>
  );
};

export { Select };
