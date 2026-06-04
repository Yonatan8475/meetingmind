export const SAMPLE_TRANSCRIPT = `Project Sync Meeting — TruckGo Ethiopia Platform
Date: June 4, 2026
Attendees: Yonatan (CTO), Meron (Backend), Tigist (Mobile), Dawit (Operations)

Yonatan will deploy the backend to GCP Cloud Run by end of this week.
Meron will integrate the Chapa payment gateway. Deadline is next Tuesday.
Tigist will build the driver mobile app in React Native. Deadline is two weeks from today.
Dawit will conduct field research at Akaki Kality truck station this Saturday.
Yonatan will prepare the investor pitch deck by next Friday.
Budget approved: 15,000 ETB for field surveyor salaries.`;

export const TRACKER_PRESETS = [
  {
    label: '🏗️ TruckGo Sprint',
    tasks: [
      { task: 'Deploy backend to GCP Cloud Run', owner: 'Yonatan', deadline: 'Friday' },
      { task: 'Integrate Chapa payment gateway', owner: 'Meron', deadline: 'Tuesday' },
      { task: 'Build driver mobile app', owner: 'Tigist', deadline: 'Two weeks' },
      { task: 'Field research at Akaki Kality', owner: 'Dawit', deadline: 'Saturday' },
    ],
  },
  {
    label: '🤖 AI Project',
    tasks: [
      { task: 'Build FastAPI backend', owner: 'John', deadline: 'Friday' },
      { task: 'Clean training dataset', owner: 'Sarah', deadline: 'Wednesday' },
      { task: 'Write technical documentation', owner: 'Mike', deadline: 'Thursday' },
    ],
  },
  {
    label: '📊 Marketing Launch',
    tasks: [
      { task: 'Design social media assets', owner: 'Lisa', deadline: 'Monday' },
      { task: 'Write product launch copy', owner: 'Tom', deadline: 'Tuesday' },
      { task: 'Set up analytics dashboard', owner: 'Anna', deadline: 'Wednesday' },
    ],
  },
];

export const TASK_STATUSES = ['Pending', 'In Progress', 'Done', 'Cancelled'];

export const AGENTS = [
  { num: '01', name: 'Summarizer Agent', desc: 'Extracts key points and decisions', badge: 'Groq LLaMA' },
  { num: '02', name: 'Extractor Agent', desc: 'Identifies tasks, owners, deadlines', badge: 'Groq LLaMA' },
  { num: '03', name: 'Tracker Agent', desc: 'Builds structured follow-up report', badge: 'Python' },
];
