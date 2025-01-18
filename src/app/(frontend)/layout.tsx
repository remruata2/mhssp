import Navbar from '@/components/layout/Navbar';
import ClientLayout from '@/components/layout/ClientLayout';

export default async function FrontendLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <>
      <Navbar />
      <ClientLayout>{children}</ClientLayout>
    </>
  );
}
