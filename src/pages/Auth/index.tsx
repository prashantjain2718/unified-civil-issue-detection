import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { Shield, User, HardHat } from 'lucide-react';

export const AuthPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = (role: 'CITIZEN' | 'WORKER' | 'ADMIN', redirectPath: string) => {
    login(role);
    navigate(redirectPath);
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-50 px-4 py-12">
      <Card className="w-full max-w-md shadow-lg border-slate-200">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>Select your role to sign in (Demo Mode)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            variant="outline" 
            className="w-full h-16 justify-start px-6 text-lg hover:bg-blue-50 hover:border-blue-200"
            onClick={() => handleLogin('CITIZEN', '/client')}
          >
            <User className="mr-4 h-6 w-6 text-blue-500" />
            <div className="flex flex-col items-start">
               <span className="font-semibold text-slate-900">Citizen</span>
               <span className="text-xs text-slate-500 font-normal">Report and track issues</span>
            </div>
          </Button>

          <Button 
            variant="outline" 
            className="w-full h-16 justify-start px-6 text-lg hover:bg-orange-50 hover:border-orange-200"
            onClick={() => handleLogin('WORKER', '/worker')}
          >
            <HardHat className="mr-4 h-6 w-6 text-orange-500" />
            <div className="flex flex-col items-start">
               <span className="font-semibold text-slate-900">Field Worker</span>
               <span className="text-xs text-slate-500 font-normal">Resolve assigned tasks</span>
            </div>
          </Button>

          <Button 
            variant="outline" 
            className="w-full h-16 justify-start px-6 text-lg hover:bg-slate-50 hover:border-slate-300"
            onClick={() => handleLogin('ADMIN', '/admin')}
          >
            <Shield className="mr-4 h-6 w-6 text-slate-700" />
            <div className="flex flex-col items-start">
               <span className="font-semibold text-slate-900">Admin</span>
               <span className="text-xs text-slate-500 font-normal">City health & analytics</span>
            </div>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
