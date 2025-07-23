// API service for incidents
export async function fetchIncidents() {
  const res = await fetch("/api/incidents?resolved=false");
  if (!res.ok) throw new Error("Failed to fetch incidents");
  return res.json();
}

export async function resolveIncident(id: string | number) {
  const res = await fetch(`/api/incidents/${id}/resolve`, {
    method: "PATCH",
  });
  if (!res.ok) throw new Error("Failed to resolve incident");
  return res.json();
}
