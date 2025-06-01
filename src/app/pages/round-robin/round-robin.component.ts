import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonButton, IonInput, IonText, IonButtons
} from '@ionic/angular/standalone';
import { RoundRobinService, ProcessInfo, GanttChartInfo } from 'src/app/services/round-robin.service';

@Component({
  selector: 'app-round-robin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonLabel,
    IonButton,
    IonInput,
    IonText,
    IonButtons
  ],
  templateUrl: './round-robin.component.html',
  styleUrls: ['./round-robin.component.scss']
})
export class RoundRobinPage {
  arrivalTimesInput = '';
  burstTimesInput = '';
  timeQuantum = 2;

  solvedProcesses: ProcessInfo[] = [];
  ganttChart: GanttChartInfo[] = [];

  avgTat = 0;
  avgWat = 0;

  userResults: Array<{ waitingTime: number; turnaroundTime: number }> = [];
  correctAnswers: boolean[] = [];

  showCheck = false;
  showAnswer = false;
  userChecked = false;

  constructor(private rr: RoundRobinService) {}

  trySolving() {
    this.solve();
    this.showCheck = true;
    this.showAnswer = false;
    this.userChecked = false;
    this.userResults = this.solvedProcesses.map(() => ({
      waitingTime: 0,
      turnaroundTime: 0
    }));
    this.correctAnswers = [];
  }

  revealAnswer() {
    this.solve();
    this.showCheck = false;
    this.showAnswer = true;
  }

  checkUserAnswers() {
    this.correctAnswers = this.solvedProcesses.map((actual, i) => {
      const userWT = this.userResults[i].waitingTime;
      const userTAT = this.userResults[i].turnaroundTime;
      return actual.wat === userWT && actual.tat === userTAT;
    });
    this.userChecked = true;
  }

  solve() {
    const arrivalTimes = this.arrivalTimesInput.trim().split(/\s+/).map(Number);
    const burstTimes = this.burstTimesInput.trim().split(/\s+/).map(Number);

    const result = this.rr.rr(arrivalTimes, burstTimes, this.timeQuantum);
    this.solvedProcesses = result.solvedProcessesInfo;
    this.ganttChart = result.ganttChartInfo;

    const totalTAT = this.solvedProcesses.reduce((sum, p) => sum + p.tat, 0);
    const totalWT = this.solvedProcesses.reduce((sum, p) => sum + p.wat, 0);
    this.avgTat = totalTAT / this.solvedProcesses.length;
    this.avgWat = totalWT / this.solvedProcesses.length;
  }

  back() {
    history.back();
  }
}
