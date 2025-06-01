export interface ProcessInfo {
    id: number;
    arrivalTime: number;
    burstTime: number;
    remainingTime: number;
    wat: number;
    tat: number;
    finishTime: number;
  }
   
  export interface GanttChartInfo {
    processId: number | null;
    start: number;
    end: number;
  }
   
  export interface RoundRobinResult {
    solvedProcessesInfo: ProcessInfo[];
    ganttChartInfo: GanttChartInfo[];
  }
   
  export function roundRobin(
    arrivalTimes: number[],
    burstTimes: number[],
    timeQuantum: number
  ): RoundRobinResult {
    const n = arrivalTimes.length;
    const processes: ProcessInfo[] = arrivalTimes.map((arrival, i) => ({
      id: i + 1,
      arrivalTime: arrival,
      burstTime: burstTimes[i],
      remainingTime: burstTimes[i],
      wat: 0,
      tat: 0,
      finishTime: 0
    }));
   
    const ganttChart: GanttChartInfo[] = [];
   
    let time = 0;
    const queue: ProcessInfo[] = [];
    const isInQueue: boolean[] = Array(n).fill(false);
    let completed = 0;
   
    while (completed < n) {
      // Add arriving processes to the queue
      for (const p of processes) {
        if (p.arrivalTime <= time && !isInQueue[p.id - 1] && p.remainingTime > 0) {
          queue.push(p);
          isInQueue[p.id - 1] = true;
        }
      }
   
      if (queue.length === 0) {
        ganttChart.push({ processId: null, start: time, end: time + 1 });
        time++;
        continue;
      }
   
      const current = queue.shift()!;
      const execTime = Math.min(current.remainingTime, timeQuantum);
      ganttChart.push({ processId: current.id, start: time, end: time + execTime });
   
      time += execTime;
      current.remainingTime -= execTime;
   
      // Check for newly arrived processes during execution
      for (const p of processes) {
        if (p.arrivalTime > time - execTime && p.arrivalTime <= time && !isInQueue[p.id - 1] && p.remainingTime > 0) {
          queue.push(p);
          isInQueue[p.id - 1] = true;
        }
      }
   
      if (current.remainingTime > 0) {
        queue.push(current); // re-queue
      } else {
        current.finishTime = time;
        current.tat = time - current.arrivalTime;
        current.wat = current.tat - current.burstTime;
        completed++;
      }
   
      // Mark as not in queue for possible re-queueing
      isInQueue[current.id - 1] = false;
    }
   
    // Sort by original process ID
    processes.sort((a, b) => a.id - b.id);
   
    return {
      solvedProcessesInfo: processes,
      ganttChartInfo: ganttChart
    };
  }