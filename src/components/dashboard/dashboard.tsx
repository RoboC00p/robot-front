'use client';

import React, { useState } from 'react';
import { Toaster, toast } from 'sonner';
import { Header } from '@/components/dashboard/header';
import { CameraFeed } from '@/components/dashboard/camera-feed';
import { ManualControl } from '@/components/dashboard/manual-control';
import { TaskManager } from '@/components/dashboard/task-manager';
import { MetricsAndAlerts } from '@/components/dashboard/metrics-and-alerts';

const vitalsData = [
  { time: '10:00', heartRate: 72, battery: 95 },
  { time: '10:30', heartRate: 75, battery: 90 },
  { time: '11:00', heartRate: 80, battery: 85 },
  { time: '11:30', heartRate: 76, battery: 78 },
  { time: '12:00', heartRate: 74, battery: 72 },
  { time: '12:30', heartRate: 79, battery: 65 },
  { time: '13:00', heartRate: 75, battery: 60 },
];

export function Dashboard() {
  const [isAutonomous, setIsAutonomous] = useState(true);
  const [speed, setSpeed] = useState([50]);
  const [activeTask, setActiveTask] = useState<string | null>(null);

  const handleStartTask = (taskName: string) => {
    setActiveTask(taskName);
    toast.success(`Tâche démarrée : ${taskName}`);
  };

  const handleStopTask = () => {
    setActiveTask(null);
    toast.error('Tâche interrompue.');
  };

  const handleEmergencyStop = () => {
    setIsAutonomous(false);
    setActiveTask(null);
    toast.error("ARRÊT D'URGENCE ACTIVÉ ! Passage en mode manuel.", {
      style: { backgroundColor: '#ef4444', color: 'white', border: 'none' },
    });
  };

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <Toaster position="top-right" />

      <Header isAutonomous={isAutonomous} />

      <main className="p-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 space-y-6">
          <CameraFeed isAutonomous={isAutonomous} />
          <ManualControl
            isAutonomous={isAutonomous}
            setIsAutonomous={setIsAutonomous}
            speed={speed}
            setSpeed={setSpeed}
            onEmergencyStop={handleEmergencyStop}
          />
        </div>

        <div className="lg:col-span-5 space-y-6">
          <TaskManager
            isAutonomous={isAutonomous}
            activeTask={activeTask}
            onStartTask={handleStartTask}
            onStopTask={handleStopTask}
          />
        </div>

        <div className="lg:col-span-3 space-y-6">
          <MetricsAndAlerts vitalsData={vitalsData} />
        </div>
      </main>
    </div>
  );
}
