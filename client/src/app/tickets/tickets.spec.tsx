import { render } from '@testing-library/react';

import Tickets from './tickets';

describe('Tickets', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Tickets />);
    expect(baseElement).toBeTruthy();
  });

  it('renders the component with the correct title', () => {
    const { getByText } = render(<Tickets />);
    expect(getByText('Tickets')).toBeInTheDocument();
  });
});
