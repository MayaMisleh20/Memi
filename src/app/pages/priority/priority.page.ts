import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, NavController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

interface Process {
  id: number;
  arrivalTime: number;
  burstTime: number;
  priority: number;
}

interface SolvedProcess extends Process {
  waitingTime: number;
  turnaroundTime: number;
  finishTime: number;
}

@Component({
  selector: 'app-priority',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
  templateUrl: './priority.page.html',
  styleUrls: ['./priority.page.scss'],
})
export class PriorityPage {
  numProcesses = 0;
  isPreemptive = false;
  processes: Process[] = [];
  userResults: { waitingTime: number; turnaroundTime: number }[] = [];

  result: {
    schedule: SolvedProcess[];
    averageWaitingTime: number;
    averageTurnaroundTime: number;
  } | null = null;

  showCheck = false;
  showAnswer = false;
  userChecked = false;
  correctAnswers: boolean[] = [];

  constructor(private nav: NavController) {}

  back() {
    this.nav.navigateBack('/home');
  }

  initProcesses() {
    this.processes = Array.from({ length: this.numProcesses }, (_, i) => ({
      id: i + 1,
      arrivalTime: 0,
      burstTime: 0,
      priority: 0,
    }));
    this.userResults = Array.from({ length: this.numProcesses }, () => ({
      waitingTime: 0,
      turnaroundTime: 0,
    }));
    this.result = null;
    this.showAnswer = false;
    this.showCheck = false;
    this.userChecked = false;
    this.correctAnswers = [];
  }

  runScheduling() {
    const proc = JSON.parse(JSON.stringify(this.processes)) as Process[];
    const result: SolvedProcess[] = [];
    const n = proc.length;
    let time = 0;
    let completed = 0;
    const done: boolean[] = Array(n).fill(false);
    const remaining = proc.map(p => p.burstTime);

    while (completed < n) {
      const candidates = proc
        .map((p, i) => ({ ...p, index: i }))
        .filter(p => p.arrivalTime <= time && !done[p.index]);

      let next;
      if (candidates.length > 0) {
        next = candidates.reduce((a, b) =>
          a.priority < b.priority ? a : b
        );
      }

      if (!next) {
        time++;
        continue;
      }

      const i = next.index;
      if (this.isPreemptive) {
        remaining[i]--;
        if (remaining[i] === 0) {
          const finishTime = time + 1;
          const tat = finishTime - proc[i].arrivalTime;
          const wt = tat - proc[i].burstTime;

          result.push({
            ...proc[i],
            finishTime,
            turnaroundTime: tat,
            waitingTime: wt,
          });
          done[i] = true;
          completed++;
        }
        time++;
      } else {
        const start = time;
        const finish = start + proc[i].burstTime;
        const tat = finish - proc[i].arrivalTime;
        const wt = tat - proc[i].burstTime;

        result.push({
          ...proc[i],
          finishTime: finish,
          turnaroundTime: tat,
          waitingTime: wt,
        });
        time = finish;
        done[i] = true;
        completed++;
      }
    }

    const avgWT = result.reduce((a, b) => a + b.waitingTime, 0) / n;
    const avgTAT = result.reduce((a, b) => a + b.turnaroundTime, 0) / n;

    this.result = {
      schedule: result.sort((a, b) => a.id - b.id),
      averageWaitingTime: avgWT,
      averageTurnaroundTime: avgTAT,
    };
  }

  trySolving() {
    this.runScheduling();
    this.showCheck = true;
    this.showAnswer = false;
    this.userChecked = false;
  }

  revealAnswer() {
    this.runScheduling();
    this.showAnswer = true;
    this.showCheck = false;
  }

  checkUserAnswers() {
    if (!this.result) return;
    this.correctAnswers = this.result.schedule.map((res, index) => {
      const userWT = this.userResults[index].waitingTime;
      const userTAT = this.userResults[index].turnaroundTime;
      return res.waitingTime === userWT && res.turnaroundTime === userTAT;
    });
    this.userChecked = true;
  }
}
