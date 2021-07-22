export interface ITextTheme {
  size: number;
  weight: string | number;
  height?: number;
  opacity?: number;
}

export interface ITheme {
  colors: {
    primaryColor: string;
    accentColor: string;
    bgPrimaryColor: string;
    bgAccentColor: string;
    bgPrimaryColor2: string;
  };
  text: {
    colors: {
      primary: string;
      primary600: string;
      accent: string;
    };
    style: {
      sm12: ITextTheme;
      sm14: ITextTheme;
      sm16: ITextTheme;
      sm18: ITextTheme;
    };
  };
}

export interface IAppTheme extends ITheme {}
