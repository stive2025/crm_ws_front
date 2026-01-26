import { useUserStore } from '../../stores/user.store';
import { Loader } from '../common/Loader';
import ErrorMessage from '../Profile/ErrorMessage';

const ProfileInfo = () => {
  const { user, isLoading, error } = useUserStore();

  if (isLoading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  if (!user) return null;

  return (
    <div className="profile-info flex flex-col items-center">
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <p>Rol: {user.role}</p>
    </div>
  );
};

export default ProfileInfo;
