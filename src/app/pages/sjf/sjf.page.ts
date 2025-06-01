import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ChangeDetectorRef } from '@angular/core';

interface Process {
  pid: number;
  priority: number;
  stride: number;
  pass: number;
}

interface GanttEntry {
  pid: number;
  start: number;
  end: number;
}

@Component({
  selector: 'app-sjf',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
  templateUrl: './sjf.page.html',
  styleUrls: ['./sjf.page.scss'],
})
export class StridePage implements OnInit {
  numProcesses: number = 3;
  totalTicks: number = 20;
  processes: Process[] = [];
  ganttChart: GanttEntry[] = [];

  showResult = false;
  showTutorialModal = false;

  bigNumber = 10000; // used for stride calculation

  // Colors for processes
  colorPalette: string[] = ['#e74c3c', '#3498db', '#2ecc71', '#f1c40f', '#9b59b6', '#e67e22'];

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.initProcesses();
  }

  openTutorial() {
    this.showTutorialModal = true;
  }

  initProcesses() {
    this.processes = Array.from({ length: this.numProcesses }, (_, i) => ({
      pid: i + 1,
      priority: i + 1, // default increasing priority
      stride: Math.floor(this.bigNumber / (i + 1)),
      pass: 0,
    }));

    this.ganttChart = [];
    this.showResult = false;
    this.cdr.detectChanges();
  }

  simulateStride() {
    const queue = this.processes.map(p => ({ ...p }));
    const chart: GanttEntry[] = [];

    for (let time = 0; time < this.totalTicks; time++) {
      queue.sort((a, b) => a.pass - b.pass);
      const current = queue[0];

      // Update or extend Gantt entry
      const last = chart[chart.length - 1];
      if (last && last.pid === current.pid) {
        last.end++;
      } else {
        chart.push({ pid: current.pid, start: time, end: time + 1 });
      }

      // Update pass
      current.pass += current.stride;
    }

    this.ganttChart = chart;
    this.showResult = true;
    this.cdr.detectChanges();
  }

  resetAll() {
    this.numProcesses = 3;
    this.processes = [];
    this.ganttChart = [];
    this.showResult = false;
    this.initProcesses();
  }

  getProcessColor(pid: number): string {
    const index = (pid - 1) % this.colorPalette.length;
    return this.colorPalette[index];
  }
}
