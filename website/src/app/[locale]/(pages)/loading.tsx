import LoadingSpinner from '@/components/LoadingSpinner';

export default function PagesLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-cream-bg">
      <div className="flex flex-col items-center space-y-4">
        <LoadingSpinner size="lg" />
        <p className="text-gray-600">Loading page...</p>
      </div>
    </div>
  );
}
