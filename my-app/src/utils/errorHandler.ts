import axios from 'axios';

export interface ErrorHandlerOptions {
  showAlert?: boolean;
  logToConsole?: boolean;
  customMessage?: string;
}

// Define the Alert type locally to avoid circular dependencies
interface Alert {
  show?: boolean;
  title?: string | null;
  message: string | null;
  redirectTo?: string | null;
  callbackPath?: string | null;
}

// Define the Redux action creator type
interface ActionCreatorWithPayload<P, T extends string> {
  (payload: P): {
    payload: P;
    type: T;
  };
  type: T;
}

export const getErrorMessage = (error: unknown, options: ErrorHandlerOptions = {}): string => {
  const { customMessage } = options;
  
  if (customMessage) {
    return customMessage;
  }
  
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message || 'An error occurred';
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unknown error occurred';
};

export const handleError = (
  error: unknown, 
  dispatch: (action: { type: string; payload?: unknown }) => void, 
  openModalAlert: ActionCreatorWithPayload<Alert, "modal/openModalAlert">, 
  options: ErrorHandlerOptions = {}
): string => {
  const { showAlert = true, logToConsole = true } = options;
  const errorMessage = getErrorMessage(error, options);
  
  if (logToConsole) {
    console.log("🚀 ~ Error:", errorMessage);
    if (axios.isAxiosError(error)) {
      console.log("🚀 ~ Full Error:", error.response?.data || error);
    }
  }
  
  if (showAlert && dispatch && openModalAlert) {
    dispatch(openModalAlert({ 
      message: errorMessage, 
      title: "Alert Message" 
    }));
  }
  
  return errorMessage;
};