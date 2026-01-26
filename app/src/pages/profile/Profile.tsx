import { useEffect, useState } from 'react';
import { useAuthStore } from '../../stores/auth.store';
import SidebarNavigation from '../../components/MUI/SidebarNavigation';
import { Button } from '../../components/common/Button';
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Chip,
  TextField,
  InputAdornment,
  CircularProgress,
  Dialog,
  DialogContent,
  Alert,
} from '@mui/material';
import { SquarePen, CircleUser, QrCode } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import ErrorMessage from '../../components/Profile/ErrorMessage';

const SIDEBAR_WIDTH = 80;

const ROLE_LABELS: Record<number, string> = {
  1: 'Administrador',
  2: 'Supervisor',
  3: 'Usuario',
};

const Profile = () => {
  const { user, loading, error } = useAuthStore();

  const [userData, setUserData] = useState({
    nombre: '',
    correo: '',
    cargo: '',
  });

  const [originalData, setOriginalData] = useState({
    nombre: '',
    correo: '',
  });

  const [openQR, setOpenQR] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!user) return;

    const data = {
      nombre: user.name,
      correo: user.email,
      cargo: ROLE_LABELS[user.role] ?? '',
    };

    setUserData(data);
    setOriginalData({
      nombre: data.nombre,
      correo: data.correo,
    });
  }, [user]);

  const isDirty =
    userData.nombre !== originalData.nombre ||
    userData.correo !== originalData.correo;

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSave = async () => {
    setSuccessMsg('');
    setErrorMsg('');

    if (!userData.nombre.trim()) {
      setErrorMsg('El nombre es obligatorio');
      return;
    }

    if (!userData.correo.trim()) {
      setErrorMsg('El correo es obligatorio');
      return;
    }

    if (!isValidEmail(userData.correo)) {
      setErrorMsg('El correo no es válido');
      return;
    }

    try {
      setSaving(true);

      // 👉 Aquí va tu API real
      await new Promise((r) => setTimeout(r, 1000));

      setOriginalData({
        nombre: userData.nombre,
        correo: userData.correo,
      });

      setSuccessMsg('Perfil actualizado correctamente');
    } catch {
      setErrorMsg('Error al actualizar el perfil');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'grey.50' }}>
      <Box sx={{ width: SIDEBAR_WIDTH, flexShrink: 0, display: { xs: 'none', md: 'block' } }}>
        <SidebarNavigation activePage="profile" />
      </Box>

      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <Paper elevation={0} square sx={{ width: '100%', backgroundColor: '#005351' }}>
          <Box sx={{ px: 2.5, py: 2.5 }}>
            <Box component="img" src="/sefil.png" alt="Logo" sx={{ height: 32 }} />
          </Box>
        </Paper>

        <Box sx={{ display: 'flex', height: 'calc(100vh - 80px)', pb: 2 }}>
          {/* PANEL IZQUIERDO */}
          <Box sx={{ width: 420, flexShrink: 0, pr: 2 }}>
            <Paper
              elevation={2}
              sx={{
                p: 2,
                borderRadius: 0,
                width: '100%',
                minHeight: '100%',
                backgroundColor: '#414040',
                color: 'white',
              }}
            >
              <Typography variant="h5" fontWeight={700} mb={4}>
                Mi perfil
              </Typography>

              <Box sx={{ display: 'flex', gap: 3, mb: 4 }}>
                <Avatar sx={{ width: 110, height: 110, bgcolor: '#005351' }}>
                  {userData.nombre.charAt(0)}
                </Avatar>

                <Box>
                  <Typography variant="h6" fontWeight={700}>
                    {userData.nombre}
                  </Typography>
                  <Typography sx={{ color: 'grey.300' }}>
                    {userData.cargo}
                  </Typography>
                  <Chip label="Activo" color="success" size="small" sx={{ mt: 1 }} />
                </Box>
              </Box>

              <Box sx={{ display: 'grid', gap: 3 }}>
                <TextField
                  label="Nombre"
                  fullWidth
                  value={userData.nombre}
                  onChange={(e) => setUserData({ ...userData, nombre: e.target.value })}
                  slotProps={{
                    inputLabel: { style: { color: '#ccc' } },
                    input: {
                      style: { color: 'white' },
                      endAdornment: (
                        <InputAdornment position="end">
                          <SquarePen size={18} color="white" />
                        </InputAdornment>
                      ),
                    },
                  }}
                />

                <TextField
                  label="Correo electrónico"
                  type="email"
                  fullWidth
                  value={userData.correo}
                  onChange={(e) => setUserData({ ...userData, correo: e.target.value })}
                  slotProps={{
                    inputLabel: { style: { color: '#ccc' } },
                    input: { style: { color: 'white' } },
                  }}
                />
              </Box>

              {errorMsg && <Alert severity="error" sx={{ mt: 3 }}>{errorMsg}</Alert>}
              {successMsg && <Alert severity="success" sx={{ mt: 3 }}>{successMsg}</Alert>}

              {/* BOTONES */}
              <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
                <Button
                  onClick={() => setOpenQR(true)}
                  style={{ maxWidth: 260, backgroundColor: '#00ABAB', color: '#fff' }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <QrCode size={16} />
                    Escanear código QR
                  </Box>
                </Button>

                <Button variant="secondary" style={{ maxWidth: 260 }}>
                  Cambiar contraseña
                </Button>

                {isDirty && (
                  <Button onClick={handleSave} disabled={saving} style={{ maxWidth: 260 }}>
                    {saving ? 'Guardando...' : 'Guardar cambios'}
                  </Button>
                )}
              </Box>
            </Paper>
          </Box>

          {/* PANEL DERECHO (INTOCABLE) */}
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', ml: 2 }}>
            <Paper elevation={0} sx={{ width: '100%', height: '100%', position: 'relative', bgcolor: '#ece5dd' }}>
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: `url('/fondo.jpg')`,
                  backgroundSize: '450px 450px',
                  opacity: 0.5,
                }}
              />
              <Box
                sx={{
                  position: 'relative',
                  zIndex: 2,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CircleUser size={180} color="#f2f2f2" />
                <Typography fontWeight={700} fontSize={32} color="#f2f2f2">
                  Perfil
                </Typography>
              </Box>
            </Paper>
          </Box>
        </Box>

        {/* MODAL QR */}
        <Dialog open={openQR} onClose={() => setOpenQR(false)}>
          <DialogContent sx={{ textAlign: 'center', p: 4 }}>
            <Typography fontWeight={700} mb={2}>
              Código QR del usuario
            </Typography>
            <QRCodeCanvas value={userData.correo} size={200} />
            <Button onClick={() => setOpenQR(false)}>Cerrar</Button>
          </DialogContent>
        </Dialog>
      </Box>
    </Box>
  );
};

export default Profile;
