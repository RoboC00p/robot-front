'use client';

import React from 'react';
import Image from 'next/image';
import { Battery, Wifi } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import logo from '../../../public/assets/logo.png';
interface HeaderProps {
  isAutonomous: boolean;
}

export function Header({ isAutonomous }: Readonly<HeaderProps>) {
  return (
    <header className="bg-white border-b border-zinc-200 sticky top-0 z-10 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg ">
          <Image
            src={logo}
            alt="Robocoop"
            width={60}
            height={60}
            className="object-contain"
          />
        </div>
        <div>
          <h1 className="text-xl font-bold leading-tight text-foreground">
            Robocoop 3000
          </h1>
          <p className="text-xs text-muted-foreground">Dashboard de Pilotage</p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Wifi className="h-5 w-5 text-green-500" />
          <span className="text-sm font-medium text-foreground">
            Connecté (Ping: 12ms)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Battery className="h-5 w-5 text-green-500" />
          <span className="text-sm font-medium text-foreground">60%</span>
        </div>
        <Badge
          variant={isAutonomous ? 'success' : 'warning'}
          className="text-sm py-1"
        >
          {isAutonomous ? 'Autonome' : 'Manuel'}
        </Badge>
      </div>
    </header>
  );
}
