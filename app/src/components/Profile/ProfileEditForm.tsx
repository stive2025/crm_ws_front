import { useState } from 'react';
import { useUserStore } from '../../stores/user.store';
import { updateUserProfile } from '../../services/api';
import { toast } from 'react-toastify';
import { Input } from '../common/Input';
import { Button } from '../common/Button';

const ProfileEditForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const { user, setUser } = useUserStore();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('El nombre es requerido');
      return;
    }

    if (!email.trim()) {
      toast.error('El correo es requerido');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      toast.error('El correo parece inválido');
      return;
    }

    if (!user) {
      toast.error('No hay usuario autenticado');
      return;
    }

    setLoading(true);

    try {
      const updated = await updateUserProfile({ name, email });

      setUser({
        ...user,
        name: updated.name,
        email: updated.email,
      });

      toast.success('Perfil actualizado correctamente');
      onSuccess();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Error al actualizar el perfil';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <Input
        label="Correo"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <Button type="submit" disabled={loading}>
        {loading ? 'Guardando...' : 'Guardar cambios'}
      </Button>
    </form>
  );
};

export default ProfileEditForm;
