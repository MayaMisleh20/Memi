export interface StrideProcess {
    pid: number;
    priority: number;
    stride: number;
    pass: number;
  }
   
  export interface StrideGanttEntry {
    pid: number | null;
    start: number;
    end: number;
  }
   
  export interface StrideResult {
    ganttChart: StrideGanttEntry[];
    finalPassValues: number[];
  }
   
  /**
  * Initializes processes for stride scheduling.
  * @param numProcesses Number of processes
  * @returns Array of initialized StrideProcess objects
  */
  export function initStrideProcesses(numProcesses: number): StrideProcess[] {
    return Array.from({ length: numProcesses }, (_, i) => {
      const priority = 1 + i;
      return {
        pid: i + 1,
        priority,
        stride: Math.floor(10000 / priority),
        pass: 0
      };
    });
  }
   
  /**
  * Simulates stride scheduling algorithm.
  * @param processes Array of StrideProcess
  * @param totalTicks Number of time units to simulate
  * @returns StrideResult containing Gantt chart and final pass values
  */
  export function simulateStrideScheduling(
    processes: StrideProcess[],
    totalTicks: number
  ): StrideResult {
    const queue: StrideProcess[] = processes.map(p => ({ ...p }));
    const chart: StrideGanttEntry[] = [];
   
    for (let time = 0; time < totalTicks; time++) {
      // Sort by lowest pass value
      queue.sort((a, b) => a.pass - b.pass);
      const current = queue[0];
   
      // Update Gantt chart
      const last = chart[chart.length - 1];
      if (last && last.pid === current.pid) {
        last.end++;
      } else {
        chart.push({ pid: current.pid, start: time, end: time + 1 });
      }
   
      // Increment pass value
      current.pass += current.stride;
    }
   
    return {
      ganttChart: chart,
      finalPassValues: queue.map(p => p.pass)
    };
  }