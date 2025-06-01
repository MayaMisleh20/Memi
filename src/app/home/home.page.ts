import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, NavController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

interface Algorithm {
  name: string;
  route: string;
  description: string;
  detail: string;
  icon: string;
  pathPrefix?: string; // optional: 'game' or undefined
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements AfterViewInit {
  @ViewChild('cardsContainer', { static: false }) cardsContainer: any;
  currentIndex = 0;

  algorithms: Algorithm[] = [
    { name: 'Shortest Job First (SJF)', route: 'sjf', description: 'Selects process with the smallest execution time.', detail: 'Non-preemptive scheduling based on burst time. Minimizes average waiting time but may cause starvation.', icon: 'flash-outline' ,pathPrefix: 'sjf'},
    { name: 'Priority Scheduling', route: 'priority', description: 'Selects the process with the highest priority.', detail: 'Can be preemptive or non-preemptive. High priority jobs run first. Low-priority jobs may starve.', icon: 'pricetag-outline' },
    { name: 'First-Come, First-Served', route: 'fcfs', description: 'Processes run in arrival order.', detail: 'A simple FIFO queue scheduler. Easy to implement but can suffer from long wait times if a big job goes first.', icon: 'time-outline' },
    { name: 'Round Robin', route: 'round-robin', description: 'Each process gets a fixed time slice.', detail: 'Fair time-sharing by rotating through processes. Responsive for interactive apps, but high context-switch overhead if quanta are too small.', icon: 'sync-outline' },
    { name: 'Work Stealing', route: 'work-steal', description: 'Idle cores steal tasks.', detail: 'Dynamic load balancing: idle processors "steal" tasks from busy ones, improving throughput on multi-core systems.', icon: 'download-outline' },
    { name: 'Lottery Scheduling', route: 'ls', description: 'Randomized ticket-based allocation.', detail: 'Processes are assigned a number of tickets; the scheduler randomly draws a ticket to select the next process, ensuring probabilistic fairness and flexible priority control.', icon: 'people-outline' },
    { name: 'RTM (Rate Monotonic Scheduling)', route: 'rtm', description: 'Fixed-priority periodic scheduling.', detail: 'Processes are assigned fixed priorities based on their request rates; shorter-period tasks get higher priority, optimizing response times for periodic tasks.', icon: 'hardware-chip-outline' },
    { name: 'Stride Scheduling', route: 'stride', description: 'Deterministic proportional-share scheduling.', detail: 'Each process is assigned a stride value and a pass counter; the scheduler always picks the process with the lowest pass, ensuring deterministic proportional resource allocation over time.', icon: 'people-circle-outline' },
  ];

  constructor(private navCtrl: NavController, private alertCtrl: AlertController, private router: Router) {}

  ngAfterViewInit() {}

  onScroll(ev: any) {
    const el = ev.target as HTMLElement;
    const cardEl = el.querySelector('.card') as HTMLElement;
    const cardWidth = cardEl?.clientWidth + 16 || 0;
    this.currentIndex = Math.round(el.scrollLeft / cardWidth);
  }

  go(alg: Algorithm) {
    this.router.navigate([`/game/${alg.route}`]);
  }

  async openHelp() {
    const alert = await this.alertCtrl.create({
      header: 'How to Play',
      message: 'Swipe through the algorithm cards and tap “Try” to run the CPU scheduling simulation for that algorithm. Use the bottom cards to access Leaderboard, Tutorial, or AI Coach.',
      buttons: ['OK'],
    });
    await alert.present();
  }

  navigateToLeaderboard() {
    this.navCtrl.navigateForward('/leaderboard');
  }

  openTutorial() {
    this.navCtrl.navigateForward('/tutorial');
  }

  openComp() {
    this.navCtrl.navigateForward('/battle-mode');
  }

  openSettings() {
    this.navCtrl.navigateForward('/ai-coach');
  }
}
