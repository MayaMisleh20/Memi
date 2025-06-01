import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
 
interface Process {
  name: string;
  arrival: number;
  burst: number;
  priority?: number;
  tickets?: number;
  stride?: number;
  pass?: number;
  originalBurst?: number;
  start?: number;
  end?: number;
  wait?: number;
  turnaround?: number;
}
 
interface AlgorithmResult {
  avgWait: number;
  avgTurnaround: number;
  cpuUtilization: number;
  isBestWait?: boolean;
  isBestTurnaround?: boolean;
  isBestUtilization?: boolean;
}
 
interface Question {
  id: number;
  name: string;
  processes: Process[];
}

@Component({
  selector: 'app-battle-mode',
  standalone: true,
  templateUrl: './battle-mode.page.html',
  styleUrls: ['./battle-mode.page.scss'],
  imports: [CommonModule, FormsModule, IonicModule],
})


export class BattleModePage {
  algorithms = [
    'FCFS',
    'SJF',
    'Priority',
    'Round Robin',
    'Lottery',
    'Stride Scheduling',
    'Rate Monotonic',
    'Work Stealing',
  ];
 
  algorithmA: string | null = null;
  algorithmB: string | null = null;
  mode: '1vs1' | '1vsAll' = '1vs1';
  selectedQuestionIndex = 0;
  results: Record<string, AlgorithmResult> = {};
 
  questions: Question[] = [
    {
      id: 1,
      name: 'All processes arrive at time 0 (Batch)',
      processes: [
        { name: 'P1', arrival: 0, burst: 10, priority: 1 },
        { name: 'P2', arrival: 0, burst: 5, priority: 2 },
        { name: 'P3', arrival: 0, burst: 8, priority: 3 },
        { name: 'P4', arrival: 0, burst: 6, priority: 4 },
        { name: 'P5', arrival: 0, burst: 12, priority: 5 },
      ],
    },
    {
      id: 2,
      name: 'Mixed burst times and priorities',
      processes: [
        { name: 'P1', arrival: 0, burst: 2, priority: 2 },
        { name: 'P2', arrival: 0, burst: 1, priority: 1 },
        { name: 'P3', arrival: 0, burst: 8, priority: 4 },
        { name: 'P4', arrival: 0, burst: 4, priority: 2 },
        { name: 'P5', arrival: 0, burst: 5, priority: 3 },
      ],
    },
    {
      id: 3,
      name: 'Staggered arrivals (Real-time)',
      processes: [
        { name: 'P1', arrival: 0, burst: 20, priority: 40 },
        { name: 'P2', arrival: 25, burst: 25, priority: 30 },
        { name: 'P3', arrival: 30, burst: 25, priority: 30 },
        { name: 'P4', arrival: 60, burst: 15, priority: 35 },
        { name: 'P5', arrival: 100, burst: 10, priority: 5 },
        { name: 'P6', arrival: 105, burst: 10, priority: 10 },
      ],
    },
  ];
 
  constructor(private nav: NavController) {}
 
  goBack() {
    this.nav.back();
  }
 
  runSimulation() {
    if (!this.algorithmA) return;
 
    const processes = this.questions[this.selectedQuestionIndex].processes;
    this.results = {};
 
    if (this.mode === '1vs1') {
      if (!this.algorithmB || this.algorithmA === this.algorithmB) return;
      this.results[this.algorithmA] = this.simulate(processes, this.algorithmA);
      this.results[this.algorithmB] = this.simulate(processes, this.algorithmB);
    } else {
      for (const algo of this.algorithms) {
        this.results[algo] = this.simulate(processes, algo);
      }
    }
 
    this.markBestResults();
  }
 
  markBestResults() {
    const keys = Object.keys(this.results);
    if (keys.length < 2) return;
 
    const minWait = Math.min(...keys.map(k => this.results[k].avgWait));
    const minTurnaround = Math.min(...keys.map(k => this.results[k].avgTurnaround));
    const maxUtil = Math.max(...keys.map(k => this.results[k].cpuUtilization));
 
    for (const k of keys) {
      this.results[k].isBestWait = this.results[k].avgWait === minWait;
      this.results[k].isBestTurnaround = this.results[k].avgTurnaround === minTurnaround;
      this.results[k].isBestUtilization = this.results[k].cpuUtilization === maxUtil;
    }
  }
 
  simulate(processes: Process[], algorithm: string): AlgorithmResult {
    let queue: Process[] = JSON.parse(JSON.stringify(processes));
    queue.forEach(p => {
      p.originalBurst = p.burst;
      p.priority = p.priority ?? 0;
      p.tickets = p.tickets ?? 1;
      p.stride = p.stride ?? 1000 / (p.priority || 1);
      p.pass = 0;
    });
 
    let time = 0;
    let completed: Process[] = [];
 
    switch (algorithm) {
      case 'FCFS':
        queue.sort((a, b) => a.arrival - b.arrival);
        while (queue.length) {
          const current = queue.shift()!;
          time = Math.max(time, current.arrival);
          current.start = time;
          current.end = time + current.burst;
          current.wait = current.start - current.arrival;
          current.turnaround = current.end - current.arrival;
          time = current.end;
          completed.push(current);
        }
        break;
 
      case 'SJF':
        while (queue.length) {
          const available = queue.filter(p => p.arrival <= time);
          if (!available.length) {
            time = Math.min(...queue.map(p => p.arrival));
            continue;
          }
          available.sort((a, b) => a.burst - b.burst);
          const current = available[0];
          queue = queue.filter(p => p !== current);
          current.start = time;
          current.end = time + current.burst;
          current.wait = current.start - current.arrival;
          current.turnaround = current.end - current.arrival;
          time = current.end;
          completed.push(current);
        }
        break;
 
      case 'Priority':
        while (queue.length) {
          const available = queue.filter(p => p.arrival <= time);
          if (!available.length) {
            time = Math.min(...queue.map(p => p.arrival));
            continue;
          }
          available.sort((a, b) => (a.priority || 0) - (b.priority || 0));
          const current = available[0];
          queue = queue.filter(p => p !== current);
          current.start = time;
          current.end = time + current.burst;
          current.wait = current.start - current.arrival;
          current.turnaround = current.end - current.arrival;
          time = current.end;
          completed.push(current);
        }
        break;
 
      case 'Round Robin':
        const quantum = 4;
        const rrQueue: Process[] = [];
        let processIndex = 0;
        queue.sort((a, b) => a.arrival - b.arrival);
 
        while (processIndex < queue.length || rrQueue.length) {
          while (processIndex < queue.length && queue[processIndex].arrival <= time) {
            rrQueue.push(queue[processIndex++]);
          }
 
          if (!rrQueue.length) {
            time = queue[processIndex].arrival;
            continue;
          }
 
          const current = rrQueue.shift()!;
          current.start = current.start ?? time;
          const execTime = Math.min(quantum, current.burst);
          time += execTime;
          current.burst -= execTime;
 
          if (current.burst > 0) {
            rrQueue.push(current);
          } else {
            current.end = time;
            current.turnaround = current.end - current.arrival;
            current.wait = current.turnaround - current.originalBurst!;
            completed.push(current);
          }
        }
        break;
 
      case 'Lottery':
        while (queue.length) {
          const available = queue.filter(p => p.arrival <= time);
          if (!available.length) {
            time = Math.min(...queue.map(p => p.arrival));
            continue;
          }
 
          const totalTickets = available.reduce((sum, p) => sum + (p.tickets || 1), 0);
          const winner = Math.floor(Math.random() * totalTickets);
          let ticketSum = 0;
          let current: Process | null = null;
 
          for (const p of available) {
            ticketSum += p.tickets || 1;
            if (ticketSum > winner) {
              current = p;
              break;
            }
          }
 
          if (!current) continue;
          queue = queue.filter(p => p !== current);
          current.start = time;
          current.end = time + current.burst;
          current.wait = current.start - current.arrival;
          current.turnaround = current.end - current.arrival;
          time = current.end;
          completed.push(current);
        }
        break;
 
      case 'Stride Scheduling':
        while (queue.length) {
          const available = queue.filter(p => p.arrival <= time);
          if (!available.length) {
            time = Math.min(...queue.map(p => p.arrival));
            continue;
          }
 
          available.forEach(p => {
            p.pass = (p.pass || 0) + (p.stride || 1000);
          });
 
          available.sort((a, b) => (a.pass || 0) - (b.pass || 0));
          const current = available[0];
          queue = queue.filter(p => p !== current);
          current.start = time;
          current.end = time + current.burst;
          current.wait = current.start - current.arrival;
          current.turnaround = current.end - current.arrival;
          time = current.end;
          completed.push(current);
        }
        break;
 
      case 'Rate Monotonic':
        queue.sort((a, b) => (a.priority || 0) - (b.priority || 0));
        while (queue.length) {
          const current = queue.shift()!;
          time = Math.max(time, current.arrival);
          current.start = time;
          current.end = time + current.burst;
          current.wait = current.start - current.arrival;
          current.turnaround = current.end - current.arrival;
          time = current.end;
          completed.push(current);
        }
        break;
 
      case 'Work Stealing':
        const queues: Process[][] = [[], []];
        queue.forEach((p, i) => queues[i % 2].push(p));
 
        while (queues.some(q => q.length)) {
          for (let i = 0; i < queues.length; i++) {
            if (!queues[i].length) {
              const otherQueue = queues.find((q, idx) => idx !== i && q.length);
              if (otherQueue?.length) {
                queues[i].push(otherQueue.pop()!);
              }
            }
 
            const current = queues[i].shift();
            if (!current) continue;
 
            time = Math.max(time, current.arrival);
            current.start = time;
            current.end = time + current.burst;
            current.wait = current.start - current.arrival;
            current.turnaround = current.end - current.arrival;
            time = current.end;
            completed.push(current);
          }
        }
        break;
 
      default:
        throw new Error(`Unknown algorithm: ${algorithm}`);
    }
 
    const avgWait = +(completed.reduce((sum, p) => sum + p.wait!, 0) / completed.length).toFixed(2);
    const avgTurnaround = +(completed.reduce((sum, p) => sum + p.turnaround!, 0) / completed.length).toFixed(2);
    const totalBurst = completed.reduce((sum, p) => sum + p.originalBurst!, 0);
    const cpuUtilization = +((totalBurst / time) * 100).toFixed(2);
 
    return { avgWait, avgTurnaround, cpuUtilization };
  }
}
