import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Farmer, Expert } from '../models/types';

// Application state interface
interface AppState {
  // User state
  currentUser: Farmer | null;
  isAuthenticated: boolean;
  
  // UI state
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  
  // Application settings
  location: string;
  notifications: boolean;
  language: string;
  
  // Cache states
  lastDataUpdate: Date | null;
  offlineMode: boolean;
}

// Action types
type AppAction =
  | { type: 'SET_USER'; payload: Farmer | null }
  | { type: 'SET_AUTHENTICATED'; payload: boolean }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_THEME'; payload: 'light' | 'dark' }
  | { type: 'SET_LOCATION'; payload: string }
  | { type: 'SET_NOTIFICATIONS'; payload: boolean }
  | { type: 'SET_LANGUAGE'; payload: string }
  | { type: 'SET_LAST_DATA_UPDATE'; payload: Date }
  | { type: 'SET_OFFLINE_MODE'; payload: boolean }
  | { type: 'RESET_STATE' };

// Initial state
const initialState: AppState = {
  currentUser: null,
  isAuthenticated: false,
  sidebarOpen: false,
  theme: 'light',
  location: 'Bengaluru',
  notifications: true,
  language: 'en',
  lastDataUpdate: null,
  offlineMode: false,
};

// Reducer function
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        currentUser: action.payload,
        isAuthenticated: action.payload !== null,
      };
    
    case 'SET_AUTHENTICATED':
      return {
        ...state,
        isAuthenticated: action.payload,
        currentUser: action.payload ? state.currentUser : null,
      };
    
    case 'TOGGLE_SIDEBAR':
      return {
        ...state,
        sidebarOpen: !state.sidebarOpen,
      };
    
    case 'SET_THEME':
      return {
        ...state,
        theme: action.payload,
      };
    
    case 'SET_LOCATION':
      return {
        ...state,
        location: action.payload,
      };
    
    case 'SET_NOTIFICATIONS':
      return {
        ...state,
        notifications: action.payload,
      };
    
    case 'SET_LANGUAGE':
      return {
        ...state,
        language: action.payload,
      };
    
    case 'SET_LAST_DATA_UPDATE':
      return {
        ...state,
        lastDataUpdate: action.payload,
      };
    
    case 'SET_OFFLINE_MODE':
      return {
        ...state,
        offlineMode: action.payload,
      };
    
    case 'RESET_STATE':
      return initialState;
    
    default:
      return state;
  }
}

// Context interface
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  
  // Convenience methods
  setUser: (user: Farmer | null) => void;
  logout: () => void;
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setLocation: (location: string) => void;
  setNotifications: (enabled: boolean) => void;
  setLanguage: (language: string) => void;
  updateDataTimestamp: () => void;
  setOfflineMode: (offline: boolean) => void;
  
  // Computed values
  isOnline: boolean;
  userDisplayName: string;
  userLocation: string;
}

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps): JSX.Element {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Convenience methods
  const setUser = (user: Farmer | null) => {
    dispatch({ type: 'SET_USER', payload: user });
  };

  const logout = () => {
    dispatch({ type: 'RESET_STATE' });
    // Clear any stored authentication tokens
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
  };

  const toggleSidebar = () => {
    dispatch({ type: 'TOGGLE_SIDEBAR' });
  };

  const setTheme = (theme: 'light' | 'dark') => {
    dispatch({ type: 'SET_THEME', payload: theme });
    // Apply theme to document
    document.documentElement.className = theme;
    localStorage.setItem('theme', theme);
  };

  const setLocation = (location: string) => {
    dispatch({ type: 'SET_LOCATION', payload: location });
    localStorage.setItem('userLocation', location);
  };

  const setNotifications = (enabled: boolean) => {
    dispatch({ type: 'SET_NOTIFICATIONS', payload: enabled });
    localStorage.setItem('notifications', enabled.toString());
  };

  const setLanguage = (language: string) => {
    dispatch({ type: 'SET_LANGUAGE', payload: language });
    localStorage.setItem('language', language);
  };

  const updateDataTimestamp = () => {
    dispatch({ type: 'SET_LAST_DATA_UPDATE', payload: new Date() });
  };

  const setOfflineMode = (offline: boolean) => {
    dispatch({ type: 'SET_OFFLINE_MODE', payload: offline });
  };

  // Computed values
  const isOnline = !state.offlineMode && navigator.onLine;
  const userDisplayName = state.currentUser?.name || 'Guest';
  const userLocation = state.currentUser?.location || state.location;

  // Load persisted state on mount
  React.useEffect(() => {
    // Load theme
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }

    // Load location
    const savedLocation = localStorage.getItem('userLocation');
    if (savedLocation) {
      setLocation(savedLocation);
    }

    // Load notifications setting
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications !== null) {
      setNotifications(savedNotifications === 'true');
    }

    // Load language
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }

    // Check online status
    const handleOnlineStatus = () => {
      setOfflineMode(!navigator.onLine);
    };

    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);

    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  const contextValue: AppContextType = {
    state,
    dispatch,
    setUser,
    logout,
    toggleSidebar,
    setTheme,
    setLocation,
    setNotifications,
    setLanguage,
    updateDataTimestamp,
    setOfflineMode,
    isOnline,
    userDisplayName,
    userLocation,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

// Hook to use the context
export function useAppContext(): AppContextType {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}

// HOC for components that need app context
export function withAppContext<P extends object>(
  Component: React.ComponentType<P>
): React.ComponentType<P> {
  return function WrappedComponent(props: P) {
    return (
      <AppProvider>
        <Component {...props} />
      </AppProvider>
    );
  };
}
