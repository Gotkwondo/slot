import { ComponentProps, useRef, useState } from 'react';
import { Button } from '../Button';
import {
  buttonInfo,
  tableDataType,
  shoppingColumnTypes,
  clickBtnInfoType,
  allChangeInfoType,
} from '@/components/ui/ChartTable/types';
import { Input } from '../Input';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import Modal from '@/components/modal/Modal';
import { INITIAL_MODAL_ACCEPT_BTN_INFO } from '@/pages/slots/naver-shopping/constants';
import { Link } from 'react-router-dom';
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';
import { fileInputSubmit } from '@/utils/exelDownload';

type Props = {
  chartType: string;
  buttonInfo: buttonInfo;
  tableTypes: shoppingColumnTypes[];
  inputTableHeaderTypes: shoppingColumnTypes[];
  columnData: tableDataType[]; // | 연산으로 추가 가능
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<any, Error>>;
  checkedIndexList: number[];
  setCheckedIndexList?: React.Dispatch<React.SetStateAction<number[]>>;
  idxArr?: number[];
} & ComponentProps<'div'>;

const CharTable = ({
  chartType,
  buttonInfo,
  tableTypes,
  inputTableHeaderTypes,
  columnData,
  refetch,
  className = '',
  checkedIndexList,
  setCheckedIndexList,
  idxArr,
  ...rest
}: Props) => {
  const [tableData, setTableData] = useState(columnData);
  const [modalOpen, setModalOpen] = useState(false);
  const [allChecked, setAllChecked] = useState(false);
  const [tableHeader, setTableHeader] = useState<shoppingColumnTypes[]>([]);

  // 이 상태의 경우 지금은 연장 기능 구현으로 정적으로 선언 => 이후 동적으로 선언하는 방식으로 수정
  const [clickBtnInfo, setClickBtnInfo] = useState<clickBtnInfoType>({
    type: '',
    method: () => { },
    value: [],
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // props로 들어온 columnData를 갱신하기 위한 useEffect
  useEffect(() => {
    setTableData(columnData);
    if (inputTableHeaderTypes) {
      const tableHeaderRest =
        chartType === 'shopping' ? tableTypes.slice(4) : tableTypes.slice(-4);
      setTableHeader([
        ...tableTypes.slice(0, 4),
        ...inputTableHeaderTypes,
        ...tableHeaderRest,
      ]);
    }
  }, [columnData]);

  const totalChangeInputHandler = (
    event: React.ChangeEvent<HTMLInputElement>,
    rowIndex: number
  ) => {
    const newValue = event.target.value;

    setClickBtnInfo((prevData) => {
      const updatedData = prevData.value.map((row, rIdx) => {
        if (rIdx === rowIndex) {
          return {
            ...row,
            val: newValue,
          };
        }
        return row;
      });
      return { ...prevData, value: updatedData };
    });
  };

  const inputChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>,
    rowIndex: number,
    colIndex: number
  ) => {
    const newValue = event.target.value;

    setTableData((prevData) => {
      const updatedData = prevData.map((row, rIdx) =>
        row.map((cell, cIdx) => {
          if (rIdx === rowIndex && cIdx === colIndex) {
            return {
              ...cell,
              val: newValue,
            };
          }
          return cell; // 나머지 셀은 그대로 유지
        })
      );
      return updatedData;
    });
  };

  const checkAllHandler = () => {
    if (!setCheckedIndexList || !checkedIndexList) return;
    if (allChecked) {
      setCheckedIndexList([]);
    } else {
      const allIds = columnData.map((_, idx) => idx);
      setCheckedIndexList(allIds);
    }
    setAllChecked(!allChecked);
  };

  const checkHandler = (id: number) => {
    if (!setCheckedIndexList || !checkedIndexList) return;
    if (checkedIndexList.includes(id)) {
      setCheckedIndexList(
        checkedIndexList.filter((checkedId) => checkedId !== id)
      );
    } else {
      setCheckedIndexList([...checkedIndexList, id]);
    }
  };

  const clearCheckHandler = () => {
    if (!setCheckedIndexList || !checkedIndexList) return;
    setCheckedIndexList([]);
    setAllChecked(false);
  };

  const makeIdArray = (checkedIdxAry: number[]) => {
    const result = [];
    for (const idx of checkedIdxAry) {
      const info = tableData[idx];
      if (info && typeof info[0].val === 'number') {
        result.push(info[0].val);
      }
    }
    return result;
  };

  const makeUpdatedDataAry = (checkedIdxAry: number[]) => {
    const result = [];

    for (const idx of checkedIdxAry) {
      if (tableData[idx][0].val && typeof tableData[idx][0].val === 'number') {
        const id = tableData[idx][0].val;
        const updatedInfo = tableData[idx]
          .filter((line) => line.type === 'input')
          .reduce((acc: allChangeInfoType, cur) => {
            acc[cur.col as keyof allChangeInfoType] = cur.val
              ? `${cur.val}`
              : '';
            return acc;
          }, {});
        result.push({
          slotId: id,
          slotDataDto: updatedInfo,
        });
      }
    }
    return result;
  };

  const delayModalBtnHandler = () => {
    if (!isNaN(+clickBtnInfo.value[0].val)) {
      clickBtnInfo.method({
        idArr: makeIdArray(checkedIndexList),
        newWorkDay: clickBtnInfo.value[0].val,
        requestType: chartType === 'shopping' ? 'SHOP' : 'PLACE',
        refetch: refetch,
      });
      setModalOpen(false);
      refetch();
      setClickBtnInfo({ type: '', method: () => { }, value: [] });
      clearCheckHandler();
    } else toast.error('숫자만 입력해주세요.');
  };

  const editModalBtnHandler = () => {
    const data = clickBtnInfo.value.reduce(
      (acc: allChangeInfoType, { val, type }) => {
        acc[type as keyof allChangeInfoType] = val;
        return acc;
      },
      {} as allChangeInfoType
    );

    clickBtnInfo.method({
      idArr: makeIdArray(checkedIndexList),
      allChangeInfo: data,
      requestType: chartType === 'shopping' ? 'SHOP' : 'PLACE',
      refetch: refetch,
    });
    setModalOpen(false);
    refetch();
    setClickBtnInfo({ type: '', method: () => { }, value: [] });
    clearCheckHandler();
  };
  
  const handleFileButtonClick = () => {
    if (!fileInputRef.current) return;
    fileInputRef.current.click(); // 숨겨진 file input의 클릭 이벤트를 실행
  };
  
  useEffect(() => {
    if (!setCheckedIndexList || !checkedIndexList) return;
    if (columnData.length && checkedIndexList.length === columnData.length) {
      setAllChecked(true);
    } else {
      setAllChecked(false);
    }
  }, [checkedIndexList]);

  return (
    <div
      className={`w-full mt-5 bg-white rounded-md ${className} h-fit mr-4 p-2`}
      {...rest}
    >
      <div className="flex flex-col items-end w-full lg:flex-row lg:justify-between">
        <p className="w-full text-xl font-semibold lg:w-1/6">
          네이버 {chartType === 'shopping' ? '쇼핑' : '플레이스'}{' '}
          {`(${tableData.length})`}
        </p>
        <div className="flex flex-wrap items-center justify-end w-4/6">
          {tableData &&
            buttonInfo.types.map((btnInfo) => {
              // if (btnInfo.type === 'downloadFormat') {
              //   return (
              //     <Button
              //       key={`chartBtn_${btnInfo.value}_${btnInfo.type}`}
              //       className="mr-2 text-xs font-semibold"
              //       onClick={handleFileButtonClick}
              //     >
              //       양식 다운
              //     </Button>
              //   );
              // }
              if (btnInfo.type === 'excelUpload') {
                return (
                  <Button
                    key={`chartBtn_${btnInfo.value}_${btnInfo.type}`}
                    className="mr-2 text-xs font-semibold"
                    onClick={handleFileButtonClick}
                  >
                    <input
                      type="file"
                      accept=".xlsx,.xls"
                      ref={fileInputRef}
                      style={{ display: 'none' }}
                      onChange={(e) =>
                        fileInputSubmit(
                          e,
                          chartType === 'shopping' ? 'SHOP' : 'PLACE'
                        )
                      }
                    />
                    {btnInfo.title}
                  </Button>
                );
              }
              return (
                <Button
                  key={`chartBtn_${btnInfo.value}_${btnInfo.type}`}
                  onClick={() => {
                    if (btnInfo.type === 'del') {
                      btnInfo.method({
                        idArr: makeIdArray(checkedIndexList),
                        requestType:
                          chartType === 'shopping' ? 'SHOP' : 'PLACE',
                        refetch: refetch,
                      });
                      clearCheckHandler();
                    } else if (btnInfo.type === 'apply') {
                      btnInfo.method({
                        DtoData: makeUpdatedDataAry(checkedIndexList),
                        requestType:
                          chartType === 'shopping' ? 'SHOP' : 'PLACE',
                        refetch: refetch,
                      });
                      clearCheckHandler();
                    } else if (btnInfo.type === 'delay') {
                      setClickBtnInfo({
                        type: btnInfo.type,
                        value: INITIAL_MODAL_ACCEPT_BTN_INFO.delay,
                        method: btnInfo.method,
                      });
                      setModalOpen(true);
                    } else if (btnInfo.type === 'edit') {
                      setClickBtnInfo({
                        type: btnInfo.type,
                        value: INITIAL_MODAL_ACCEPT_BTN_INFO.edit,
                        method: btnInfo.method,
                      });
                      setModalOpen(true);
                    } else if (btnInfo.type === 'excel')
                      btnInfo.method({
                        excelHeaders: tableHeader.map(
                          (e: shoppingColumnTypes) => e.text
                        ),
                        columnData: columnData,
                        idxArr: idxArr,
                        requestType:
                          chartType === 'shopping' ? 'SHOP' : 'PLACE',
                      });
                    else if (btnInfo.type === 'downloadFormat') { 
                      btnInfo.method({
                        requestType:
                          chartType === 'shopping' ? 'SHOP' : 'PLACE',
                      });
                    }
                  }}
                  className="mr-2 text-xs font-semibold"
                >
                  {btnInfo.title}
                </Button>
              );
            })}
        </div>
      </div>
      <div className="mt-5 overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead className="text-white bg-green-500">
            <tr>
              <th className="px-4 py-2 text-center border min-w-[10px]">
                <input
                  type="checkbox"
                  onChange={() => checkAllHandler()}
                  checked={allChecked}
                />
              </th>
              {tableData &&
                tableHeader.map((type) => {
                  if (type.type === 'input') {
                    return (
                      <th
                        key={`${chartType}_input_${type.val}`}
                        className="px-3 py-2 text-center border max-w-24"
                      >
                        {type.text}
                      </th>
                    );
                  } else {
                    return (
                      <th
                        key={`${chartType}_text_${type.val}`}
                        className="px-3 py-2 text-center border min-w-36"
                      >
                        {type.text}
                      </th>
                    );
                  }
                })}
            </tr>
          </thead>
          <tbody>
            {columnData &&
              tableData.map((data, idx) => {
                const id = data[0].val;
                return (
                  <tr key={`tableData_${idx}`} className="border-b">
                    <td className="px-4 py-2 text-center border">
                      <input
                        type="checkbox"
                        onChange={() => checkHandler(idx)}
                        checked={checkedIndexList?.includes(idx)}
                      />
                    </td>
                    {data.map((info, i) => {
                      if (info.col === 'inOperation') return;
                      // 데이터의 값이 nul인 경우가 있기에 체크 단계를 추가
                      else if (
                        info.type === 'input' &&
                        (typeof info.val === 'string' || info.val === null)
                      ) {
                        return (
                          <td
                            key={`input_${idx}_${i}`}
                            className="px-4 py-2 text-center border"
                          >
                            <Input
                              className="text-center max-w-24"
                              value={info.val ? info.val : ''}
                              onChange={(e) => inputChangeHandler(e, idx, i)}
                            />
                          </td>
                        );
                      } else {
                        return (
                          <td
                            key={`text_${idx}_${i}`}
                            className="px-4 py-2 text-center border"
                          >
                            <Link
                              key={`text_${idx}_${i}`}
                              className="px-3 py-2 text-center min-w-36"
                              to={`/naver-${chartType}-slots-detail?type=${chartType}&id=${id}`}
                            >
                              {info.val}
                            </Link>
                          </td>
                        );
                      }
                    })}
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      {modalOpen && clickBtnInfo.type !== '' && (
        <Modal
          disableCloseButton
          onClose={() => {
            setModalOpen(false);
            setClickBtnInfo({ type: '', method: () => { }, value: [] });
          }}
        >
          <div className="flex items-center justify-center w-full h-full min-h-72">
            <div className="flex flex-col items-center w-full h-full justify-evenly lg:w-2/3 min-h-72">
              <div className="flex flex-col w-full h-full justify-evenly ">
                {clickBtnInfo.value.map(({ col, val }, idx) => {
                  return (
                    <div
                      className="flex items-center justify-between w-full h-14"
                      key={`changeSlotBtnModal_${idx}`}
                    >
                      <div className="w-20 text-sm text-center lg:text-lg">{`${col}`}</div>
                      <Input
                        value={val}
                        onChange={(e) => {
                          totalChangeInputHandler(e, idx);
                        }}
                        className="w-2/3 h-14"
                      />
                    </div>
                  );
                })}
              </div>
              <div className="flex w-full justify-evenly">
                <Button
                  onClick={() => {
                    setModalOpen(false);
                    setClickBtnInfo({ type: '', method: () => { }, value: [] });
                  }}
                  className="w-20 text-xs lg:w-28 h-11 lg:text-base"
                >
                  모달 닫기
                </Button>
                <Button
                  onClick={() => {
                    if (clickBtnInfo.type === 'delay') {
                      delayModalBtnHandler();
                    } else if (clickBtnInfo.type === 'edit') {
                      editModalBtnHandler();
                    }
                  }}
                  inverted={true}
                  className="w-20 text-xs lg:w-28 h-11 lg:text-base"
                >
                  {clickBtnInfo.type === 'delay' ? '연장하기' : '수정하기'}
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export { CharTable };
