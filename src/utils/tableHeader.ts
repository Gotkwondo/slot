import { useQuery } from '@tanstack/react-query';
import { getCookieValue } from './cookie';

type headerInfoType = {
  header: {
    headerId: number;
    headerName: string;
    headerOrder: number;
    searchName: string;
  }[];
  totalCount: number;
};

const setFormatTableHeaderInfo = ({header, totalCount}: headerInfoType) => {
  const result = [];
  for (let i = 0; i < totalCount; i++){
    result.push({ value: header[i].searchName, label: header[i].headerName });
  }
  return result;
}

const getTableHeaderContext = (requestType: 'shop' | 'place') => {
  const apiUrl = import.meta.env.VITE_API_URL;

  let { data, isPending } = useQuery({
    queryKey: ['tableHeader', requestType],
    queryFn: async () => {
      const authorization = getCookieValue('Authorization');
      if (!authorization) {
        return;
      }

      const response = await fetch(`${apiUrl}/admin/headers`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authorization,
        }
      })
      return response.json();
    },
  });
  
  if (!isPending) {
    data = setFormatTableHeaderInfo(data[requestType]);
  }
  
  return { data, isPending };
}

export { getTableHeaderContext };