export interface Paged<T> {
  data: T[],
  total: number;
}

export interface PagingParams {
  amount: number;
  page: number;
}