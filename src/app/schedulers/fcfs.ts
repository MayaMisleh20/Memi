export interface FCFSProcess {
    id: string;
    arrivalTime: number;
    burstTime: number;
  }
  export interface FCFSScheduledProcess {
    name: string;
    arrivalTime: number;
    burstTime: number;
    startTime: number;
    endTime: number;
    waiting: number;
    turnaround: number;
  }
  export interface FCFSResult {
    ganttChart: { name: string; burst: number; start: number; end: number }[];
    scheduled: FCFSScheduledProcess[];
    avgWaitingTime: number;
    avgTurnaroundTime: number;
    totalTime: number;
    timeLabels: number[];
  }
  export function simulateFCFS(processes: FCFSProcess[]): FCFSResult {
    const sorted = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
    const ganttChart: FCFSResult['ganttChart'] = [];
    const scheduled: FCFSScheduledProcess[] = [];
    let time = 0;
    let totalWaiting = 0;
    let totalTurnaround = 0;
    for (const p of sorted) {
      if (time < p.arrivalTime) {
        ganttChart.push({
          name: 'IDLE',
          burst: p.arrivalTime - time,
          start: time,
          end: p.arrivalTime
        });
        time = p.arrivalTime;
      }
      const startTime = time;
      const endTime = startTime + p.burstTime;
      const waiting = startTime - p.arrivalTime;
      const turnaround = endTime - p.arrivalTime;
      ganttChart.push({ name: p.id, burst: p.burstTime, start: startTime, end: endTime });
      scheduled.push({
        name: p.id,
        arrivalTime: p.arrivalTime,
        burstTime: p.burstTime,
        startTime,
        endTime,
        waiting,
        turnaround
      });
      totalWaiting += waiting;
      totalTurnaround += turnaround;
      time = endTime;
    }
    const timeLabels: number[] = ganttChart.length ? [ganttChart[0].start] : [];
    ganttChart.forEach(slot => timeLabels.push(slot.end));
    const totalTime = time;
    const avgWaitingTime = processes.length ? totalWaiting / processes.length : 0;
    const avgTurnaroundTime = processes.length ? totalTurnaround / processes.length : 0;
    return {
      ganttChart,
      scheduled,
      avgWaitingTime,
      avgTurnaroundTime,
      totalTime,
      timeLabels
    };
  }
  