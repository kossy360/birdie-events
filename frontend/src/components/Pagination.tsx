import chevronLeftIcon from '@iconify-icons/feather/chevron-left';
import chevronRightIcon from '@iconify-icons/feather/chevron-right';
import Icon from '@iconify/react';
import styled, { useTheme } from 'styled-components';
import { Typography } from './Typography';

const PaginationContainer = styled.div`
  display: flex;
  align-items: center;

  .buttonsWrapper {
    display: grid;
    align-items: center;
    margin-right: 10px;
    grid-auto-flow: column;
    gap: 5px;
  }
`;

const PaginationButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border: none;
  outline: none;
  background: none;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

interface PaginationProps {
  limit: number;
  total: number;
  page: number;
  onPageChange: (page: number) => void;
}

const Pagination = (props: PaginationProps) => {
  const theme = useTheme();
  const { limit, total, page, onPageChange } = props;

  return (
    <PaginationContainer>
      <div className="buttonsWrapper">
        <PaginationButton
          role="button"
          aria-label="previous"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
        >
          <Icon icon={chevronLeftIcon} color={theme.text.colors.primary} />
        </PaginationButton>
        <PaginationButton
          role="button"
          aria-label="next"
          disabled={limit * page >= total}
          onClick={() => onPageChange(page + 1)}
        >
          <Icon icon={chevronRightIcon} color={theme.text.colors.primary} />
        </PaginationButton>
      </div>
      <Typography textStyle="sm14">
        Showing {page * limit - limit + 1}-
        {page * limit > total ? total : page * limit} of {total}
      </Typography>
    </PaginationContainer>
  );
};

export default Pagination;
