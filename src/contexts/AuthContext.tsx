// src/contexts/AuthContext.ts
import {
  createContext,
  useContext,
  createSignal,
  onMount,
  type JSX,
  type Accessor,
} from 'solid-js';
import { createStore } from 'solid-js/store';
import { useNavigate } from '@solidjs/router';
interface User {
  token?: string;
  name?: string;
  email?: string;
  role?: string;
  sub?: string;
}

interface AuthContextValue {
  isAuthenticated: Accessor<boolean>;
  user: Accessor<User>;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue>();

export const AuthProvider = (props: { children: JSX.Element }) => {
  const [isAuthenticated, setIsAuthenticated] = createSignal<boolean>(false);
  const [user, setUser] = createStore<User>({});
  
  // Restore session on mount
  onMount(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (token && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser({ ...parsedUser, token });
        setIsAuthenticated(true);
      } catch {
        console.warn('Failed to parse saved user');
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
  });

  const login = async (credentials: { email: string; password: string }) => {
    const response = await fetch('https://board-api.duckdns.org/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(credentials),
    });

    if (!response.ok) throw new Error('Login failed');

    const data = await response.json();
    localStorage.setItem('token', data.accessToken);

    const userResponse = await fetch('https://board-api.duckdns.org/api/auth/me', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${data.accessToken}`,
      },
      credentials: 'include',
    });

    if (!userResponse.ok) throw new Error('Failed to fetch user');

    const userData = await userResponse.json();
    setUser({ ...userData, token: data.accessToken });
    localStorage.setItem('user', JSON.stringify(userData));

    setIsAuthenticated(true);
    return {accessToken: data.accessToken}
  };

  const logout = async () => {
    const logoutResponse = await fetch('https://board-api.duckdns.org/api/auth/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    });
    if (!logoutResponse.ok) throw new Error('Failed to logout user');

    //const userData = await userResponse.json();
    setUser({});
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user: () => user, login, logout }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};

