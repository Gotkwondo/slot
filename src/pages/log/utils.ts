import { searchOptionType } from './type';

const makeQueryString = (searchOption: searchOptionType) => {
  let queryString = '';
  for (let key in searchOption) {
    if (
      searchOption[key] !== '0' &&
      searchOption[key] !== 'null' &&
      searchOption[key] !== '전체' &&
      searchOption[key]
    ) {
      queryString += `&${key}=${searchOption[key]}`;
    }
  }
  return queryString;
};

export { makeQueryString };