import { render } from '@testing-library/react';
import AppProviders from './AppProviders';

const customRender = (ui, options) =>
  render(ui, { wrapper: AppProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
