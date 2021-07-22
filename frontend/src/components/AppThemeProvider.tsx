import React, { useMemo } from 'react';
import { createGlobalStyle, StyleSheetManager, ThemeProvider } from 'styled-components';
import { appEnv } from '../config/environment';
import { IAppTheme, ITheme } from '../types/theme';

interface IProps {
  children: React.ReactNode;
}

const GlobalStyle = createGlobalStyle`
* {
  margin: 0;
  padding: 0;
  font-size: 1em;
  box-sizing: border-box;
}
body {
  font-family: 'fira sans';
  height: 100%;
  background-color: #ffffff;
}

#root {
  height: 100%;
}

div, input {
  box-sizing: border-box;
}
a {
  text-decoration: none;
  font-family: inherit;
}

html {
    height: 100%;
    font-size: 1rem;
  }`;

const AppThemeProvider = (props: IProps) => {
  const theme = useMemo<IAppTheme>(() => {
    const defaultTheme: ITheme = {
      colors: {
        primaryColor: '#F3CE7D',
        accentColor: '#FFDA8A',
        bgPrimaryColor: '#F7F2EC',
        bgAccentColor: '#fff',
        bgPrimaryColor2: '#ECE5FF',
      },
      text: {
        colors: {
          primary: '#17161B',
          primary600: '#17161b99',
          accent: '#F7F7F7',
        },
        style: {
          sm12: {
            weight: 'normal',
            size: 12,
          },
          sm14: {
            weight: 'normal',
            size: 14,
          },
          sm16: {
            weight: 'normal',
            size: 16,
          },
          sm18: {
            weight: 'normal',
            size: 18,
          },
        },
      },
    };
    return defaultTheme;
  }, []);

  return (
    <StyleSheetManager disableVendorPrefixes={appEnv === 'local'}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        {props.children}
      </ThemeProvider>
    </StyleSheetManager>
  );
};

export default AppThemeProvider;
