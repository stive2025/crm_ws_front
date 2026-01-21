import { Box, Paper, Skeleton } from '@mui/material';

const ProfileSkeleton = () => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'grey.50' }}>
      {/* Sidebar placeholder */}
      <Box sx={{ width: 80 }} />

      <Box sx={{ flexGrow: 1 }}>
        {/* Header */}
        <Paper elevation={0} square sx={{ width: '100%', height: 80 }} />

        <Box sx={{ display: 'flex', height: 'calc(100vh - 80px)', p: 2 }}>
          {/* Panel izquierdo */}
          <Paper
            sx={{
              width: 420,
              p: 2,
              backgroundColor: '#414040',
            }}
          >
            <Skeleton variant="text" width={120} height={40} />
            <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
              <Skeleton variant="circular" width={110} height={110} />
              <Box sx={{ flexGrow: 1 }}>
                <Skeleton variant="text" width="80%" />
                <Skeleton variant="text" width="60%" />
              </Box>
            </Box>

            <Box sx={{ mt: 4 }}>
              <Skeleton variant="rectangular" height={56} sx={{ mb: 2 }} />
              <Skeleton variant="rectangular" height={56} />
            </Box>

            <Box sx={{ mt: 4 }}>
              <Skeleton variant="rectangular" height={40} sx={{ mb: 2 }} />
              <Skeleton variant="rectangular" height={40} sx={{ mb: 2 }} />
              <Skeleton variant="rectangular" height={40} />
            </Box>
          </Paper>

          {/* Panel derecho */}
          <Box sx={{ flexGrow: 1, ml: 2 }}>
            <Skeleton variant="rectangular" height="100%" />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ProfileSkeleton;
