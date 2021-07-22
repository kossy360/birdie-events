import React, { SelectHTMLAttributes } from 'react';
import styled from 'styled-components';
import { Typography, typographyMixin } from './Typography';

const Container = styled.div`
  width: 100%;
  .label {
    margin-bottom: 5px;
  }
`;

const StyledSelect = styled.select`
  padding: 5px;
  border-radius: 4px;
  background: none;
  border: 1px solid black;
  ${typographyMixin({ textStyle: 'sm16' })}
  width: 100%;
`;

interface ISelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

const Select = (props: ISelectProps) => {
  const { label, className, ...restProps } = props;

  return (
    <Container className={className}>
      {label && (
        <Typography
          id="select-label"
          className="label"
          as="label"
          display="block"
        >
          {label}
        </Typography>
      )}
      <StyledSelect aria-labelledby="select-label" {...restProps} />
    </Container>
  );
};

export default Select;
