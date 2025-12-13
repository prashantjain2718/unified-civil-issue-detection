import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Layout } from './layout';
import { Landing } from '@/pages/Landing';
import { ReportIssue } from '@/pages/ReportIssue';
import { IssuesPage } from '@/pages/Issues';
import { Dashboard } from '@/pages/Dashboard';
import { AuthPage } from '@/pages/Auth';
import ClientDashboard from '@/components/dashboards/ClientDashboard';
import WorkerDashboard from '@/components/dashboards/WorkerDashboard';
import AdminDashboard from '@/components/dashboards/AdminDashboard';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Landing />,
      },
      {
        path: 'report',
        element: <ReportIssue />,
      },
      {
        path: 'issues',
        element: <IssuesPage />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'client',
        element: <ClientDashboard />,
      },
      {
        path: 'worker',
        element: <WorkerDashboard />,
      },
      {
        path: 'admin',
        element: <AdminDashboard />,
      },
      {
        path: 'auth',
        element: <AuthPage />,
      },
    ],
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
