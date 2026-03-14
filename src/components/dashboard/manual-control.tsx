'use client';

import React from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Power } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Slider, SliderTrack, SliderThumb } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface ManualControlProps {
  isAutonomous: boolean;
  setIsAutonomous: (value: boolean) => void;
  speed: number[];
  setSpeed: (value: number[]) => void;
  onEmergencyStop: () => void;
}

export function ManualControl({
  isAutonomous,
  setIsAutonomous,
  speed,
  setSpeed,
  onEmergencyStop,
}: Readonly<ManualControlProps>) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pilotage Manuel</CardTitle>
        <CardDescription>
          Prenez le contrôle du robot en cas de besoin
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <Label htmlFor="autonomy-mode" className="text-base cursor-pointer">
            Mode Autonome
          </Label>
          <Switch
            id="autonomy-mode"
            checked={isAutonomous}
            onCheckedChange={setIsAutonomous}
          />
        </div>

        <div className="space-y-3">
          <div className="flex justify-between">
            <Label>Vitesse de déplacement</Label>
            <span className="text-sm font-mono">{speed[0] ?? 0}%</span>
          </div>
          <Slider
            value={speed}
            onValueChange={setSpeed}
            max={100}
            step={1}
            disabled={isAutonomous}
            className={isAutonomous ? 'opacity-50' : ''}
          >
            <SliderTrack />
            <SliderThumb />
          </Slider>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-4 w-48 mx-auto">
          <div />
          <Button
            variant="secondary"
            className="h-12 w-full"
            disabled={isAutonomous}
          >
            <ArrowUp className="h-6 w-6" />
          </Button>
          <div />
          <Button
            variant="secondary"
            className="h-12 w-full"
            disabled={isAutonomous}
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="secondary"
            className="h-12 w-full"
            disabled={isAutonomous}
          >
            <Power className="h-6 w-6" />
          </Button>
          <Button
            variant="secondary"
            className="h-12 w-full"
            disabled={isAutonomous}
          >
            <ArrowRight className="h-6 w-6" />
          </Button>
          <div />
          <Button
            variant="secondary"
            className="h-12 w-full"
            disabled={isAutonomous}
          >
            <ArrowDown className="h-6 w-6" />
          </Button>
          <div />
        </div>

        <Button
          variant="destructive"
          className="w-full h-12 text-lg font-bold uppercase tracking-widest mt-4"
          onClick={onEmergencyStop}
        >
          Arrêt d&apos;Urgence
        </Button>
      </CardContent>
    </Card>
  );
}
