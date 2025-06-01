export interface PriorityProcess {
    id: number;
    arrivalTime: number;
    burstTime: number;
    priority: number;
  }
   
  export interface SolvedPriorityProcess extends PriorityProcess {
    finishTime: number;
    turnaroundTime: number;
    waitingTime: number;
  }
   
  export interface PriorityResult {
    schedule: SolvedPriorityProcess[];
    averageWaitingTime: number;
    averageTurnaroundTime: number;
  }
   
  export function runPriorityScheduling(
    processes: PriorityProcess[],
    isPreemptive: boolean
  ): PriorityResult {
    const proc = JSON.parse(JSON.stringify(processes)) as PriorityProcess[];
    const n = proc.length;
    const done: boolean[] = Array(n).fill(false);
    const remaining = proc.map(p => p.burstTime);
    const result: SolvedPriorityProcess[] = [];
   
    let time = 0;
    let completed = 0;
   
    while (completed < n) {
      const candidates = proc
        .map((p, i) => ({ ...p, index: i }))
        .filter(p => p.arrivalTime <= time && !done[p.index]);
   
      let next;
      if (candidates.length > 0) {
        next = candidates.reduce((a, b) =>
          a.priority < b.priority ? a : b
        );
      }
   
      if (!next) {
        time++;
        continue;
      }
   
      const i = next.index;
   
      if (isPreemptive) {
        remaining[i]--;
        if (remaining[i] === 0) {
          const finishTime = time + 1;
          const tat = finishTime - proc[i].arrivalTime;
          const wt = tat - proc[i].burstTime;
   
          result.push({
            ...proc[i],
            finishTime,
            turnaroundTime: tat,
            waitingTime: wt
          });
   
          done[i] = true;
          completed++;
        }
        time++;
      } else {
        const start = time;
        const finish = start + proc[i].burstTime;
        const tat = finish - proc[i].arrivalTime;
        const wt = tat - proc[i].burstTime;
   
        result.push({
          ...proc[i],
          finishTime: finish,
          turnaroundTime: tat,
          waitingTime: wt
        });
   
        done[i] = true;
        time = finish;
        completed++;
      }
    }
   
    const avgWT = result.reduce((sum, p) => sum + p.waitingTime, 0) / n;
    const avgTAT = result.reduce((sum, p) => sum + p.turnaroundTime, 0) / n;
   
    return {
      schedule: result.sort((a, b) => a.id - b.id),
      averageWaitingTime: avgWT,
      averageTurnaroundTime: avgTAT
    };
  }