import { fireEvent } from '@testing-library/react';
import { renderWithApp } from '../../test/testRenderer';
import Pagination from '../Pagination';

describe('Pagination component', () => {
  it('should render correct pagination values', async () => {
    const onPageChange = jest.fn();
    const component = renderWithApp(
      <Pagination limit={10} page={1} total={30} onPageChange={onPageChange} />
    );
    const previousBtn = component.getByRole('button', { name: /previous/i });
    const nextBtn = component.getByRole('button', { name: /next/i });

    expect(component.getByText(/showing 1\-10 of 30/i)).toBeDefined();
    expect(previousBtn).toBeDisabled();
    expect(nextBtn).toBeEnabled();

    fireEvent.click(nextBtn);

    expect(onPageChange).toBeCalledWith(2);

    onPageChange.mockReset();

    component.rerender(
      <Pagination limit={10} page={2} total={30} onPageChange={onPageChange} />
    );

    expect(component.getByText(/showing 11\-20 of 30/i)).toBeDefined();
    expect(previousBtn).toBeEnabled();
    expect(nextBtn).toBeEnabled();

    fireEvent.click(previousBtn);

    expect(onPageChange).toBeCalledWith(1);

    component.rerender(
      <Pagination limit={10} page={3} total={30} onPageChange={onPageChange} />
    );

    expect(component.getByText(/showing 21\-30 of 30/i)).toBeDefined();
    expect(previousBtn).toBeEnabled();
    expect(nextBtn).toBeDisabled();
  });
});
