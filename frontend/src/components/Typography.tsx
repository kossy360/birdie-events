import * as CSS from 'csstype';
import { cloneDeep, merge } from 'lodash';
import styled, { css, DefaultTheme } from 'styled-components';
import { ITextTheme, ITheme } from '../types/theme';

const toEm = (...pxs: (number | string)[]) => {
  return pxs
    .map((px) => (typeof px === 'number' ? `${(px / 16).toFixed(2)}em` : px))
    .join(' ');
};

interface ITypographyProps {
  textStyle?: keyof ITheme['text']['style'];
  textColor?: keyof ITheme['text']['colors'];
  textTheme?: Partial<ITextTheme>;
  textAlign?: CSS.Properties['textAlign'];
  display?: CSS.Properties['display'];
  clip?: boolean;
  ellipsis?: boolean;
  nowrap?: boolean;
  textTransform?: CSS.Properties['textTransform'];
}

const getTheme = (
  style: keyof ITheme['text']['style'],
  override?: Partial<ITextTheme>
) => {
  let mergedTheme: ITextTheme;

  return (defaultTheme: DefaultTheme) => {
    if (!mergedTheme) {
      mergedTheme = merge(
        cloneDeep(defaultTheme.text.style[style]),
        override ?? {}
      );
    }

    return mergedTheme;
  };
};

export const typographyMixin = (props: ITypographyProps) => {
  const gt = getTheme(props.textStyle ?? 'sm14', props.textTheme);

  return css`
    text-align: ${props.textAlign || 'left'};
    letter-spacing: 0px;
    display: ${props.display
      ? props.display
      : props.textAlign
      ? 'block'
      : 'inline-block'};
    font-size: ${(p) => toEm(gt(p.theme).size)};
    font-weight: ${(p) => gt(p.theme).weight};
    font-family: 'fira sans';
    line-height: ${(p) => toEm(gt(p.theme).height ?? 'normal')};
    color: ${(p) => p.theme.text.colors[props.textColor ?? 'primary']};
    font-style: normal;
    font-variant: normal;
    opacity: ${(p) => gt(p.theme).opacity ?? 1};
    overflow: ${props.clip || props.ellipsis ? 'hidden' : 'initial'};
    text-overflow: ${props.clip
      ? 'clip'
      : props.ellipsis
      ? 'ellipsis'
      : 'initial'};
    white-space: ${props.clip || props.ellipsis || props.nowrap
      ? 'pre'
      : 'pre-wrap'};
    width: ${props.clip || props.ellipsis ? '100%' : 'initial'};
    text-transform: ${props.textTransform ?? 'initial'};
  `;
};
const validateProps = (prop: string) => {
  return ![
    'textColor',
    'textStyle',
    'textTheme',
    'textAlign',
    'ellipsis',
    'nowrap',
    'clip',
    'textTransform',
  ].includes(prop);
};

export const Typography = styled('span').withConfig({
  shouldForwardProp: (prop) => validateProps(prop),
})<ITypographyProps>`
  ${(props) => typographyMixin(props)}
`;
