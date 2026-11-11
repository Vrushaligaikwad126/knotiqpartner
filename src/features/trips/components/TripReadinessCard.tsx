import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export interface ReadinessTask {
  id: string;
  label: string;
  completed: boolean;
}

export interface TripReadinessCardProps {
  percentage?: number;
  completedCount?: number;
  totalCount?: number;
  tasks?: ReadinessTask[];
  onToggleTask?: (taskId: string) => void;
}

const DEFAULT_TASKS: ReadinessTask[] = [
  { id: '1', label: 'Guest information', completed: true },
  { id: '2', label: 'Weather', completed: true },
  { id: '3', label: 'Fuel', completed: true },
  { id: '4', label: 'Engine', completed: true },
  { id: '5', label: 'Safety equipment', completed: false },
  { id: '6', label: 'Vessel inspection', completed: false },
];

export const TripReadinessCard: React.FC<TripReadinessCardProps> = ({
  percentage = 67,
  completedCount = 4,
  totalCount = 6,
  tasks = DEFAULT_TASKS,
  onToggleTask,
}) => {
  const remainingCount = totalCount - completedCount;

  return (
    <View className="mb-4">
      {/* Section Header */}
      <Text className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-2 px-1">
        Trip Readiness
      </Text>

      {/* Main Card */}
      <View
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.04,
          shadowRadius: 10,
          elevation: 2,
        }}
        className="bg-white rounded-3xl p-5 border border-slate-100"
      >
        {/* Header: Label & Big Percentage */}
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
            Preparation
          </Text>
          <Text className="text-2xl font-extrabold text-slate-900">
            {percentage}%
          </Text>
        </View>

        {/* Progress Bar Track */}
        <View className="w-full bg-slate-800 h-2 rounded-full mb-2 overflow-hidden">
          <View
            style={{ width: `${percentage}%` }}
            className="bg-cyan-400 h-full rounded-full"
          />
        </View>

        {/* Subtitle */}
        <Text className="text-xs text-slate-400 font-medium mb-4">
          {completedCount} of {totalCount} tasks complete · {remainingCount} task remaining
        </Text>

        {/* Task Checklist Items */}
        <View className="space-y-3">
          {tasks.map((task) => (
            <TouchableOpacity
              key={task.id}
              activeOpacity={0.7}
              onPress={() => onToggleTask?.(task.id)}
              className="flex-row items-center py-1"
            >
              {task.completed ? (
                // Checked circle
                <View className="w-4 h-4 rounded-full bg-slate-900 items-center justify-center mr-3">
                  <Text className="text-[10px] text-white font-extrabold leading-3">✓</Text>
                </View>
              ) : (
                // Empty outline circle
                <View className="w-4 h-4 rounded-full border-1.5 border-slate-400 mr-3" />
              )}
              <Text
                className={`text-sm ${
                  task.completed
                    ? 'font-medium text-slate-800'
                    : 'font-normal text-slate-700'
                }`}
              >
                {task.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

