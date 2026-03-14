'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface CameraFeedProps {
  isAutonomous: boolean;
}

export function CameraFeed({ isAutonomous }: CameraFeedProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span>Caméra Embarquée</span>
          <Badge variant={isAutonomous ? 'secondary' : 'destructive'}>
            {isAutonomous ? 'Monitoring' : 'Live Feed'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative aspect-video bg-zinc-900 rounded-lg overflow-hidden flex items-center justify-center border-2 border-zinc-800">
          <div className="absolute top-2 left-2 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-white text-xs font-mono">REC</span>
          </div>
          {/* Crosshair overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
            <div className="w-px h-8 bg-white" />
            <div className="h-px w-8 bg-white absolute" />
          </div>
          <p className="text-zinc-500 text-sm font-mono">Flux vidéo simulé</p>
        </div>
      </CardContent>
    </Card>
  );
}
