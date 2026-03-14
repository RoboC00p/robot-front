'use client';

import React from 'react';
import { Play, Square, Navigation, Activity } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface TaskManagerProps {
  isAutonomous: boolean;
  activeTask: string | null;
  onStartTask: (taskName: string) => void;
  onStopTask: () => void;
}

export function TaskManager({
  isAutonomous,
  activeTask,
  onStartTask,
  onStopTask,
}: TaskManagerProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Gestion des Tâches</CardTitle>
        <CardDescription>
          Assignez des missions d&apos;assistance
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <Tabs defaultValue="delivery" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="delivery">Livraison (UC-01)</TabsTrigger>
            <TabsTrigger value="guide">Guidage (UC-02)</TabsTrigger>
          </TabsList>

          <TabsContent value="delivery" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="patient">Patient cible</Label>
              <Input id="patient" placeholder="Ex: Chambre 302 - M. Dupont" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="items">Contenu du plateau</Label>
              <Input
                id="items"
                placeholder="Médicaments du matin, verre d'eau"
              />
            </div>
            <Button
              className="w-full"
              onClick={() => onStartTask('Livraison plateau Chambre 302')}
              disabled={activeTask !== null || !isAutonomous}
            >
              <Play className="h-4 w-4 mr-2" />
              Démarrer la livraison
            </Button>
          </TabsContent>

          <TabsContent value="guide" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="destination">Destination</Label>
              <Input id="destination" placeholder="Ex: Salle de radiologie" />
            </div>
            <Button
              className="w-full"
              onClick={() => onStartTask('Guidage vers Radiologie')}
              disabled={activeTask !== null || !isAutonomous}
            >
              <Navigation className="h-4 w-4 mr-2" />
              Initier le guidage
            </Button>
          </TabsContent>
        </Tabs>

        {/* Active Task Status */}
        <div className="mt-8 pt-8 border-t border-zinc-100">
          <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">
            Mission en cours
          </h4>
          {activeTask ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-blue-50 border border-blue-100 rounded-lg p-4"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Activity className="h-5 w-5 text-blue-600 animate-pulse" />
                  </div>
                  <div>
                    <p className="font-medium text-blue-900">{activeTask}</p>
                    <p className="text-xs text-blue-700 mt-1">
                      Étape: En transit...
                    </p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="bg-white text-blue-700 border-blue-200"
                >
                  12 min restantes
                </Badge>
              </div>

              <div className="w-full bg-blue-200 h-2 rounded-full overflow-hidden mb-4">
                <motion.div
                  className="bg-blue-600 h-full rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: '45%' }}
                  transition={{ duration: 1 }}
                />
              </div>

              <Button
                variant="destructive"
                size="sm"
                className="w-full"
                onClick={onStopTask}
              >
                <Square className="h-4 w-4 mr-2" />
                Interrompre
              </Button>
            </motion.div>
          ) : (
            <div className="text-center py-8 text-muted-foreground border-2 border-dashed border-border rounded-lg">
              Le robot est en attente d&apos;instructions.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
