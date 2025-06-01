import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';

@Component({
  selector: 'app-ai-coach',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  templateUrl: './ai-coach.page.html',
  styleUrls: ['./ai-coach.page.scss'],
})
export class AiCoachPage implements OnInit {
  questions = [
    {
      title: 'How do your processes arrive?',
      tip: 'Some algorithms work better when all processes are known upfront. Others are suited for dynamic or real-time arrivals.',
      options: [
        'All at once at the beginning',
        'Arrive randomly over time',
        'Periodically at fixed intervals',
        'User-driven or unpredictable'
      ],
    },
    {
      title: 'Do processes have clear priority levels?',
      tip: 'Explicit priorities help distinguish tasks in systems like Priority Scheduling or RTM.',
      options: [
        'Yes, strict priorities are defined',
        'Some loose prioritization exists',
        'No, all tasks are roughly equal',
        'Priority is decided probabilistically'
      ],
    },
    {
      title: 'Are some tasks real-time or periodic?',
      tip: 'Real-time tasks require predictability and deadline awareness. Periodic behavior fits RTM well.',
      options: [
        'Yes, tasks repeat periodically',
        'Yes, deadlines are important',
        'Somewhat, but flexible',
        'Not at all'
      ],
    },
    {
      title: 'Is fairness between processes important?',
      tip: 'Fairness prevents starvation and distributes CPU time evenly.',
      options: [
        'Yes, fairness is essential',
        'Fairness matters, but not the most',
        'No, prioritize efficiency',
        'Fairness is probabilistic'
      ],
    },
    {
      title: 'Are some jobs much shorter than others?',
      tip: 'If yes, SJF or stride algorithms can optimize waiting time.',
      options: [
        'Yes, jobs vary greatly',
        'Mostly similar lengths',
        'Sometimes varied',
        'Hard to predict'
      ],
    },
    {
      title: 'Do you need deterministic scheduling?',
      tip: 'Determinism ensures predictability. Important for real-time or safety-critical systems.',
      options: [
        'Yes, it must be predictable',
        'Preferably, but not required',
        'No, dynamic adaptation is okay',
        'Unpredictability is acceptable'
      ],
    },
    {
      title: 'How are resources managed between processors or cores?',
      tip: 'Work stealing is ideal for multi-core systems with distributed task queues.',
      options: [
        'Centralized queue – no stealing',
        'Independent queues with balancing',
        'Tasks migrate between cores',
        'Unaware of processor layout'
      ],
    }
  ];

  answers: string[] = [];
  currentIndex = 0;
  recommendation: string | null = null;
  explanation: string | null = null;

  constructor(private nav: NavController) {}

  ngOnInit(): void {
    this.answers = Array(this.questions.length).fill('');
  }

  selectOption(option: string) {
    this.answers[this.currentIndex] = option;
  }

  nextQuestion() {
    if (this.currentIndex < this.questions.length - 1) {
      this.currentIndex++;
    } else {
      this.makeRecommendation();
      this.currentIndex++;
    }
  }

  makeRecommendation() {
    const [arrival, priority, periodic, fairness, jobVariance, deterministic, resourceHandling] =
      this.answers.map(a => a.toLowerCase());

    if (this.answers.includes('')) {
      this.recommendation = 'Incomplete';
      this.explanation = 'Please answer all the questions before getting a recommendation.';
      return;
    }

    if (periodic.includes('periodically')) {
      this.recommendation = 'Rate-Monotonic Scheduling (RTM)';
      this.explanation = 'RTM is optimal for periodic, real-time systems. <a href="https://microcontrollerslab.com/rate-monotonic-scheduling-algorithm/" target="_blank">Learn more</a>';
    } else if (fairness.includes('essential') && resourceHandling.includes('between cores')) {
      this.recommendation = 'Work Stealing';
      this.explanation = 'Used in parallel systems like Cilk or Go runtime. Tasks are dynamically balanced. <a href="https://medium.com/a-journey-with-go/go-work-stealing-in-go-scheduler-d439231be64d" target="_blank">Learn more</a>';
    } else if (priority.includes('strict') && !periodic.includes('periodically')) {
      this.recommendation = 'Priority Scheduling';
      this.explanation = 'Good for systems where critical tasks must run first. <a href="https://www.geeksforgeeks.org/program-for-priority-cpu-scheduling-set-1/" target="_blank">Learn more</a>';
    } else if (jobVariance.includes('vary greatly') && deterministic.includes('predictable')) {
      this.recommendation = 'Shortest Job First (SJF)';
      this.explanation = 'Minimizes waiting time for short tasks. Best when burst times are known. <a href="https://www.geeksforgeeks.org/program-for-shortest-job-first-or-sjf-cpu-scheduling-set-1-non-preemptive/" target="_blank">Learn more</a>';
    } else if (fairness.includes('probabilistic') || priority.includes('probabilistically')) {
      this.recommendation = 'Lottery Scheduling';
      this.explanation = 'Randomized scheduling with weighted probabilities. <a href="https://www.geeksforgeeks.org/lottery-process-scheduling-in-operating-system/" target="_blank">Learn more</a>';
    } else if (fairness.includes('essential')) {
      this.recommendation = 'Round Robin';
      this.explanation = 'Allocates time slices fairly among all tasks. Used in time-sharing OS. <a href="https://www.geeksforgeeks.org/program-for-round-robin-scheduling-for-the-same-arrival-time/" target="_blank">Learn more</a>';
    } else if (jobVariance.includes('vary') && !deterministic.includes('predictable')) {
      this.recommendation = 'Stride Scheduling';
      this.explanation = 'A deterministic form of Lottery Scheduling, suited for varied task sizes. <a href="https://cseweb.ucsd.edu/classes/sp99/cse221/projects/Scheduling.pdf" target="_blank">Learn more</a>';
    } else if (arrival.includes('all at once')) {
      this.recommendation = 'First-Come, First-Served (FCFS)';
      this.explanation = 'Simple scheduling based on arrival order. <a href="https://www.geeksforgeeks.org/first-come-first-serve-cpu-scheduling-non-preemptive/" target="_blank">Learn more</a>';
    } else {
      this.recommendation = 'Round Robin';
      this.explanation = 'Default fallback choice when fairness and simplicity matter. <a href="https://www.geeksforgeeks.org/program-for-round-robin-scheduling-for-the-same-arrival-time/" target="_blank">Learn more</a>';
    }
  }

  goToAlgorithm() {
    const routeMap: Record<string, string> = {
      'First-Come, First-Served (FCFS)': '/game/fcfs',
      'Shortest Job First (SJF)': '/game/sjf',
      'Priority Scheduling': '/game/priority',
      'Round Robin': '/game/round-robin',
      'Rate-Monotonic Scheduling (RTM)': '/game/rtm',
      'Stride Scheduling': '/game/stride',
      'Lottery Scheduling': '/game/ls',
      'Work Stealing': '/game/work-steal'
    };

    const path = this.recommendation ? routeMap[this.recommendation] : undefined;
    if (path) {
      this.nav.navigateForward(path);
    } else {
      console.error('No route found for', this.recommendation);
    }
  }

  toSentenceCase(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }
}
