/**
 * lib/api.js
 * Central API client — all calls to the FastAPI backend go through here.
 */

export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// ── Health ──────────────────────────────────────────
export async function checkHealth() {
  try {
    const res = await fetch(`${API_BASE}/api/health`);
    return res.ok;
  } catch { return false; }
}

// ── Process Meeting (text) ───────────────────────────
export async function processMeeting(transcript) {
  const res = await fetch(`${API_BASE}/api/process-meeting`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ transcript }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || 'Pipeline error');
  }
  return res.json();
}

// ── Transcribe Audio Only ────────────────────────────
export async function transcribeAudio(audioBlob, language = 'en') {
  const formData = new FormData();
  formData.append('file', audioBlob, 'recording.webm');
  formData.append('language', language);

  const res = await fetch(`${API_BASE}/api/transcribe`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || 'Transcription error');
  }
  return res.json(); // { transcript, language, duration }
}

// ── Transcribe AND Process (all in one) ─────────────
export async function transcribeAndProcess(audioBlob, language = 'en') {
  const formData = new FormData();
  formData.append('file', audioBlob, 'recording.webm');
  formData.append('language', language);

  const res = await fetch(`${API_BASE}/api/transcribe-and-process`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || 'Processing error');
  }
  return res.json();
}

// ── Meetings ─────────────────────────────────────────
export async function getMeetings() {
  const res = await fetch(`${API_BASE}/api/meetings`);
  if (!res.ok) throw new Error('Failed to fetch meetings');
  return res.json();
}

export async function getMeeting(id) {
  const res = await fetch(`${API_BASE}/api/meetings/${id}`);
  if (!res.ok) throw new Error('Meeting not found');
  return res.json();
}

// ── Download Report ──────────────────────────────────
export function getDownloadUrl(meetingId) {
  return `${API_BASE}/api/meetings/${meetingId}/download`;
}

export async function getReportText(meetingId) {
  const res = await fetch(`${API_BASE}/api/meetings/${meetingId}/report-text`);
  if (!res.ok) throw new Error('Failed to fetch report');
  return res.text();
}

// ── Tasks ─────────────────────────────────────────────
export async function getTasks() {
  const res = await fetch(`${API_BASE}/api/tasks`);
  if (!res.ok) throw new Error('Failed to fetch tasks');
  return res.json();
}

export async function updateTaskStatus(taskId, status) {
  const res = await fetch(`${API_BASE}/api/tasks/${taskId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error('Failed to update task');
  return res.json();
}

// ── Agents (individual) ──────────────────────────────
export async function summarizeOnly(transcript) {
  const res = await fetch(`${API_BASE}/api/summarize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ transcript }),
  });
  return res.json();
}

export async function extractOnly(transcript) {
  const res = await fetch(`${API_BASE}/api/extract`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ transcript }),
  });
  return res.json();
}
