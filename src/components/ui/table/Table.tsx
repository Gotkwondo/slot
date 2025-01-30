import { useState, ReactNode, useEffect } from 'react';
import { HeaderInfo } from './type';

type Props = {
  headerInfo: HeaderInfo[];
  bodyInfo: ReactNode[][];
  checkedIndexList?: number[];
  setCheckedIndexList?: React.Dispatch<React.SetStateAction<number[]>>;
  disableCheckBox?: boolean;
};

const Table = ({
  headerInfo,
  bodyInfo,
  disableCheckBox,
  checkedIndexList,
  setCheckedIndexList,
}: Props) => {
  const [allChecked, setAllChecked] = useState(false);

  const handleCheckAll = () => {
    if (!setCheckedIndexList || !checkedIndexList) return;
    if (allChecked) {
      setCheckedIndexList([]);
    } else {
      const allIds = bodyInfo.map((_, idx) => idx); // Assuming the ID is in the second column
      setCheckedIndexList(allIds);
    }
    setAllChecked(!allChecked);
  };

  const handleCheck = (id: number) => {
    if (!setCheckedIndexList || !checkedIndexList) return;
    if (checkedIndexList.includes(id)) {
      setCheckedIndexList(
        checkedIndexList.filter((checkedId) => checkedId !== id)
      );
    } else {
      setCheckedIndexList([...checkedIndexList, id]);
    }
  };

  useEffect(() => {
    if (!setCheckedIndexList || !checkedIndexList || !bodyInfo) return;
    if (checkedIndexList.length === bodyInfo.length) {
      setAllChecked(true);
    } else {
      setAllChecked(false);
    }
  }, [checkedIndexList]);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border">
        <thead className="text-white bg-green-500">
          <tr>
            {!disableCheckBox && (
              <th className="px-4 py-2 text-center border min-w-[10px]">
                <input
                  type="checkbox"
                  checked={allChecked}
                  onChange={handleCheckAll}
                />
              </th>
            )}
            {headerInfo.map((header, index) => (
              <th
                key={index}
                className="px-4 py-2 text-center border"
                style={{ minWidth: header.minWidth }}
              >
                {header.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bodyInfo &&
            bodyInfo.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b">
                {!disableCheckBox && (
                  <td className="px-4 py-2 text-center border">
                    <input
                      type="checkbox"
                      checked={checkedIndexList?.includes(rowIndex)} // Assuming the ID is in the second column
                      onChange={() => handleCheck(rowIndex)}
                    />
                  </td>
                )}
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="px-4 py-2 text-center border">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export { Table };
