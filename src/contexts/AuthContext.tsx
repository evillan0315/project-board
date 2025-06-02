// src/contexts/AuthContext.ts
import { createContext, useContext, createSignal, onMount, type JSX, type Accessor } from 'solid-js';
import { createStore } from 'solid-js/store';
import api from '../services/api';

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
    const response = await api.post('/auth/login', credentials);
    if (!response.data) throw new Error('Login failed');
    const data = await response.data;
    localStorage.setItem('token', data.accessToken);
    const userData = await data.user;
    setUser({ ...data, token: data.accessToken });
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
    //return { accessToken: data.accessToken };
  };

  const logout = async () => {
    /*const response = await api.post('/auth/login');
    const logoutResponse = await fetch('http://localhost:5000/api/auth/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    if (!logoutResponse.ok) throw new Error('Failed to logout user');
*/
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
