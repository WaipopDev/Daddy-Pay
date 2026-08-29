import { render, screen } from '@testing-library/react';
import ButtonSubmit from './ButtonSubmit';

describe('ButtonSubmit', () => {
  it('renders the title when not processing', () => {
    render(<ButtonSubmit isProcess={false} title="Save" />);
    expect(screen.getByRole('button')).toHaveTextContent('Save');
    expect(screen.getByRole('button')).not.toBeDisabled();
  });

  it('shows a processing state and disables the button', () => {
    render(<ButtonSubmit isProcess={true} title="Save" />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent('Process Save...');
  });
});
