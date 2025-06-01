export interface Process {
    id: number;
    arrivalTime: number;
    burstTime: number;
    color?: string; // optional for logic purposes
  }
   
  export interface ScheduledBlock {
    id: number;
    startTime: number;
    endTime: number;
  }
   
  export interface ProcessResult extends Process {
    finishTime: number;
    waitingTime: number;
    turnaroundTime: number;
  }
   
  export interface SjfResult {
    schedule: ScheduledBlock[];
    processResults: ProcessResult[];
    avgWaitingTime: number;
    avgTurnaroundTime: number;
    cpuUtilization: number;
  }
   
  /**
  * Executes Non-preemptive Shortest Job First (SJF) Scheduling
  * @param processes Array of Process objects
  * @returns Full scheduling result (Gantt chart, stats, process times)
  */
  export function executeSJF(processes: Process[]): SjfResult {
    const queue: Process[] = [...processes].map(p => ({ ...p }));
    const schedule: ScheduledBlock[] = [];
    const details: ProcessResult[] = [];
   
    let currentTime = 0;
    let totalWaitingTime = 0;
    let totalTurnaroundTime = 0;
    const readyQueue: Process[] = [];
   
    queue.sort((a, b) => a.arrivalTime - b.arrivalTime);
   
    while (queue.length > 0 || readyQueue.length > 0) {
      // Move arrived processes to ready queue
      while (queue.length > 0 && queue[0].arrivalTime <= currentTime) {
        readyQueue.push(queue.shift()!);
      }
   
      if (readyQueue.length === 0) {
        // CPU idle
        const nextArrival = queue[0].arrivalTime;
        schedule.push({ id: -1, startTime: currentTime, endTime: nextArrival });
        currentTime = nextArrival;
        continue;
      }
   
      // Pick process with shortest burst time
      readyQueue.sort((a, b) => a.burstTime - b.burstTime);
      const proc = readyQueue.shift()!;
   
      const startTime = currentTime;
      const endTime = startTime + proc.burstTime;
      const turnaroundTime = endTime - proc.arrivalTime;
      const waitingTime = startTime - proc.arrivalTime;
   
      totalWaitingTime += waitingTime;
      totalTurnaroundTime += turnaroundTime;
   
      schedule.push({ id: proc.id, startTime, endTime });
   
      details.push({
        ...proc,
        finishTime: endTime,
        waitingTime,
        turnaroundTime,
      });
   
      currentTime = endTime;
    }
   
    const totalBurst = processes.reduce((sum, p) => sum + p.burstTime, 0);
    const lastFinish = schedule.length > 0 ? schedule[schedule.length - 1].endTime : 0;
   
    return {
      schedule,
      processResults: details,
      avgWaitingTime: totalWaitingTime / details.length,
      avgTurnaroundTime: totalTurnaroundTime / details.length,
      cpuUtilization: lastFinish > 0 ? (totalBurst / lastFinish) * 100 : 0
    };
  }