// File: /media/eddie/Data/projects/nestJS/nest-modules/full-stack/frontend/src/components/SignInWithGoogle.tsx

import { createSignal, onMount } from 'solid-js';
import { Icon } from '@iconify-icon/solid';
import { Button } from './ui/Button';
// This should ideally be handled by your backend.
// The REDIRECT_URI is where Google sends the user *after* authentication.
// Your backend at REDIRECT_URI will then redirect back to your frontend
// with a token/user info.
const GOOGLE_AUTH_URL = import.meta.env.GOOGLE_CALLBACK_URL; // Assuming you have an env var for your backend's Google auth initiation URL

/**
 * Represents the payload returned after a successful sign-in with Google.
 */
interface SignInSuccessCallbackPayload {
  /**
   * The access token received from the backend after successful Google authentication.
   */
  accessToken: string;
  /**
   * The user information retrieved from the backend.
   */
  user?: {
    /**
     * The unique identifier of the user.
     */
    id: string;
    /**
     * The email address of the user.
     */
    email: string;
    /**
     * The name of the user (optional).
     */
    name?: string;
    /**
     * The URL of the user's profile image (optional).
     */
    image?: string;
    /**
     * The role of the user (optional).
     */
    role?: string;
    // ... other user details you get from your backend
  };
}

/**
 * Defines the properties for the `SignInWithGoogle` component.
 */
interface SignInWithGoogleProps {
  /**
   * A callback function to be executed upon successful sign-in with Google.
   * It receives a `SignInSuccessCallbackPayload` object containing the access token and user information.
   */
  onLoginSuccess?: (payload: SignInSuccessCallbackPayload) => void;
  /**
   * A callback function to be executed when an error occurs during the sign-in process.
   * It receives an `Error` object containing information about the error.
   */
  onLoginError?: (error: Error) => void;
}

/**
 * A component that provides a button to initiate sign-in with Google.
 *
 * This component relies on a backend service to handle the Google OAuth flow.  It directs the user to a backend endpoint,
 * which redirects to Google for authentication.  After successful authentication, Google redirects back to the backend,
 * and the backend then redirects to the frontend with user data and an access token via URL parameters.
 *
 * @param props - The properties for the component, including optional success and error callbacks.
 * @returns A JSX element representing the sign-in with Google button.
 */
export default function SignInWithGoogle(props: SignInWithGoogleProps) {
  /**
   * A signal that holds the URL to initiate the Google OAuth flow on the backend.
   */
  const [loginUrl, setLoginUrl] = createSignal('');

  onMount(() => {
    // This URL should point to your backend's endpoint that initiates the Google OAuth flow.
    // Your backend will then redirect to Google's authentication page.
    if (GOOGLE_AUTH_URL) {
      setLoginUrl(GOOGLE_AUTH_URL);
    }

    // This part handles the callback *from your backend* after successful Google login.
    // Your backend should redirect to a specific frontend route (e.g., /auth/callback)
    // with query parameters containing the authentication token and user info.
    const handleGoogleCallback = () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('accessToken'); // Assuming your backend sends a 'token'
      const userId = params.get('userId');
      const userEmail = params.get('userEmail');
      const userName = params.get('userName');
      const userRole = params.get('userRole');
      const userImage = params.get('userImage');
      if (token && userId && userEmail) {
        const user = { id: userId, email: userEmail, name: userName, image: userImage, role: userRole || undefined };
        const payload: SignInSuccessCallbackPayload = { accessToken: token };

        // Save to localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        // Call the provided success callback
        props.onLoginSuccess?.(payload);

        // Optional: Clean up URL parameters
        // Remove the query parameters from the URL history
        window.history.replaceState({}, document.title, window.location.pathname);
        window.location.reload();
      } else if (params.get('error')) {
        const errorMessage = params.get('error_description') || 'Google login failed.';
        props.onLoginError?.(new Error(errorMessage));
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    };

    // You might want to run this only on a specific callback route
    // For simplicity, running it on every mount for demonstration.
    // In a real app, you'd likely have a dedicated route component for /auth/callback.
    handleGoogleCallback();
  });

  /**
   * Initiates the Google login flow by redirecting the user to the backend's authentication URL.
   */
  const initiateLogin = () => {
    if (loginUrl()) {
      window.location.href = loginUrl();
    } else {
      console.error('Google auth URL not configured.');
      props.onLoginError?.(new Error('Google authentication URL is not set.'));
    }
  };

  return (
    <Button
      onClick={initiateLogin}
      class="w-full flex items-center gap-2 justify-center p-3 text-white bg-neutral-900 rounded-md hover:bg-neutral-800 mt-4"
    >
      <Icon icon="flat-color-icons:google" width="20" height="20" /> Sign in with Google
    </Button>
  );
}
