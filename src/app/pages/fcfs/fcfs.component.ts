import { Component } from '@angular/core';
import { IonicModule, NavController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LeaderboardService } from 'src/app/services/leaderboard.service';

interface Process {
  id: string;
  arrivalTime: number;
  burstTime: number;
}
 
interface ScheduledProcess {
  name: string;
  arrivalTime: number;
  burstTime: number;
  startTime: number;
  endTime: number;
  waiting: number;
  turnaround: number;
}

@Component({
  selector: 'app-fcfs',
  standalone: true,
  templateUrl: './fcfs.component.html',
  styleUrls: ['./fcfs.component.scss'],
  imports: [CommonModule, IonicModule, FormsModule],
})
export class FcfsComponent {
  processes: Process[] = [];
  currentInput: Process = { id: '', arrivalTime: 0, burstTime: 1 };
  history: Process[][] = [];
 
  ganttChart: { name: string; burst: number; start: number; end: number }[] = [];
  displaySlots: { name?: string; burst?: number; start?: number; end?: number }[] = [];
  detailedRows: ScheduledProcess[] = [];
  timeLabels: number[] = [];
  totalTime: number = 1;
 
  avgWaitingTime = 0;
  avgTurnaroundTime = 0;
 
  addProcess() {
    const { id, arrivalTime, burstTime } = this.currentInput;
    if (!id.trim()) return;
 
    this.history.push([...this.processes]);
    this.processes.push({ id: id.trim(), arrivalTime, burstTime });
    this.currentInput = { id: '', arrivalTime: 0, burstTime: 1 };
    this.simulateFCFS();
  }
 
  removeProcess() {
    if (this.processes.length > 0) {
      this.history.push([...this.processes]);
      this.processes.pop();
      this.simulateFCFS();
    }
  }
 
  undo() {
    if (this.history.length > 0) {
      this.processes = this.history.pop()!;
      this.simulateFCFS();
    }
  }
 
  clear() {
    this.history.push([...this.processes]);
    this.processes = [];
    this.displaySlots = [];
    this.timeLabels = [];
    this.detailedRows = [];
    this.avgWaitingTime = 0;
    this.avgTurnaroundTime = 0;
    this.totalTime = 1;
  }
 
  simulateFCFS() {
    const sorted = [...this.processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
    let time = 0;
    let waiting = 0;
    let turnaround = 0;
    this.ganttChart = [];
    this.detailedRows = [];
 
    for (const p of sorted) {
      if (time < p.arrivalTime) {
        this.ganttChart.push({
          name: 'IDLE',
          burst: p.arrivalTime - time,
          start: time,
          end: p.arrivalTime
        });
        time = p.arrivalTime;
      }
 
      const start = time;
      const end = time + p.burstTime;
      const wait = start - p.arrivalTime;
      const tat = end - p.arrivalTime;
 
      this.ganttChart.push({ name: p.id, burst: p.burstTime, start, end });
      this.detailedRows.push({
        name: p.id,
        arrivalTime: p.arrivalTime,
        burstTime: p.burstTime,
        startTime: start,
        endTime: end,
        waiting: wait,
        turnaround: tat
      });
 
      waiting += wait;
      turnaround += tat;
      time = end;
    }
 
    this.displaySlots = [...this.ganttChart];
    this.timeLabels = this.ganttChart.length ? [this.ganttChart[0].start] : [];
    this.ganttChart.forEach((b) => this.timeLabels.push(b.end));
    this.totalTime = time;
 
    this.avgWaitingTime = this.processes.length ? waiting / this.processes.length : 0;
    this.avgTurnaroundTime = this.processes.length ? turnaround / this.processes.length : 0;
  }
}
 