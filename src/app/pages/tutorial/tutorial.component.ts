import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, NavController } from '@ionic/angular';

@Component({
  selector: 'app-tutorial',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.scss'],
})
export class TutorialComponent {
  constructor(private nav: NavController) {}

  steps = [
    {
      title: 'Pick an Algorithm',
      description: 'Swipe through the cards and tap <strong>Try</strong> to begin.'
    },
    {
      title: 'Generate Processes',
      description: 'Random burst and arrival times will be created automatically.'
    },
    {
      title: 'Watch It Run',
      description: 'Processes move through the queue and execute in real time.'
    },
    {
      title: 'Review Metrics',
      description: 'Analyze CPU usage, average waiting time, and turnaround.'
    },
    {
      title: 'Try Again',
      description: 'Restart or test a different algorithm to compare results.'
    }
  ];

  goHome(): void {
    this.nav.navigateBack('/leaderboard');
  }

  goTutorial(): void {
    this.nav.navigateForward('/ai-coach');
  }

  back(): void {
    this.nav.navigateForward('/home');
  }
}
