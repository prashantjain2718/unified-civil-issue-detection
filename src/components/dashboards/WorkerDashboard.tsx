import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { CheckCircle2, Map } from 'lucide-react';


interface Task {
  issue_id: number;
  issue_type: string;
  severity: string;
  status: string;
  department_assigned: string;
  image_url_before: string;
  geo_latitude: string;
  geo_longitude: string;
  sla_due_date: string;
}

export default function WorkerDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [resolvingId, setResolvingId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock fetch tasks - in real app would filter by assigned worker
  useEffect(() => {
    fetch('http://localhost:5000/api/issues')
      .then(res => res.json())
      .then(data => {
        setTasks(data.filter((i: Task) => i.status !== 'Resolved')); // Show only active
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch tasks", err);
        setLoading(false);
      });
  }, []);

  const handleResolveClick = (id: number) => {
    setResolvingId(id);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && resolvingId) {
      const file = e.target.files[0];
      await resolveTask(resolvingId, file);
    }
  };

  const resolveTask = async (id: number, file: File) => {
    const formData = new FormData();
    formData.append('image_after', file);
    formData.append('issue_id', id.toString());

    try {
      const response = await fetch('http://localhost:5000/api/resolve_issue', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();

      if (data.resolved) {
        alert("Success! Issue verified and resolved.");
        setTasks(tasks.filter(t => t.issue_id !== id));
      } else {
        alert(`Verification Failed: ${data.message}\nReason: ${data.explanation}`);
      }
    } catch (error) {
      console.error("Error resolving:", error);
      alert("Error submitting resolution.");
    } finally {
      setResolvingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Worker Task Queue</h1>
          <p className="text-slate-500">Prioritized tasks based on SLA urgency.</p>
        </div>
      </div>

      <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold text-slate-800">Assigned Issues</h2>
          {loading && <p>Loading tasks...</p>}
          {tasks.length === 0 && !loading && <p className="text-slate-500">No active tasks assigned.</p>}
          
          {tasks.map((task) => (
            <Card key={task.issue_id} className="border-l-4 border-l-orange-500">
               <CardContent className="p-4 flex flex-col sm:flex-row gap-4">
                  <img 
                    src={task.image_url_before.startsWith('http') ? task.image_url_before : `http://localhost:5000${task.image_url_before}`}
                    className="w-full sm:w-32 h-32 object-cover rounded-md"
                    alt="Issue"
                  />
                  <div className="flex-1">
                     <div className="flex justify-between items-start">
                        <h3 className="font-bold text-lg text-slate-900">{task.issue_type}</h3>
                        <Badge variant="warning">{task.severity}</Badge>
                     </div>
                     <p className="text-sm text-slate-500 mt-1">Due: {new Date(task.sla_due_date).toLocaleString()}</p>
                     <p className="text-sm text-slate-500">Loc: {task.geo_latitude}, {task.geo_longitude}</p>
                     
                     <div className="mt-4 flex gap-2">
                        <Button size="sm" onClick={() => handleResolveClick(task.issue_id)}>
                           <CheckCircle2 className="w-4 h-4 mr-2" />
                           Mark Resolved
                        </Button>
                        <Button size="sm" variant="outline">
                           <Map className="w-4 h-4 mr-2" />
                           View Map
                        </Button>
                     </div>
                  </div>
               </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-4">
           <Card className="bg-slate-50">
              <CardHeader>
                 <CardTitle className="text-sm font-medium uppercase tracking-wide text-slate-500">Map View</CardTitle>
              </CardHeader>
              <CardContent className="h-64 flex items-center justify-center bg-slate-200 rounded-lg m-4">
                  <span className="text-slate-400 flex flex-col items-center">
                      <Map className="w-8 h-8 mb-2" />
                      Map Integration Placeholder
                  </span>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
