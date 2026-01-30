// src/components/Profile/ErrorMessage.tsx
import { Alert, Snackbar, IconButton } from '@mui/material';
import { useErrorStore } from '../../stores/error.store';
import { X, RefreshCw } from 'lucide-react';

const ErrorMessage = () => {
  const { error, retryAction, clearError } = useErrorStore();

  const handleRetry = () => {
    if (retryAction) {
      clearError();
      retryAction();
    }
  };

  return (
    <Snackbar
      open={!!error}
      autoHideDuration={6000}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      onClose={clearError}
      sx={{ mt: 2 }}
    >
      <Alert
        severity="error"
        variant="filled"
        onClose={clearError}
        sx={{
          width: '100%',
          minWidth: 400,
          boxShadow: 3,
          '& .MuiAlert-message': {
            flex: 1,
          },
        }}
        action={
          <>
            {retryAction && (
              <IconButton
                size="small"
                color="inherit"
                onClick={handleRetry}
                sx={{ mr: 1 }}
                title="Reintentar"
              >
                <RefreshCw size={18} />
              </IconButton>
            )}
            <IconButton
              size="small"
              color="inherit"
              onClick={clearError}
              title="Cerrar"
            >
              <X size={18} />
            </IconButton>
          </>
        }
      >
        <strong>Error:</strong> {error?.message}
      </Alert>
    </Snackbar>
  );
};

export default ErrorMessage;