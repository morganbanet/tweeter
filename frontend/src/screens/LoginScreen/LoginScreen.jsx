import { useState } from 'react';
import { useLogin } from '../../hooks/auth/useLogin';

// @todo: add css for login screen

function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { login, isLoading, error } = useLogin();

  const handleSubmit = (e) => {
    e.preventDefault();

    login(email, password);

    setEmail('');
    setPassword('');
  };

  return (
    <form className="login" onSubmit={handleSubmit}>
      <h3>Login</h3>

      <label htmlFor="email">Email: </label>
      <input
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <label htmlFor="password">Password: </label>
      <input
        id="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button disabled={isLoading}>Login</button>

      {error && <div className="error">{error}</div>}
    </form>
  );
}

export default LoginScreen;
