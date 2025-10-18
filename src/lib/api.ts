const API_BASE = "http://localhost:8080";

type LoginRequest = {
    email: string;
    password: string;
}

export async function post(path: string, body: LoginRequest) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function getWithAuth(path: string) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}
