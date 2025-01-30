/**
 * Date 타입의 값을 yyyy-mm-dd 형식의 문자열로 변환하여 반환
 * @param date 
 * @returns 'yyyy-mm-dd' 문자열
 */
const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export { formatDate };