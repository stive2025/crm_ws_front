// src/components/common/CustomAlert.tsx
import { Alert, AlertTitle } from '@mui/material';
import type { AlertColor } from '@mui/material';

interface CustomAlertProps {
  severity?: AlertColor; 
  title?: string;
  message: string;
  onClose?: () => void;
  sx?: any;
}

export const CustomAlert = ({ 
  severity = 'error', 
  title,
  message, 
  onClose,
  sx 
}: CustomAlertProps) => {
  return (
    <Alert 
      severity={severity} 
      onClose={onClose}
      sx={{ mt: 2, ...sx }}
    >
      {title && <AlertTitle>{title}</AlertTitle>}
      {message}
    </Alert>
  );
};