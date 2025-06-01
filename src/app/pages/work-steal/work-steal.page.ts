import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LottieComponent } from 'ngx-lottie';
import {
  IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonContent, IonInput, IonItem, IonLabel, IonToolbar, IonHeader, IonTitle,
  IonButtons, IonBackButton, IonIcon, IonCardSubtitle, IonAccordionGroup, IonAccordion
} from '@ionic/angular/standalone';

interface Task {
  id: string;
  duration: number;
  highlight?: boolean;
}

interface CPUCore {
  id: string;
  queue: Task[];
  isIdle: boolean;
  currentTask?: Task;
  timeLeft: number;
}

@Component({
  selector: 'app-work-steal',
  standalone: true,
  templateUrl: './work-steal.page.html',
  styleUrls: ['./work-steal.page.scss'],
  imports: [
    CommonModule, FormsModule, LottieComponent, IonButton, IonCard, IonCardHeader,
    IonCardTitle, IonCardContent, IonContent, IonInput, IonItem, IonLabel, IonToolbar,
    IonHeader, IonTitle, IonButtons, IonBackButton, IonIcon, IonCardSubtitle,
    IonAccordionGroup, IonAccordion,
  ],
})
export class WorkStealPage implements OnInit {
  taskInput: Task = { id: '', duration: 1 };
  cpuCores: CPUCore[] = [];
  logs: string[] = [];
  showTutorialModal = false;

  cpuAnimationOptions = {
    path: 'assets/cpu (1).json',
    autoplay: true,
    loop: true,
  };

  sampleCores = [
    { id: 1, color: '#e74c3c' },
    { id: 2, color: '#3498db' },
    { id: 3, color: '#2ecc71' },
    { id: 4, color: '#f1c40f' },
  ];

  ngOnInit(): void {
    this.cpuCores = [
      { id: 'CPU 1', queue: [], isIdle: true, timeLeft: 0 },
      { id: 'CPU 2', queue: [], isIdle: true, timeLeft: 0 },
      { id: 'CPU 3', queue: [], isIdle: true, timeLeft: 0 },
    ];
  }

  openTutorial(): void {
    this.showTutorialModal = true;
  }

  addTask(coreIndex: number): void {
    if (!this.taskInput.id.trim()) return;
    this.cpuCores[coreIndex].queue.push({ ...this.taskInput });
    this.taskInput = { id: '', duration: 1 };
  }

  autoAssignTask(): void {
    if (!this.taskInput.id.trim()) return;
    const target = this.cpuCores.reduce((min, core) =>
      core.queue.length < min.queue.length ? core : min
    );
    target.queue.push({ ...this.taskInput });
    this.taskInput = { id: '', duration: 1 };
  }

  simulateStealing(): void {
    console.log('Simulate steal triggered');
    const idleCore = this.cpuCores.find((core) => core.queue.length === 0 && core.isIdle);
    const busiest = this.cpuCores.reduce((max, core) =>
      core.queue.length > max.queue.length ? core : max
    );
  
    console.log('Idle core:', idleCore, 'Busiest core:', busiest);
  
    if (idleCore && busiest.queue.length > 1) {
      const stolenTask = busiest.queue.pop();
      if (stolenTask) {
        stolenTask.highlight = true;
        idleCore.queue.push(stolenTask);
        this.logs.unshift(`${idleCore.id} stole ${stolenTask.id} from ${busiest.id}`);
        setTimeout(() => {
          stolenTask.highlight = false;
        }, 2000);
      }
    }
  }
  

  runSimulation(): void {
    for (const core of this.cpuCores) {
      if (core.isIdle && core.queue.length > 0) {
        const task = core.queue.shift();
        if (task) {
          core.currentTask = task;
          core.timeLeft = task.duration;
          core.isIdle = false;
          this.executeTask(core);
        }
      }
    }
  }

  private executeTask(core: CPUCore): void {
    const interval = setInterval(() => {
      core.timeLeft--;
      if (core.timeLeft <= 0) {
        clearInterval(interval);
        this.logs.unshift(`${core.id} completed ${core.currentTask?.id}`);
        core.currentTask = undefined;
        core.isIdle = true;
        this.simulateStealing();
        this.runSimulation();
      }
    }, 1000);
  }
}
