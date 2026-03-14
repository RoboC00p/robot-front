'use client';

import React from 'react';
import { AlertTriangle, User } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface MetricsAndAlertsProps {
  vitalsData: Array<{ time: string; heartRate: number; battery: number }>;
}

export function MetricsAndAlerts({ vitalsData }: MetricsAndAlertsProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Alertes Récentes (UC-04)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-3 items-start border-l-2 border-yellow-500 pl-3">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Obstacle détecté</p>
                <p className="text-xs text-muted-foreground">
                  Il y a 2 min - Couloir B
                </p>
              </div>
            </div>
            <div className="flex gap-3 items-start border-l-2 border-zinc-200 pl-3">
              <User className="h-5 w-5 text-zinc-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-zinc-600">
                  Patient guidé avec succès
                </p>
                <p className="text-xs text-muted-foreground">Il y a 45 min</p>
              </div>
            </div>
          </div>
          <Button variant="outline" className="w-full mt-4 text-xs h-8">
            Voir l&apos;historique
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Batterie vs Activité
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={vitalsData}
                margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorBattery" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 10, fill: '#71717a' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: '#71717a' }}
                  axisLine={false}
                  tickLine={false}
                />
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e4e4e7"
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                  labelStyle={{ color: '#71717a', fontSize: '12px' }}
                />
                <Area
                  type="monotone"
                  dataKey="battery"
                  stroke="#22c55e"
                  fillOpacity={1}
                  fill="url(#colorBattery)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">
              Missions du jour
            </p>
            <p className="text-2xl font-bold text-foreground">14</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Distance (km)</p>
            <p className="text-2xl font-bold text-foreground">3.2</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
