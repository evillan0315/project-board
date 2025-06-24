// File: /media/eddie/Data/projects/nestJS/nest-modules/full-stack/frontend/src/contexts/AuthContext.tsx

import { createContext, useContext, createSignal, onMount, type JSX, type Accessor } from 'solid-js';
import { createStore } from 'solid-js/store';
import api, { configureTokenGetter } from '../services/api';

/**
 * Represents the structure of a user object.
 */
interface User {
  /**
   * The user's authentication token.
   */
  token?: string;
  /**
   * The user's name.
   */
  name?: string;
  /**
   * The user's email address.
   */
  email?: string;
  /**
   * The user's role.
   */
  role?: string;
  /**
   * The user's subject identifier (often used in JWTs).
   */
  sub?: string;
  /**
   * The URL of the user's profile image.
   */
  image?: string;
}

/**
 * Defines the structure of the authentication context value.
 */
interface AuthContextValue {
  /**
   * A signal that indicates whether the user is authenticated.
   */
  isAuthenticated: Accessor<boolean>;
  /**
   * A signal that holds the current user object.
   */
  user: Accessor<User>;
  /**
   * A function to log in a user with provided credentials.
   * @param credentials An object containing the user's email and password.
   * @returns A promise that resolves when the login process is complete.
   */
  login: (credentials: { email: string; password: string }) => Promise<void>;
  /**
   * A function to log out the current user.
   */
  logout: () => void;
}

/**
 * Creates a context for authentication.
 */
const AuthContext = createContext<AuthContextValue>();

/**
 * Provides authentication context to its children.
 *
 * This component manages user authentication state, including login, logout, and persistence
 * using localStorage.  It utilizes SolidJS's `createSignal` and `createStore` for reactivity.
 *
 * @param props An object containing the children to be rendered within the AuthProvider.
 * @param props.children The child JSX element(s) that will have access to the authentication context.
 * @returns A JSX element that provides the authentication context to its children.
 */
export const AuthProvider = (props: { children: JSX.Element }) => {
  /**
   * A signal indicating whether the user is authenticated.
   */
  const [isAuthenticated, setIsAuthenticated] = createSignal<boolean>(false);
  /**
   * A store holding the current user object.
   */
  const [user, setUser] = createStore<User>({});

  // 🔄 Sync token to API service
  /**
   * Configures the API service to retrieve the authentication token.
   * It first checks if the token exists in the user store; if not, it retrieves it from localStorage.
   */
  configureTokenGetter(() => user.token || localStorage.getItem('token'));

  // 🔁 Restore session from localStorage
  /**
   * Restores the user's session from localStorage on component mount.
   * It retrieves the token and user data from localStorage and updates the state.
   * If parsing the saved user data fails, it logs a warning and removes the data from localStorage.
   */
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
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  });

  // 🔐 Login and store token + user
  /**
   * Logs in a user with the provided credentials.
   * @param credentials An object containing the user's email and password.
   * @returns A promise that resolves when the login process is complete.
   * @throws An error if the login request fails.
   */
  const login = async (credentials: { email: string; password: string }) => {
    const response = await api.post('/auth/login', credentials);
    if (!response.data) throw new Error('Login failed');

    const { accessToken, user: userData } = await response.data;

    setUser({ ...userData, token: accessToken });
    setIsAuthenticated(true);

    localStorage.setItem('token', accessToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // 🚪 Logout and clear session
  /**
   * Logs out the current user, clearing the user data and token from the state and localStorage.
   */
  const logout = () => {
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

/**
 * A hook that provides access to the authentication context.
 *
 * @returns The authentication context value, containing authentication status, user data, login function, and logout function.
 * @throws An error if the hook is used outside of an AuthProvider.
 */
export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
