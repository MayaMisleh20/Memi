import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/main/main.page').then(m => m.MainPage)
  },

  {
    path: 'tutorial',
    loadComponent: () =>
      import('./pages/tutorial/tutorial.component').then(
        (m) => m.TutorialComponent
      ),
  },
  {
    path: 'leaderboard',
    loadComponent: () =>
      import('./pages/leaderboard/leaderboard.component').then(
        (m) => m.LeaderboardComponent
      ),
  },

  {
    path: 'game/fcfs',
    loadComponent: () =>
      import('./pages/fcfs/fcfs.component').then((m) => m.FcfsComponent),
  },
  {
    path: 'game/round-robin',
    loadComponent: () =>
      import('./pages/round-robin/round-robin.component').then(m => m.RoundRobinPage)
  },
  {
    path: 'ai-coach',
    loadComponent: () => import('./pages/ai-coach/ai-coach.page').then( m => m.AiCoachPage)
  },
  {
    path: 'battle-mode',
    loadComponent: () => import('./pages/battle-mode/battle-mode.page').then( m => m.BattleModePage)
  },
  
  {
    path: 'game/sjf',
    loadComponent: () => import('./pages/sjf/sjf.page').then( m => m.SjfPage)
  },
  {
    path: 'game/priority',
    loadComponent: () => import('./pages/priority/priority.page').then( m => m.PriorityPage)
  },
  
  {
    path: 'game/work-steal',
    loadComponent: () => import('./pages/work-steal/work-steal.page').then( m => m.WorkStealPage)
  },
  {
    path: 'main',
    loadComponent: () => import('./pages/main/main.page').then( m => m.MainPage)
  },
  {
    path: 'sign-in',
    loadComponent: () => import('./pages/sign-in/sign-in.page').then( m => m.SignInPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.page').then( m => m.RegisterPage)
  },

  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then(m => m.HomePage)
  },
  {
    path: 'game/ls',
    loadComponent: () => import('./pages/ls/ls.page').then( m => m.LSPage)
  },
  {
    path: 'game/stride',
    loadComponent: () => import('./pages/stride/stride.page').then( m => m.StridePage)
  },
  {
    path: 'game/rtm',
    loadComponent: () => import('./pages/rtm/rtm.page').then(m => m.RtmPage)
  }
  
  
];
