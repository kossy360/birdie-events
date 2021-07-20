export interface IPaginationQuery {
  cursor?: string;
  next?: string;
  previous?: string;
}

interface IParsedCursor<T> {
  payload: T | null;
  limit: number;
  direction: 1 | -1;
}

interface IDefaultPagination {
  direction?: 1 | -1;
  limit?: number;
}

export const parsePaginationQuery = <T>(
  query: IPaginationQuery,
  defaultPagination?: IDefaultPagination
): IParsedCursor<T> => {
  const payload = query.cursor
    ? (JSON.parse(Buffer.from(query.cursor, 'base64').toString()) as T)
    : null;
  const next = query.next ? parseInt(query.next) : null;
  const previous = query.previous ? parseInt(query.previous) : null;

  const limit = next ?? previous ?? defaultPagination?.limit ?? 10;
  const direction = next ? 1 : previous ? -1 : 1;

  return { limit, direction, payload };
};

export const getCursor = (payload: any): string => {
  const str = Buffer.from(JSON.stringify(payload)).toString('base64');

  return str;
};


