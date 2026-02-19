const DETAIL_FIELDS_COUNT = 7; // origin, destination, departure, arrival, status, duration, driver

export default function TripDetailsSkeleton() {
  return (
    <div className="card">
      <div className="detail-grid">
        {Array.from({ length: DETAIL_FIELDS_COUNT }).map((_, i) => (
          <div className="detail-item" key={i}>
            <div className="skeleton skeleton-text" style={{ width: 80, height: 14, marginBottom: 8 }} />
            <div className="skeleton skeleton-text" style={{ width: 180, height: 16 }} />
          </div>
        ))}
      </div>
    </div>
  );
}
