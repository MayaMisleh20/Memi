import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { ChangeDetectorRef } from '@angular/core';

interface Process {
  pid: number;
  priority: number;
  stride: number;
  pass: number;
}

interface GanttEntry {
  pid: number | null;
  start: number;
  end: number;
}

@Component({
  selector: 'app-stride',
  templateUrl: './stride.page.html',
  styleUrls: ['./stride.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
})
export class StridePage implements OnInit {
  numProcesses: number = 2;
  totalTicks: number = 20;
  processes: Process[] = [];
  ganttChart: GanttEntry[] = [];

  showResult = false;
  showTutorialModal = false;

  sampleProcesses = [
    { id: 1, color: '#e74c3c' },
    { id: 2, color: '#3498db' },
    { id: 3, color: '#2ecc71' },
    { id: 4, color: '#f1c40f' },
  ];

  constructor(private navCtrl: NavController, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.initProcesses(); // ✅ safely run here, not in constructor
  }

  openTutorial() {
    this.showTutorialModal = true;
  }

  initProcesses() {
    if (this.numProcesses < 1) {
      this.processes = [];
      return;
    }

    this.processes = Array.from({ length: this.numProcesses }, (_, i) => ({
      pid: i + 1,
      priority: 1 + i,
      stride: Math.floor(10000 / (1 + i)),
      pass: 0,
    }));

    this.ganttChart = [];
    this.showResult = false;
    this.cdr.detectChanges();
  }

  simulateStride() {
    if (this.processes.length === 0) {
      alert('Please initialize processes first.');
      return;
    }

    const queue = this.processes.map((p) => ({
      ...p,
      stride: Math.floor(10000 / p.priority),
      pass: 0,
    }));

    const chart: GanttEntry[] = [];

    for (let time = 0; time < this.totalTicks; time++) {
      queue.sort((a, b) => a.pass - b.pass);
      const current = queue[0];

      const last = chart[chart.length - 1];
      if (last && last.pid === current.pid) {
        last.end++;
      } else {
        chart.push({ pid: current.pid, start: time, end: time + 1 });
      }

      current.pass += current.stride;
    }

    this.ganttChart = chart;
    this.showResult = true;
    this.cdr.detectChanges();
  }

  resetAll() {
    this.numProcesses = 2;
    this.processes = [];
    this.ganttChart = [];
    this.showResult = false;
    this.initProcesses();
  }

  back() {
    this.navCtrl.back();
  }
}
