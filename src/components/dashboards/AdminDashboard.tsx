import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { BarChart, AlertCircle, CheckCircle } from 'lucide-react';

interface Stats {
  total: number;
  resolved: number;
  open: number;
  highPriority: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ total: 0, resolved: 0, open: 0, highPriority: 0 });

  useEffect(() => {
    fetch('http://localhost:5000/api/issues')
      .then(res => res.json())
      .then(data => {
        const total = data.length;
        const resolved = data.filter((i: any) => i.status === 'Resolved').length;
        const highPriority = data.filter((i: any) => i.severity === 'High').length;
        setStats({
          total,
          resolved,
          open: total - resolved,
          highPriority
        });
      })
      .catch(console.error);
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">City Health Dashboard</h1>
        <p className="text-slate-500">Overview of civic issues, resolution rates, and department performance.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Issues</CardTitle>
            <BarChart className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-slate-500">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
            <p className="text-xs text-slate-500">{(stats.total > 0 ? (stats.resolved / stats.total * 100).toFixed(1) : 0)}% resolution rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Issues</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.open}</div>
            <p className="text-xs text-slate-500">Active attention needed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Severity</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.highPriority}</div>
            <p className="text-xs text-slate-500">Requires immediate action</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Issue Heatmap</CardTitle>
            <CardDescription>Geographic distribution of reported issues.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
             <div className="h-[300px] w-full bg-slate-100 rounded flex items-center justify-center text-slate-400">
                Heatmap Visualization Placeholder
             </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Department Performance</CardTitle>
            <CardDescription>SLA Compliance by Department</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
               {['PWD', 'Nagar Nigam', 'PHED', 'Electricity'].map(dept => (
                 <div key={dept} className="flex items-center">
                    <div className="w-24 text-sm font-medium text-slate-600">{dept}</div>
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                       <div className="h-full bg-blue-500" style={{ width: `${Math.random() * 40 + 60}%` }}></div>
                    </div>
                    <div className="w-12 text-right text-xs text-slate-500">{(Math.random() * 20 + 80).toFixed(0)}%</div>
                 </div>
               ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
