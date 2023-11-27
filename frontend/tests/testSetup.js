import { afterEach, expect } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest expect method with methods from React Testing Library
expect.extend(matchers);

// Run a cleanup after each test case (ie, clear jsdom)
afterEach(() => cleanup());
