import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Camera, MapPin, CheckCircle, Shield } from 'lucide-react';

export const Landing = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 py-20 sm:py-32">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=2613&auto=format&fit=crop')] bg-cover bg-center opacity-10" />
        <div className="container relative mx-auto px-4 text-center">
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
            Empowering Citizens, <br className="hidden sm:block" />
            <span className="text-blue-500">Building Better Cities</span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-slate-300">
            A unified platform to report civic issues, track their resolution, and ensure community accountability through AI-powered detection.
          </p>
            <div className="flex gap-4 mt-8 justify-center">
               <Link to="/auth">
                  <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">Login to Dashboard</Button>
               </Link>
            </div>
          
          <div className="mt-8 text-sm text-slate-400">
             <span className="opacity-70">Testing/Prototype Access:</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3">
            <FeatureCard
              icon={<Camera className="h-8 w-8 text-blue-500" />}
              title="AI-Powered Reporting"
              description="Simply upload a photo. Our AI automatically detects the issue type and routes it to the correct department."
            />
            <FeatureCard
              icon={<MapPin className="h-8 w-8 text-emerald-500" />}
              title="Geo-Tagging"
              description="Precise location tracking ensures field workers find and resolve the problem without delay."
            />
            <FeatureCard
              icon={<CheckCircle className="h-8 w-8 text-amber-500" />}
              title="Real-time Tracking"
              description="Monitor the status of your report from submission to resolution with full transparency."
            />
          </div>
        </div>
      </section>
    </div>
  );
};

// Internal sub-component for this page
const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-8 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
      {icon}
    </div>
    <h3 className="mb-3 text-xl font-bold text-slate-900">{title}</h3>
    <p className="text-slate-600">{description}</p>
  </div>
);
