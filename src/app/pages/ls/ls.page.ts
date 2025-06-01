import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LottieComponent } from 'ngx-lottie';
import { ChangeDetectorRef } from '@angular/core';

interface Process {
  name: string;
  tickets: number;
  color?: string;
}
@Component({
  selector: 'app-ls',
  templateUrl: './ls.page.html',
  styleUrls: ['./ls.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LottieComponent
  ],
})
export class LSPage {
  processName = '';
  ticketCount: number = 0;
  cpuCount: number = 1;
  processes: Process[] = [];
  selectedProcesses: string[] = [];
  studentPrediction = '';
  predictionResult = '';
  predictionProbability = '';
  showResult = false;
  showTutorialModal = false;

  colorOptions = [
    { value: '#e74c3c', name: 'Red' },
    { value: '#3498db', name: 'Blue' },
    { value: '#2ecc71', name: 'Green' },
    { value: '#f1c40f', name: 'Yellow' },
    { value: '#9b59b6', name: 'Purple' },
    { value: '#e67e22', name: 'Orange' },
  ];

  sampleProcesses = [
    { name: 'P1', color: '#e74c3c' },
    { name: 'P2', color: '#3498db' },
    { name: 'P3', color: '#2ecc71' },
    { name: 'P4', color: '#f1c40f' },
  ];

  constructor(private cdr: ChangeDetectorRef) {}

  openTutorial() {
    this.showTutorialModal = true;
  }

  lottieOptions = {
    path: 'assets/Animation.json', // or confetti.json
    autoplay: true,
    loop: true
  };
  
  addProcess() {
    if (this.processName.trim() && this.ticketCount > 0) {
      const color = this.colorOptions[this.processes.length % this.colorOptions.length].value;
      this.processes.push({ name: this.processName.trim(), tickets: this.ticketCount, color });
      this.processName = '';
      this.ticketCount = 0;
      this.cdr.detectChanges();
    }
  }

  deleteProcess(index: number) {
    this.processes.splice(index, 1);
    this.cdr.detectChanges();
  }

  calculateProbability(processName: string): number {
    const totalTickets = this.processes.reduce((sum, p) => sum + p.tickets, 0);
    const proc = this.processes.find(p => p.name === processName);
    return proc ? (proc.tickets / totalTickets) * 100 : 0;
  }

  runLottery() {
    if (this.processes.length === 0 || !this.studentPrediction) return;

    this.selectedProcesses = [];
    for (let i = 0; i < this.cpuCount; i++) {
      const winner = this.pickWinner();
      this.selectedProcesses.push(winner);
    }

    const firstCpuWinner = this.selectedProcesses[0];
    const predicted = this.studentPrediction;
    const probability = this.calculateProbability(predicted);

    this.predictionProbability = probability.toFixed(2) + '%';
    this.predictionResult = predicted === firstCpuWinner ? 'Correct!' : 'Incorrect';
    this.showResult = true;
    this.cdr.detectChanges();
  }

  pickWinner(): string {
    const ticketPool: string[] = [];
    this.processes.forEach(proc => {
      for (let i = 0; i < proc.tickets; i++) {
        ticketPool.push(proc.name);
      }
    });

    if (ticketPool.length === 0) return 'No Winner';
    const randomIndex = Math.floor(Math.random() * ticketPool.length);
    return ticketPool[randomIndex];
  }

  reset() {
    this.processName = '';
    this.ticketCount = 0;
    this.cpuCount = 1;
    this.processes = [];
    this.selectedProcesses = [];
    this.studentPrediction = '';
    this.showResult = false;
    this.predictionResult = '';
    this.predictionProbability = '';
    this.cdr.detectChanges();
  }
}
