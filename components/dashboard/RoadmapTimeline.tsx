'use client';

import React, { useState } from 'react';
import { RoadmapPhase, RoadmapTask } from '@/types/business';
import { Rocket, CheckCircle2, Circle, Calendar, CheckSquare, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface RoadmapTimelineProps {
  roadmap: RoadmapPhase[];
  businessType: string;
}

export function RoadmapTimeline({ roadmap: initialRoadmap, businessType }: RoadmapTimelineProps) {
  const [phases, setPhases] = useState<RoadmapPhase[]>(initialRoadmap);

  const totalTasks = phases.reduce((sum, p) => sum + p.tasks.length, 0);
  const completedTasks = phases.reduce(
    (sum, p) => sum + p.tasks.filter(t => t.completed).length,
    0
  );
  const progressPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const toggleTask = (phaseId: string, taskId: string) => {
    const updated = phases.map(phase => {
      if (phase.id === phaseId) {
        return {
          ...phase,
          tasks: phase.tasks.map(task => {
            if (task.id === taskId) {
              const newStatus = !task.completed;
              if (newStatus && completedTasks + 1 === totalTasks) {
                confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
              }
              return { ...task, completed: newStatus };
            }
            return task;
          })
        };
      }
      return phase;
    });
    setPhases(updated);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Rocket className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Interactive 90-Day Execution Roadmap & Launch Playbook</span>
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Structured bi-weekly operational milestones tailored for {businessType} deployment.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[11px] text-slate-400 block">Launch Readiness</span>
            <strong className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
              {completedTasks}/{totalTasks} tasks ({progressPct}%)
            </strong>
          </div>
          <div className="w-24 bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* 6 Phases Timeline */}
      <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
        {phases.map((phase, pIdx) => {
          const isPhaseCompleted = phase.tasks.every(t => t.completed);

          return (
            <div key={phase.id} className="relative pl-9">
              {/* Timeline marker node */}
              <div
                className={`absolute left-1.5 top-1 -translate-x-1/2 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all ${
                  isPhaseCompleted
                    ? 'bg-emerald-600 border-white text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 border-emerald-500 text-emerald-600 dark:text-emerald-400'
                }`}
              >
                {isPhaseCompleted ? '✓' : pIdx + 1}
              </div>

              {/* Phase Card */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 hover:border-slate-300 dark:hover:border-slate-700 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 mb-3 border-b border-slate-200/80 dark:border-slate-700/60">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      {phase.phase}
                    </span>
                    <h5 className="font-bold text-sm text-slate-900 dark:text-white">
                      {phase.title}
                    </h5>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 italic">
                    Focus: {phase.focus}
                  </span>
                </div>

                {/* Tasks List */}
                <div className="space-y-2">
                  {phase.tasks.map((task) => (
                    <label
                      key={task.id}
                      className={`flex items-start gap-2.5 p-2 rounded-lg cursor-pointer transition-colors text-xs ${
                        task.completed
                          ? 'bg-emerald-50/40 dark:bg-emerald-950/20 text-slate-500 dark:text-slate-400 line-through'
                          : 'hover:bg-slate-100/80 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTask(phase.id, task.id)}
                        className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 accent-emerald-600 cursor-pointer"
                      />
                      <div className="flex-1 leading-relaxed">
                        <span>{task.text}</span>
                        <span className="ml-2 inline-block text-[10px] font-semibold px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                          {task.department}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
