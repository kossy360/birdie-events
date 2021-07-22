import { render as rtlRender, RenderOptions } from '@testing-library/react';
import React, { FunctionComponent, ReactElement } from 'react';
import { QueryClient } from 'react-query';
import AppThemeProvider from '../components/AppThemeProvider';
import ReactQueryProvider, { queryClientConfig } from '../components/ReactQueryProvider';

interface ITestAppConfig {
  renderOptions?: RenderOptions;
}

export const renderWithApp = (ui: ReactElement, props?: ITestAppConfig) => {
  const queryClient = new QueryClient(queryClientConfig);

  const Wrapper: FunctionComponent = ({ children }) => {
    return (
      <ReactQueryProvider client={queryClient}>
        <AppThemeProvider>{children}</AppThemeProvider>
      </ReactQueryProvider>
    );
  };
  return rtlRender(ui, { wrapper: Wrapper, ...(props?.renderOptions ?? {}) });
};
