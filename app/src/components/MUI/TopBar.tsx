import { Box, Paper } from '@mui/material';

const TopBar = () => {
  return (
    <Paper
      elevation={0}
      square
      sx={{
        width: '100%',
        backgroundColor: '#005351',
      }}
    >
      <Box sx={{ px: 2.5, py: 2.5 }}>
        <Box
          component="img"
          src="/sefil.png"
          alt="Logo"
          sx={{ height: 32 }}
        />
      </Box>
    </Paper>
  );
};

export default TopBar;
