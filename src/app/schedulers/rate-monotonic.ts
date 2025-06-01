export interface Task {
    id: number;
    period: number;
    burst: number;
  }
   
  export interface GanttEntry {
    taskId: number | null;
    start: number;
    end: number;
  }
   
  export interface SimulationResult {
    ganttChart: GanttEntry[];
    utilization: number;
    missedDeadline: boolean;
    deadlineMissedTasks: number[]; // optional
  }
   
  function gcd(a: number, b: number): number {
    return b === 0 ? a : gcd(b, a % b);
  }
   
  function lcm(a: number, b: number): number {
    return (a * b) / gcd(a, b);
  }
   
  export function utilizationBound(n: number): number {
    return n * (Math.pow(2, 1 / n) - 1);
  }
   
  export function simulateRTM(tasks: Task[]): SimulationResult {
    const utilization = tasks.reduce((sum, t) => sum + t.burst / t.period, 0);
    const hyperPeriod = tasks.reduce((lcmVal, t) => lcm(lcmVal, t.period), 1);
    const ganttChart: GanttEntry[] = [];
    const deadlineMissedTasks = new Set<number>();
   
    const jobs: {
      taskId: number;
      remaining: number;
      period: number;
      deadline: number;
      release: number;
    }[] = [];
   
    let missedDeadline = false;
   
    for (let time = 0; time < hyperPeriod; time++) {
      // Release jobs
      for (const task of tasks) {
        if (time % task.period === 0) {
          jobs.push({
            taskId: task.id,
            remaining: task.burst,
            period: task.period,
            deadline: time + task.period,
            release: time,
          });
        }
      }
   
      // Check deadline misses
      for (const job of jobs) {
        if (time === job.deadline && job.remaining > 0) {
          missedDeadline = true;
          deadlineMissedTasks.add(job.taskId);
        }
      }
   
      // Pick highest priority (shortest period)
      const available = jobs.filter(j => j.remaining > 0).sort((a, b) => a.period - b.period);
   
      if (available.length > 0) {
        const current = available[0];
        current.remaining--;
   
        const last = ganttChart[ganttChart.length - 1];
        if (last && last.taskId === current.taskId) {
          last.end++;
        } else {
          ganttChart.push({ taskId: current.taskId, start: time, end: time + 1 });
        }
      } else {
        const last = ganttChart[ganttChart.length - 1];
        if (last && last.taskId === null) {
          last.end++;
        } else {
          ganttChart.push({ taskId: null, start: time, end: time + 1 });
        }
      }
    }
   
    return {
      ganttChart,
      utilization,
      missedDeadline,
      deadlineMissedTasks: Array.from(deadlineMissedTasks)
    };
  }
  
  