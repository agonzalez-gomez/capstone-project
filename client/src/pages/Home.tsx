import { useEffect, useState } from 'react';
import { fetchRecords } from '../services/api';

export default function Home() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRecords = async () => {
      try {
        setLoading(true);
        const data = await fetchRecords();
        setRecords(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load records');
      } finally {
        setLoading(false);
      }
    };

    loadRecords();
  }, []);

  if (loading) return <div className="page home-page"><p>Loading...</p></div>;
  if (error) return <div className="page home-page"><p>Error: {error}</p></div>;

  return (
    <div className="page home-page">
      <h1>Records</h1>
      {records.length === 0 ? (
        <p>No records found. Add one to get started!</p>
      ) : (
        <ul>
          {records.map((record: any) => (
            <li key={record._id}>
              <strong>{record.name}</strong> - {record.position} ({record.level})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
