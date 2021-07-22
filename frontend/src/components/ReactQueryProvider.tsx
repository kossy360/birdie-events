import React from 'react';
import {
  DefaultOptions, MutationCache, QueryCache, QueryClient, QueryClientProvider,
} from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

interface TProps {
  children: React.ReactNode;
  client?: QueryClient;
}

interface IQueryClientConfig {
  queryCache?: QueryCache;
  mutationCache?: MutationCache;
  defaultOptions?: DefaultOptions;
}

export const queryClientConfig: IQueryClientConfig = {
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 3,
      refetchOnWindowFocus: true,
      keepPreviousData: true,
      retry: (count) => {
        if (count > 3) return false;

        return false;
      },
    },
  },
};

const queryClient = new QueryClient(queryClientConfig);

const ReactQueryProvider = (props: TProps) => {
  return (
    <QueryClientProvider client={props.client ?? queryClient}>
      {props.children}
      {process.env.NODE_ENV !== 'test' && (
        <ReactQueryDevtools panelProps={{ style: { position: 'fixed' } }} />
      )}
    </QueryClientProvider>
  );
};

export default ReactQueryProvider;
