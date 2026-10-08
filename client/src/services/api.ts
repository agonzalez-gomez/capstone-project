const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050';

export async function fetchRecords() {
  const response = await fetch(`${API_URL}/record`);
  if (!response.ok) throw new Error('Failed to fetch records');
  return response.json();
}

export async function fetchRecordById(id: string) {
  const response = await fetch(`${API_URL}/record/${id}`);
  if (!response.ok) throw new Error('Failed to fetch record');
  return response.json();
}

export async function createRecord(data: { name: string; position: string; level: string }) {
  const response = await fetch(`${API_URL}/record`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create record');
  return response.json();
}

export async function updateRecord(id: string, data: { name: string; position: string; level: string }) {
  const response = await fetch(`${API_URL}/record/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update record');
  return response.json();
}

export async function deleteRecord(id: string) {
  const response = await fetch(`${API_URL}/record/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete record');
  return response.json();
}
