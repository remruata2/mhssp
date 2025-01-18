'use client';

interface PageTitleProps {
  title: string;
  subtitle?: string;
}

export default function PageTitle({ title, subtitle }: PageTitleProps) {
  return (
    <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col items-center justify-center text-center">
          <h1 className="text-4xl font-bold tracking-tight">{title}</h1>
          {subtitle && (
            <p className="mt-2 text-lg text-blue-100 max-w-2xl">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
}
