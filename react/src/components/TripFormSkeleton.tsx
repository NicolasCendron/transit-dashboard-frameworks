export default function TripFormSkeleton() {
  return (
    <div className="card">
      {[0, 1, 2].map(row => (
        <div className="form-row" key={row}>
          {[0, 1].map(col => (
            <div className="form-group" key={col}>
              <div className="skeleton skeleton-text" style={{ width: 90, height: 13, marginBottom: 8 }} />
              <div className="skeleton skeleton-text" style={{ height: 38, borderRadius: 6 }} />
            </div>
          ))}
        </div>
      ))}
      <div className="form-group">
        <div className="skeleton skeleton-text" style={{ width: 60, height: 13, marginBottom: 8 }} />
        <div className="skeleton skeleton-text" style={{ height: 38, borderRadius: 6 }} />
      </div>
      <div className="flex gap-1 mt-3">
        <div className="skeleton skeleton-text" style={{ width: 80, height: 36, borderRadius: 6 }} />
        <div className="skeleton skeleton-text" style={{ width: 80, height: 36, borderRadius: 6 }} />
      </div>
    </div>
  );
}
