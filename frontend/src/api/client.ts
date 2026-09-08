const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8000/api";

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const csrfToken = getCookie("csrftoken");
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(csrfToken ? { "X-CSRFToken": csrfToken } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.detail ?? `Request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export interface Patient {
  id: number;
  username: string;
  full_name: string;
  date_of_birth: string | null;
  mrn: string;
}

export interface HealthRecord {
  id: number;
  record_type: string;
  title: string;
  notes: string;
  created_at: string;
}

export interface LabResult {
  id: number;
  test_name: string;
  value: string;
  unit: string;
  reference_range: string;
  recorded_at: string;
}

export interface Appointment {
  id: number;
  provider_name: string;
  reason: string;
  scheduled_at: string;
  location: string;
  status: "scheduled" | "completed" | "cancelled";
}

export interface Medication {
  id: number;
  name: string;
  dosage: string;
  frequency: string;
  prescribing_provider: string;
  start_date: string;
  end_date: string | null;
  status: "active" | "discontinued";
}

export interface InsuranceSummary {
  id: number;
  payer_name: string;
  plan_name: string;
  member_id: string;
  group_number: string;
  effective_date: string;
  copay_primary_care: string | null;
  copay_specialist: string | null;
  deductible_individual: string | null;
  deductible_met: string | null;
}

export const api = {
  fetchCsrfCookie: () => request<{ csrfToken: string }>("/auth/csrf/"),
  login: async (username: string, password: string) => {
    await api.fetchCsrfCookie();
    return request<Patient>("/auth/login/", { method: "POST", body: JSON.stringify({ username, password }) });
  },
  logout: () => request<void>("/auth/logout/", { method: "POST" }),
  me: () => request<Patient>("/me/"),
  healthRecords: () => request<HealthRecord[]>("/health-records/"),
  labResults: () => request<LabResult[]>("/lab-results/"),
  appointments: () => request<Appointment[]>("/appointments/"),
  medications: () => request<Medication[]>("/medications/"),
  insuranceSummary: () => request<InsuranceSummary>("/insurance-summary/"),
};
