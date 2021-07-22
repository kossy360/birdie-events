import { renderWithApp } from '../../test/testRenderer';
import Select from '../Select';

describe('Select component', () => {
  it('should render without label', async () => {
    const component = renderWithApp(<Select />);
    const select = component.getByRole('combobox');
    const label = component.queryByRole('label');

    expect(select).toBeDefined();
    expect(label).toBe(null);
  });

  it('should render with label', async () => {
    const component = renderWithApp(<Select label="Test label" />);
    const select = component.getByRole('combobox');

    expect(select).toBeDefined();
    expect(component.getByLabelText(/Test label/)).toBeDefined();
  });
});
