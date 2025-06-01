import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import {
  LeaderboardEntry,
  LeaderboardService
} from 'src/app/services/leaderboard.service';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss'],
})
export class LeaderboardComponent implements OnInit {
  entries: LeaderboardEntry[] = [];

  constructor(
    public nav: NavController,
    private leaderboardService: LeaderboardService
  ) {}

  ngOnInit(): void {
    this.entries = this.leaderboardService.getEntries();
  }

  sortedEntries(): LeaderboardEntry[] {
    return [...this.entries].sort((a, b) => b.cpuUtilization - a.cpuUtilization);
  }

  goHome(): void {
    this.nav.navigateBack('/home');
  }

  goTutorial(): void {
    this.nav.navigateForward('/tutorial');
  }
}
