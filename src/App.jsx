import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useTheme } from './hooks/useTheme';
import {
  loadCycles, saveCycles, loadNotificationPreference, saveNotificationPreference,
  loadLastNotifiedDate, saveLastNotifiedDate, loadNotifDaysBefore, saveNotifDaysBefore,
  calculateAverageDuration, calculateAverageCycleLength, getNextExpectedDate, getTodayISO, getDaysBetween, getDaysUntil
} from './utils';
import { Header } from './components/Header';
import { NotificationPanel } from './components/NotificationPanel';
import { NextExpected } from './components/NextExpected';
import { CycleCalendar } from './components/CycleCalendar';
import { CyclePhaseWheel } from './components/CyclePhaseWheel';
import { AddDateForm } from './components/AddDateForm';
import { HistoryCard } from './components/HistoryCard';
import { StatsChart } from './components/StatsChart';
import { BackgroundOrbs } from './components/BackgroundOrbs';
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
  const [isAddModalOpen, setIsAddModalOpen]         = useState(false);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(null);
  const [showChart, setShowChart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('luna-show-chart') || 'false'); } catch { return false; }
  });
  const [showPhase, setShowPhase] = useState(() => {
    try { return JSON.parse(localStorage.getItem('luna-show-phase') || 'true'); } catch { return true; }
  });
  const [showPet, setShowPet] = useState(() => {
    try { return JSON.parse(localStorage.getItem('luna-show-pet') || 'true'); } catch { return true; }
  });

  useEffect(() => {
    const saved = loadCycles();
    setCycles(saved.sort((a, b) => b.date.localeCompare(a.date)));
    setNotificationsEnabled(loadNotificationPreference());
    setNotifDaysBefore(loadNotifDaysBefore());
  }, []);

  useEffect(() => { saveCycles(cycles); }, [cycles]);
  useEffect(() => { try { localStorage.setItem('luna-show-chart', JSON.stringify(showChart)); } catch {} }, [showChart]);
  useEffect(() => { try { localStorage.setItem('luna-show-phase', JSON.stringify(showPhase)); } catch {} }, [showPhase]);
  useEffect(() => { try { localStorage.setItem('luna-show-pet',   JSON.stringify(showPet));   } catch {} }, [showPet]);


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

  function handleAddCycle(date, duration, trackingData) {
    const entry = { date };
    if (duration && duration > 0) entry.duration = duration;
    if (trackingData && trackingData.flow) entry.flow = trackingData.flow;
    if (trackingData && trackingData.mood) entry.mood = trackingData.mood;
    if (trackingData && trackingData.symptoms) entry.symptoms = trackingData.symptoms;

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

  function handleExportData() {
    const dataStr = JSON.stringify(cycles, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = 'luna-backup.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }

  function handleImportData(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        if (Array.isArray(imported)) {
          setCycles(imported.sort((a,b) => b.date.localeCompare(a.date)));
          alert("Data imported successfully! Welcome back.");
        } else {
          alert("Invalid data format.");
        }
      } catch (err) {
        alert("Error parsing file.");
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // reset input
  }

  function handleChangeDaysBefore(n) {
    setNotifDaysBefore(n);
    saveNotifDaysBefore(n);
  }

  function handleToggleCard(date) {
    setExpandedCardDate(prev => prev === date ? null : date);
  }

  function handleCalendarDayClick(isoDate) {
    const todayStr = getTodayISO();
    if (isoDate > todayStr) return; // Prevent logging future dates directly from calendar
    // Create date appending time to avoid UTC offset issues shifting it back a day
    setSelectedCalendarDate(new Date(isoDate + 'T12:00:00'));
    setIsAddModalOpen(true);
  }

  const oldestFirst    = [...cycles].sort((a, b) => a.date.localeCompare(b.date));
  const averageDuration = calculateAverageDuration(cycles);

  let currentPhaseForPet = 'Luteal';
  if (cycles.length >= 1) {
    const sorted2    = [...cycles].sort((a, b) => a.date.localeCompare(b.date));
    const lastP      = sorted2[sorted2.length - 1];
    const cd         = getDaysBetween(lastP.date, getTodayISO()) + 1;
    
    const avgDur2    = calculateAverageDuration(cycles);
    const avgLen     = calculateAverageCycleLength(cycles);
    
    const lutealLength = 14;
    const ovulationLength = 4;
    const lutealStart = Math.max(avgDur2 + ovulationLength + 1, avgLen - lutealLength + 1);
    const ovulationStart = Math.max(avgDur2 + 1, lutealStart - ovulationLength);

    if (cd >= 1 && cd <= avgDur2) currentPhaseForPet = 'Menstrual';
    else if (cd >= avgDur2 + 1 && cd < ovulationStart) currentPhaseForPet = 'Follicular';
    else if (cd >= ovulationStart && cd < lutealStart) currentPhaseForPet = 'Ovulation';
    else currentPhaseForPet = 'Luteal';
  }

  return (
    <div className="min-h-screen flex flex-col font-sans" style={{ color: 'var(--luna-text-1)', position: 'relative' }}>
      <BackgroundOrbs />
      <div className="max-w-md mx-auto pb-24 w-full" style={{ position: 'relative', zIndex: 1 }}>
        <Header
          notificationsEnabled={notificationsEnabled}
          onToggleNotifications={handleToggleNotifications}
          onCycleTheme={cycleTheme}
          theme={theme}
          onExportData={handleExportData}
          onImportData={handleImportData}
          showChart={showChart}  onToggleChart={() => setShowChart(p => !p)}
          showPhase={showPhase}  onTogglePhase={() => setShowPhase(p => !p)}
          showPet={showPet}      onTogglePet={() => setShowPet(p => !p)}
        />
        {notificationsEnabled && (
          <NotificationPanel
            notifDaysBefore={notifDaysBefore}
            onChangeDaysBefore={handleChangeDaysBefore}
            nextExpectedDate={getNextExpectedDate(cycles)}
          />
        )}
        <NextExpected cycles={cycles} />
        <CycleCalendar cycles={cycles} onDateClick={handleCalendarDayClick} />
        {showPhase && <CyclePhaseWheel cycles={cycles} />}
        <AddDateForm 
          isOpen={isAddModalOpen} 
          onClose={() => setIsAddModalOpen(false)}
          defaultDate={selectedCalendarDate}
          onSave={handleAddCycle} 
          averageDuration={averageDuration}
          cycles={cycles}
        />
        {showChart && <StatsChart cycles={cycles} />}
        {cycles.length > 0 && (
          <div className="mx-4 mt-6 mb-2">
            <p className="text-xs uppercase tracking-wider" style={{ color: 'var(--luna-text-3)' }}>History</p>
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

      {showPet && <Pet currentPhase={currentPhaseForPet} cycles={cycles} />}
    </div>
  );
}

export default App;
