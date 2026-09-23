import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuditTool from '@/components/AuditTool';

export const metadata = {
  title: 'Free Digital Audit | EduGraphix Lab',
  description: 'Get a comprehensive digital readiness audit for your school or educational institution.',
};

export default function AuditPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-24">
        <AuditTool />
      </div>
      <Footer />
    </main>
  );
}
