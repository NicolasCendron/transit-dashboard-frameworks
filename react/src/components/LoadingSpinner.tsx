export default function LoadingSpinner({ message }: { message?: string }) {
  return (
    <div className="loading">
      <div className="spinner" />
      {message}
    </div>
  );
}
