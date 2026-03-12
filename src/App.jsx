import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useTheme } from './hooks/useTheme';
import {
  loadCycles, saveCycles, loadNotificationPreference, saveNotificationPreference,
  loadLastNotifiedDate, saveLastNotifiedDate, loadNotifDaysBefore, saveNotifDaysBefore,
  calculateAverageDuration, getNextExpectedDate, getTodayISO, getDaysBetween, getDaysUntil
} from './utils';
import { Header } from './components/Header';
import { NotificationPanel } from './components/NotificationPanel';
import { NextExpected } from './components/NextExpected';
import { CycleCalendar } from './components/CycleCalendar';
import { CyclePhaseWheel } from './components/CyclePhaseWheel';
import { AddDateForm } from './components/AddDateForm';
import { HistoryCard } from './components/HistoryCard';
import { Pet } from './components/Pet';

const NOTIFICATION_MESSAGES = [
  'Time to update the calendar 📅',
  'Quick check-in needed 🗓️',
  'Your calendar has a reminder',
  'Time to check your calendar',
  'A gentle reminder from your calendar',
];

async function requestNotificationPermission() {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  return (await Notification.requestPermission()) === 'granted';
}

function checkAndSendNotification(cycles, daysBefore) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  const nextDate = getNextExpectedDate(cycles);
  if (!nextDate) return;
  const today = getTodayISO();
  if (loadLastNotifiedDate() === today) return;
  const daysUntil = getDaysUntil(nextDate);
  if (daysUntil < 0 || daysUntil > daysBefore) return;
  saveLastNotifiedDate(today);
  const msg = NOTIFICATION_MESSAGES[Math.floor(Math.random() * NOTIFICATION_MESSAGES.length)];
  new Notification('Luna', {
    body: msg,
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    tag: 'luna-reminder',
  });
}

function spawnConfetti() {
  if (typeof confetti !== 'function') return;
  confetti({ particleCount: 60, angle: 60,  spread: 55, origin: { x: 0 },   colors: ['#f43f5e','#fb923c','#facc15','#4ade80','#60a5fa','#c084fc','#f472b6'] });
  confetti({ particleCount: 60, angle: 120, spread: 55, origin: { x: 1 },   colors: ['#f43f5e','#fb923c','#facc15','#4ade80','#60a5fa','#c084fc','#f472b6'] });
  setTimeout(() => {
    confetti({ particleCount: 80, spread: 80, startVelocity: 35, origin: { x: 0.5, y: 0.4 }, colors: ['#f43f5e','#a78bfa','#f472b6','#facc15'] });
  }, 400);
}

function App() {
  const { theme, cycleTheme }                       = useTheme();
  const [cycles, setCycles]                         = useState([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [expandedCardDate, setExpandedCardDate]     = useState(null);
  const [notifDaysBefore, setNotifDaysBefore]       = useState(1);

  useEffect(() => {
    const saved = loadCycles();
    setCycles(saved.sort((a, b) => b.date.localeCompare(a.date)));
    setNotificationsEnabled(loadNotificationPreference());
    setNotifDaysBefore(loadNotifDaysBefore());
  }, []);

  useEffect(() => { saveCycles(cycles); }, [cycles]);

  useEffect(() => {
    if (!notificationsEnabled) return;
    checkAndSendNotification(cycles, notifDaysBefore);
    const id = setInterval(() => checkAndSendNotification(cycles, notifDaysBefore), 60 * 60 * 1000);
    return () => clearInterval(id);
  }, [notificationsEnabled, cycles, notifDaysBefore]);

  useEffect(() => {
    if (!notificationsEnabled) return;
    const onVisible = () => {
      if (document.visibilityState === 'visible')
        checkAndSendNotification(cycles, notifDaysBefore);
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [notificationsEnabled, cycles, notifDaysBefore]);

  function handleAddCycle(date, duration) {
    const entry = { date };
    if (duration && duration > 0) entry.duration = duration;
    setCycles(prev => [entry, ...prev].sort((a, b) => b.date.localeCompare(a.date)));
    setExpandedCardDate(null);
    spawnConfetti();
    window.dispatchEvent(new CustomEvent('luna:periodLogged'));
  }

  function handleUpdateCycle(originalDate, updated) {
    setCycles(prev =>
      prev.map(c => c.date === originalDate ? updated : c)
          .sort((a, b) => b.date.localeCompare(a.date))
    );
    setExpandedCardDate(updated.date);
  }

  function handleDeleteCycle(date) {
    setCycles(prev => prev.filter(c => c.date !== date));
    setExpandedCardDate(null);
  }

  async function handleToggleNotifications() {
    if (notificationsEnabled) {
      setNotificationsEnabled(false);
      saveNotificationPreference(false);
      return;
    }
    const granted = await requestNotificationPermission();
    if (granted) { setNotificationsEnabled(true); saveNotificationPreference(true); }
  }

  function handleChangeDaysBefore(n) {
    setNotifDaysBefore(n);
    saveNotifDaysBefore(n);
  }

  function handleToggleCard(date) {
    setExpandedCardDate(prev => prev === date ? null : date);
  }

  const oldestFirst    = [...cycles].sort((a, b) => a.date.localeCompare(b.date));
  const averageDuration = calculateAverageDuration(cycles);

  // Compute current phase for pet
  let currentPhaseForPet = 'Luteal';
  if (cycles.length >= 1) {
    const sorted2    = [...cycles].sort((a, b) => a.date.localeCompare(b.date));
    const lastP      = sorted2[sorted2.length - 1];
    const cd         = getDaysBetween(lastP.date, getTodayISO()) + 1;
    const avgDur2    = calculateAverageDuration(cycles);
    if (cd >= 1 && cd <= avgDur2) currentPhaseForPet = 'Menstrual';
    else if (cd <= 12) currentPhaseForPet = 'Follicular';
    else if (cd <= 16) currentPhaseForPet = 'Ovulation';
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      <div className="max-w-md mx-auto pb-24 w-full">
        <Header
          notificationsEnabled={notificationsEnabled}
          onToggleNotifications={handleToggleNotifications}
          onCycleTheme={cycleTheme}
          theme={theme}
        />
        {notificationsEnabled && (
          <NotificationPanel
            notifDaysBefore={notifDaysBefore}
            onChangeDaysBefore={handleChangeDaysBefore}
            nextExpectedDate={getNextExpectedDate(cycles)}
          />
        )}
        <NextExpected cycles={cycles} />
        <CycleCalendar cycles={cycles} />
        <CyclePhaseWheel cycles={cycles} />
        <AddDateForm onSave={handleAddCycle} averageDuration={averageDuration} />
        {cycles.length > 0 && (
          <div className="mx-4 mt-6 mb-2">
            <p className="text-xs uppercase tracking-wider text-slate-500">History</p>
          </div>
        )}
        {cycles.map((cycle) => {
          const ci = oldestFirst.findIndex(c => c.date === cycle.date);
          const prev = ci > 0 ? oldestFirst[ci - 1] : null;
          return (
            <HistoryCard
              key={cycle.date}
              cycle={cycle}
              previousCycle={prev}
              onUpdate={(updated) => handleUpdateCycle(cycle.date, updated)}
              onDelete={() => handleDeleteCycle(cycle.date)}
              isExpanded={expandedCardDate === cycle.date}
              onToggle={() => handleToggleCard(cycle.date)}
            />
          );
        })}
      </div>
      <p className="text-center text-slate-700 text-xs mt-auto pb-6">v10 React</p>
      <Pet currentPhase={currentPhaseForPet} />
    </div>
  );
}

export default App;
