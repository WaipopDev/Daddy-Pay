import { useAppDispatch } from '@/store/hook';
import { openModalAlert } from '@/store/features/modalSlice';
import { handleError as handleErrorUtil, ErrorHandlerOptions } from '@/utils/errorHandler';

export const useErrorHandler = () => {
  const dispatch = useAppDispatch();

  const handleError = (error: unknown, options?: ErrorHandlerOptions) => {
    return handleErrorUtil(error, dispatch, openModalAlert, options);
  };

  return { handleError };
};