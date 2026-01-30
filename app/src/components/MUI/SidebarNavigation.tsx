import React, { useState } from 'react';
import {
  Box,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button as MuiButton,
} from '@mui/material';
import { MessageSquare, CircleUser, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/auth.store';

interface SidebarNavigationProps {
  activePage?: string;
}

const SidebarNavigation: React.FC<SidebarNavigationProps> = ({ activePage = 'profile' }) => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

  const primaryColor = '#005351';

  const handleLogoutClick = () => {
    setOpenLogoutDialog(true);
  };

  const handleLogoutConfirm = () => {
    setOpenLogoutDialog(false);
    logout();
  };

  const handleLogoutCancel = () => {
    setOpenLogoutDialog(false);
  };

  return (
    <>
      <Paper 
        elevation={4}
        sx={{
          width: 80,
          height: '100vh',     
          borderRadius: 0,             
          backgroundColor: primaryColor,
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          borderRight: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        {/* HEADER / LOGO */}
        <Box
          sx={{
            py: 2,
            background: `linear-gradient(135deg, ${primaryColor} 0%, #003837 100%)`,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <img 
            src="/loguito.png" 
            alt="Logo"
            style={{
              width: 44,
              height: 44,
              objectFit: 'contain',
            }}
          />
        </Box>

        {/* NAVEGACIÓN PRINCIPAL */}
        <Box
          sx={{
            flex: 1,                
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            pt: 2,
          }}
        >
          <List sx={{ p: 0, width: '100%' }}>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => navigate('/chats')}
                selected={activePage === 'chats'}
                sx={{
                  borderRadius: 2,
                  py: 2,
                  minHeight: 56,
                  justifyContent: 'center',
                  mx: 1,
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(255,255,255,0.18)',
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.10)',
                  },
                }}
              >
                <ListItemIcon sx={{ 
                  minWidth: 'auto',
                  color: activePage === 'chats'
                    ? 'white'
                    : 'rgba(255,255,255,0.7)',
                }}>
                  <MessageSquare size={28} />
                </ListItemIcon>
              </ListItemButton>
            </ListItem>
          </List>
        </Box>

        <Box sx={{ px: 2, pb: 1 }}>
          <ListItemButton
            onClick={() => navigate('/profile')}
            selected={activePage === 'profile'}
            sx={{
              borderRadius: 2,
              py: 2,
              minHeight: 56,
              justifyContent: 'center',
              '&.Mui-selected': {
                backgroundColor: 'rgba(255,255,255,0.18)',
              },
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.10)',
              },
            }}
          >
            <ListItemIcon sx={{ 
              minWidth: 'auto',
              color: activePage === 'profile'
                ? 'white'
                : 'rgba(255,255,255,0.7)',
            }}>
              <CircleUser size={28} />
            </ListItemIcon>
          </ListItemButton>
        </Box>

        <Box
          sx={{
            p: 2,
            borderTop: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <ListItemButton
            onClick={handleLogoutClick}
            sx={{
              borderRadius: 2,
              py: 2,
              minHeight: 56,
              justifyContent: 'center',
              backgroundColor: 'rgba(255,69,0,0.18)',
              '&:hover': {
                backgroundColor: 'rgba(255,69,0,0.28)',
              },
            }}
          >
            <ListItemIcon sx={{ 
              minWidth: 'auto',
              color: '#ff8c00',
            }}>
              <LogOut size={28} />
            </ListItemIcon>
          </ListItemButton>
        </Box>
      </Paper>

      <Dialog 
        open={openLogoutDialog} 
        onClose={handleLogoutCancel}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          Cerrar sesión
        </DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que quieres cerrar la sesión?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <MuiButton 
            onClick={handleLogoutCancel}
            variant="outlined"
            color="error"              
            sx={{ minWidth: 100 }}
          >
            Cancelar
          </MuiButton>
          <MuiButton 
            onClick={handleLogoutConfirm}
            variant="contained"
            color="success"           
            sx={{ minWidth: 100 }}
          >
            Aceptar
          </MuiButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SidebarNavigation;