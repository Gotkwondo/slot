import { buttonMethodType } from '@/components/ui/ChartTable/types';
import { getCookieValue } from '@/utils/cookie';
import { downloadExcelFormat, excelDownload } from '@/utils/exelDownload';
import { toast } from 'react-toastify';

const BUTTON_INFO = {
  length: 6,
  types: [
    {
      value: -1,
      type: 'downloadFormat',
      method: ({ requestType }: buttonMethodType) => { 
        if (!requestType) return;
        downloadExcelFormat(requestType);
        toast.success('시작일은 익일 이후로 입력, 유입량은 100단위');
      },
      title: '양식 다운로드'
    },
    {
      value: 0,
      type: 'excelUpload',
      method: () => {},
      title: '대량 등록',
    },
    {
      value: 1,
      type: 'excel',
      method: ({
        excelHeaders,
        columnData,
        idxArr,
        requestType,
      }: buttonMethodType) => {
        if (excelHeaders && columnData && idxArr) {
          const bodyInfo = [];
          for (let i = 0; i < columnData.length; i++) {
            bodyInfo.push(
              columnData[i]
                .filter((e) => e.col !== 'inOperation')
                .map((e) => (e.val ? `${e.val}` : '없음'))
            );
          }
          if (bodyInfo.length)
            excelDownload({
              fileName: `Slot_Excel${requestType ? '_' + requestType : ''}`,
              headerInfo: excelHeaders,
              bodyInfo: bodyInfo,
            });
        }
      },
      title: '엑셀로 내려받기',
    },
    {
      value: 2,
      type: 'del',
      method: async ({ idArr, requestType, refetch }: buttonMethodType) => {
        const authorization = getCookieValue('Authorization');
        const apiUrl = import.meta.env.VITE_API_URL;
        if (!authorization) {
          toast.error('로그인이 만료되었습니다.');
          return;
        }
        try {
          const response = await fetch(`${apiUrl}/slots/${requestType}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              Authorization: authorization,
            },
            body: JSON.stringify({
              slotIds: idArr,
            }),
          });
          if (response.status === 400) {
            const data = await response.json();
            if (data.errorData) {
              toast.error(data.errorData.errorMessage);
            } else {
              toast.error('지금은 수정할 수 없습니다.');
            }
            return;
          } else if (response.status === 401) {
            toast.error('로그인이 만료되었습니다.');
            return;
          } else if (!response.ok) {
            toast.error('정보를 불러오는데 실패하였습니다.');
            return;
          }
          toast.success('삭제되었습니다.');
        } catch (error) {
          toast.error('삭제에 실패했습니다.');
          console.log(error);
        } finally {
          if (refetch) refetch();
        }
      },
      title: '선택 삭제',
    },
    {
      value: 3,
      type: 'delay',
      method: async ({
        idArr,
        newWorkDay,
        requestType,
        refetch,
      }: buttonMethodType) => {
        const authorization = getCookieValue('Authorization');
        const apiUrl = import.meta.env.VITE_API_URL;
        if (!authorization) {
          toast.error('로그인이 만료되었습니다.');
          return;
        }
        try {
          const response = await fetch(
            `${apiUrl}/slots/${requestType}/extension`,
            {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: authorization,
              },
              body: JSON.stringify({
                slotIds: idArr,
                workDay: newWorkDay,
              }),
            }
          );
          if (response.status === 400) {
            const data = await response.json();
            if (data.errorData) {
              toast.error(data.errorData.errorMessage);
            } else {
              toast.error('지금은 수정할 수 없습니다.');
            }
            return;
          } else if (response.status === 401) {
            toast.error('로그인이 만료되었습니다.');
            return;
          } else if (!response.ok) {
            toast.error('기간을 연장하는데 실패하였습니다.');
            return;
          }
          toast.success('기간 연장이 요청되었습니다.');
        } catch (error) {
          console.log(error);
        } finally {
          if (refetch) refetch();
        }
      },
      title: '선택 연장',
    },
    {
      value: 4,
      type: 'edit',
      method: async ({
        idArr,
        allChangeInfo,
        requestType,
        refetch,
      }: buttonMethodType) => {
        const authorization = getCookieValue('Authorization');
        const apiUrl = import.meta.env.VITE_API_URL;
        if (!authorization) {
          toast.error('로그인이 만료되었습니다.');
          return;
        }
        try {
          const response = await fetch(`${apiUrl}/slots/${requestType}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: authorization,
            },
            body: JSON.stringify({
              slotData: {
                storeName: allChangeInfo?.storeName
                  ? allChangeInfo.storeName
                  : '',
                keyword: allChangeInfo?.keyword ? allChangeInfo.keyword : '',
                url: allChangeInfo?.url ? allChangeInfo.url : '',
                item4: allChangeInfo?.item4 ? allChangeInfo.item4 : '',
                item5: allChangeInfo?.item5 ? allChangeInfo.item5 : '',
              },
              slotIds: idArr,
            }),
          });
          if (response.status === 400) {
            const data = await response.json();
            if (data.errorData) {
              toast.error(data.errorData.errorMessage);
            } else {
              toast.error('지금은 수정할 수 없습니다.');
            }
            return;
          } else if (response.status === 401) {
            toast.error('로그인이 만료되었습니다.');
            return;
          } else if (!response.ok) {
            toast.error('선택된 정보를 수정하는데 실패하였습니다.');
            return;
          }
          toast.success('수정 사항이 요청되었습니다.');
        } catch (error) {
          console.log(error);
        } finally {
          if (refetch) refetch();
        }
      },
      title: '선택 수정',
    },
    {
      value: 5,
      type: 'apply',
      method: async ({
        DtoData = [],
        requestType,
        refetch,
      }: buttonMethodType) => {
        if (DtoData.length === 0) return;
        const authorization = getCookieValue('Authorization');
        const apiUrl = import.meta.env.VITE_API_URL;
        if (!authorization) {
          toast.error('로그인이 만료되었습니다.');
          return;
        }
        try {
          const response = await fetch(`${apiUrl}/slots/${requestType}/apply`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: authorization,
            },
            body: JSON.stringify({
              slots: DtoData,
            }),
          });
          if (response.status === 400) {
            const data = await response.json();
            if (data.errorData) {
              toast.error(data.errorData.errorMessage);
            } else {
              toast.error('지금은 수정할 수 없습니다.');
            }
            return;
          } else if (response.status === 401) {
            toast.error('로그인이 만료되었습니다.');
            return;
          } else if (!response.ok) {
            toast.error('정보를 수정하는데 실패하였습니다.');
            return;
          }
          toast.success('수정 사항이 요청되었습니다.');
        } catch (error) {
          console.log(error);
        } finally {
          if (refetch) refetch();
        }
      },
      title: '일괄 적용',
    },
  ],
};

export { BUTTON_INFO };
