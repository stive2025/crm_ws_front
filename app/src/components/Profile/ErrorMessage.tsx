import { Box, Typography, Button } from '@mui/material';

interface Props {
  message: string;
}

const ErrorMessage = ({ message }: Props) => {
  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
      }}
    >
      <Typography variant="h6" color="error">
        {message}
      </Typography>

      <Button variant="contained" onClick={() => window.location.reload()}>
        Reintentar
      </Button>
    </Box>
  );
};

export default ErrorMessage;
