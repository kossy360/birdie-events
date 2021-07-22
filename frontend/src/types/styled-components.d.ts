import 'styled-components';
import { IAppTheme } from './theme';

declare module 'styled-components' {
  export interface DefaultTheme extends IAppTheme {}
}
