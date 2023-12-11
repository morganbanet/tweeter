import { describe, it, expect } from 'vitest';
import authReducer from './authReducer';

const userInfo = {
  name: 'John Doe',
  email: 'johndoe@example.com',
};

describe('authReducer', () => {
  it('sets userInfo when logged in', () => {
    const action = { type: 'LOGIN_USER', payload: userInfo };
    const state = { userInfo: null };

    const newState = authReducer(state, action);

    const expectedState = {
      userInfo: {
        name: 'John Doe',
        email: 'johndoe@example.com',
      },
    };

    expect(newState).toStrictEqual(expectedState);
  });

  it('sets userInfo to null when logged out', () => {
    const action = { type: 'LOGOUT_USER', payload: userInfo };
    const state = { userInfo: userInfo };

    const newState = authReducer(state, action);

    const expectedState = {
      userInfo: null,
    };

    expect(newState).toStrictEqual(expectedState);
  });
});
