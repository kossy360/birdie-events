export interface IPageInfo {
  total: number;
  page: number;
  limit: number;
}

export interface IPaginationQuery {
  page?: number;
  limit?: number;
}
