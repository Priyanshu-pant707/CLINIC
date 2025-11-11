import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Activity, LogOut } from 'lucide-react';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'super_admin':
        return '/super-admin';
      case 'clinic_admin':
        return '/clinic-admin';
      case 'doctor':
        return '/doctor';
      case 'patient':
        return '/patient';
      default:
        return '/';
    }
  };

  return (
    <nav className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to={getDashboardLink()} className="flex items-center gap-2 text-xl font-semibold text-primary">
          <Activity className="h-6 w-6" />
          <span>ClinicFlow</span>
        </Link>
        
        {user && (
          <div className="flex items-center gap-4">
            <div className="text-sm">
              <p className="font-medium text-foreground">{user.name}</p>
              <p className="text-muted-foreground capitalize">{user.role.replace('_', ' ')}</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}

