import type { Metadata } from 'next';
import '../globals.css';

export const metadata: Metadata = {
  title: 'Task Tracker',
  description: 'Track your tasks',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-gray-100">
      <body className="max-w-lg bg-white min-h-screen  mx-auto">
        <section className="bg-blue-800">
          <nav className="h-[60px] flex items-center pl-4">
            <p className='text-xl text-white font-semibold'>TASK TRACKER</p>
          </nav>
        </section>
        <main className="">{children}</main>
      </body>
    </html>
  );
}
