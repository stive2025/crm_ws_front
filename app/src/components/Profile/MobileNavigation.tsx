import React, { useState } from 'react';
import {
  Drawer,
  IconButton
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SidebarNavigation from '../MUI/SidebarNavigation';

const MobileNavigation: React.FC = () => {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  return (
    <>
      <IconButton
        onClick={toggleDrawer(true)}
        sx={{
          position: 'fixed',
          top: 16,
          left: 16,
          zIndex: 1200,
          backgroundColor: '#005351',
          color: 'white',
          '&:hover': {
            backgroundColor: '#00403e'
          },
          display: { md: 'none' }
        }}
      >
        <MenuIcon />
      </IconButton>

      <Drawer
        anchor="left"
        open={open}
        onClose={toggleDrawer(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: 280,
            border: 'none',
            boxSizing: 'border-box'
          }
        }}
      >
        <SidebarNavigation />
      </Drawer>
    </>
  );
};

export default MobileNavigation;