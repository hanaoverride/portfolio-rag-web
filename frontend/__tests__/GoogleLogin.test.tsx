import React from 'react';
import { render } from '@testing-library/react';
import { GoogleLogin } from '@react-oauth/google';

// Mock GoogleLogin to verify rendering
vi.mock('@react-oauth/google', () => ({
  GoogleLogin: (props: any) => <div data-testid="google-login" {...props} />,
}));

describe('GoogleLogin integration', () => {
  it('renders GoogleLogin component', () => {
    const { getByTestId } = render(<GoogleLogin onSuccess={() => {}} onError={() => {}} />);
    expect(getByTestId('google-login')).toBeInTheDocument();
  });
});
