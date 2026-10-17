import { useEffect, useState } from "react";

export default function Home() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  if (loading)
    return (
      <div className="page home-page">
        <p>Loading...</p>
      </div>
    );
  if (error)
    return (
      <div className="page home-page">
        <p>Error: {error}</p>
      </div>
    );

  return (
    <div className="page home-page">
      <h1>Records</h1>
      {records.length === 0 ? (
        <p>No records found. Add one to get started!</p>
      ) : (
        <ul>
          {records.map((record: any) => (
            <li key={record._id}>
              <strong>{record.name}</strong> - {record.position} ({record.level}
              )
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
