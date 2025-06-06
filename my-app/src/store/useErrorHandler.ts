import { useAppDispatch } from '@/store/hook';
import { openModalAlert } from '@/store/features/modalSlice';
import { handleError as handleErrorUtil, ErrorHandlerOptions } from '@/utils/errorHandler';
import { useCallback } from 'react';

export const useErrorHandler = () => {
  const dispatch = useAppDispatch();

  // const handleError = (error: unknown, options?: ErrorHandlerOptions) => {
  //   return handleErrorUtil(error, dispatch, openModalAlert, options);
  // };

  const handleError = useCallback(
    (error: unknown, options?: ErrorHandlerOptions) => {
      return handleErrorUtil(error, dispatch, openModalAlert, options);
    },
    [dispatch]
  );

  return { handleError };
};