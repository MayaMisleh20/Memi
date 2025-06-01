import { Component, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, NavController, AnimationController, Animation } from '@ionic/angular';

interface RTMTask {
  id: number;
  period: number;
  execution: number;
  deadline: number;
  color: string;
  remaining: number;
  nextRelease: number;
}

interface ScheduledBlock {
  id: number;
  startTime: number;
  endTime: number;
}

@Component({
  selector: 'app-rtm',
  templateUrl: './rtm.page.html',
  styleUrls: ['./rtm.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class RtmPage {
  tasks: RTMTask[] = [
    { id: 1, period: 4, execution: 3, deadline: 4, color: '#f1c40f', remaining: 0, nextRelease: 0 },
    { id: 2, period: 8, execution: 2, deadline: 8, color: '#e74c3c', remaining: 0, nextRelease: 0 },
    { id: 3, period: 12, execution: 1, deadline: 12, color: '#9b59b6', remaining: 0, nextRelease: 0 }
  ];

  colorOptions = [
    { value: '#f1c40f', name: 'Yellow' },
    { value: '#e74c3c', name: 'Red' },
    { value: '#9b59b6', name: 'Purple' },
    { value: '#2ecc71', name: 'Green' },
    { value: '#3498db', name: 'Blue' },
    { value: '#e67e22', name: 'Orange' }
  ];

  result: any = null;
  showTutorialModal = false;
  showOverloadWarning = false;

  constructor(private cdr: ChangeDetectorRef) {}

  isValidInput(): boolean {
    return this.tasks.every(t => t.period > 0 && t.execution > 0 && t.color);
  }

  runSimulation() {
    const lcm = this.leastCommonMultiple(this.tasks.map(t => t.period));
    const schedule: ScheduledBlock[] = [];
    let currentTime = 0;
    let missedDeadlines = 0;

    this.tasks.forEach(t => {
      t.remaining = 0;
      t.nextRelease = 0;
    });

    while (currentTime < lcm) {
      // Release new jobs
      this.tasks.forEach(task => {
        if (currentTime === task.nextRelease) {
          if (task.remaining > 0) missedDeadlines++;
          task.remaining = task.execution;
          task.deadline = currentTime + task.period;
          task.nextRelease += task.period;
        }
      });

      // Pick highest priority (shortest period)
      const readyTasks = this.tasks.filter(t => t.remaining > 0).sort((a, b) => a.period - b.period);

      if (readyTasks.length === 0) {
        currentTime++;
        continue;
      }

      const currentTask = readyTasks[0];
      const startTime = currentTime;
      currentTask.remaining--;
      currentTime++;
      const endTime = currentTime;

      schedule.push({ id: currentTask.id, startTime, endTime });
    }

    const utilization = this.tasks.reduce((sum, t) => sum + t.execution / t.period, 0) * 100;
    this.showOverloadWarning = utilization > 100;

    this.result = {
      schedule,
      missedDeadlines,
      utilization
    };

    this.cdr.detectChanges();
  }

  leastCommonMultiple(arr: number[]): number {
    const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
    const lcm = (a: number, b: number): number => (a * b) / gcd(a, b);
    return arr.reduce((acc, val) => lcm(acc, val), 1);
  }

  deleteTask(index: number) {
    this.tasks.splice(index, 1);
    this.result = null;
  }

  getTaskColor(id: number): string {
    const task = this.tasks.find(t => t.id === id);
    return task ? task.color : '#cccccc';
  }

  getTimelineMarkers(): number[] {
    if (!this.result) return [];
    const lastTime = Math.max(...this.result.schedule.map((b: ScheduledBlock) => b.endTime));
    const step = Math.ceil(lastTime / 5) || 1;
    const markers: number[] = [];
    for (let t = 0; t <= lastTime; t += step) {
      markers.push(t);
    }
    if (!markers.includes(lastTime)) {
      markers.push(lastTime);
    }
    return markers;
  }
  
  calculateBarWidth(block: ScheduledBlock): number {
    const lastFinish = Math.max(...this.result.schedule.map((b: ScheduledBlock) => b.endTime));
    const duration = block.endTime - block.startTime;
    return (duration / lastFinish) * 100;
  }
  
  calculateBarOffset(block: ScheduledBlock): number {
    const lastFinish = Math.max(...this.result.schedule.map((b: ScheduledBlock) => b.endTime));
    return (block.startTime / lastFinish) * 100;
  }

  openTutorial() {
    this.showTutorialModal = true;
  }
}
