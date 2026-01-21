import React from 'react';
import { Box } from '@mui/material'; 
import SidebarNavigation from '../MUI/SidebarNavigation'; 
import MobileNavigation from './MobileNavigation';

interface ProfileLayoutProps {
  children: React.ReactNode;
  activePage?: string;
}

const ProfileLayout: React.FC<ProfileLayoutProps> = ({ 
  children, 
  activePage = 'profile' 
}) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' }
      }}
    >
      <MobileNavigation />

      <Box
        sx={{
          display: { xs: 'none', md: 'block' }
        }}
      >
        <SidebarNavigation activePage={activePage} />
      </Box>

      <Box
        component="main"
        sx={{
          flex: 1,
          padding: { xs: 2, md: 3 },
          maxWidth: { md: 'calc(100% - 320px)' },
          width: '100%'
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default ProfileLayout;