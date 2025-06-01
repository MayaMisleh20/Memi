 
import { Injectable } from '@angular/core';
 
export interface GanttChartInfo {
  job: string;
  start: number;
  stop: number;
}
 
export interface ProcessInfo {
  job: string;
  at: number;
  bt: number;
  ft: number;
  tat: number;
  wat: number;
}
 
@Injectable({
  providedIn: 'root',
})
export class RoundRobinService {
  rr(
    arrivalTime: number[],
    burstTime: number[],
    timeQuantum: number
  ): {
    solvedProcessesInfo: ProcessInfo[],
    ganttChartInfo: GanttChartInfo[]
  } {
    const processesInfo = arrivalTime
      .map((item, index) => {
        const job =
          arrivalTime.length > 26
            ? `P${index + 1}`
            : (index + 10).toString(36).toUpperCase();
 
        return {
          job,
          at: item,
          bt: burstTime[index],
        };
      })
      .sort((a, b) => a.at - b.at);
 
    const solvedProcessesInfo: ProcessInfo[] = [];
    const ganttChartInfo: GanttChartInfo[] = [];
 
    const readyQueue: { job: string; at: number; bt: number }[] = [];
    let currentTime = processesInfo[0].at;
    const unfinishedJobs = [...processesInfo];
 
    const remainingTime: { [key: string]: number } = {};
    processesInfo.forEach((p) => {
      remainingTime[p.job] = p.bt;
    });
 
    readyQueue.push(unfinishedJobs[0]);
 
    while (
      Object.values(remainingTime).reduce((acc, cur) => acc + cur, 0) &&
      unfinishedJobs.length > 0
    ) {
      if (readyQueue.length === 0 && unfinishedJobs.length > 0) {
        readyQueue.push(unfinishedJobs[0]);
        currentTime = readyQueue[0].at;
      }
 
      const processToExecute = readyQueue[0];
 
      const execTime = Math.min(
        remainingTime[processToExecute.job],
        timeQuantum
      );
 
      remainingTime[processToExecute.job] -= execTime;
      const prevCurrentTime = currentTime;
      currentTime += execTime;
 
      ganttChartInfo.push({
        job: processToExecute.job,
        start: prevCurrentTime,
        stop: currentTime,
      });
 
      const arrivingNow = processesInfo.filter(
        (p) =>
          p.at <= currentTime &&
          p !== processToExecute &&
          !readyQueue.includes(p) &&
          unfinishedJobs.includes(p)
      );
 
      readyQueue.push(...arrivingNow);
      readyQueue.push(readyQueue.shift()!); // move to end of queue
 
      if (remainingTime[processToExecute.job] === 0) {
        const iUJ = unfinishedJobs.indexOf(processToExecute);
        if (iUJ > -1) unfinishedJobs.splice(iUJ, 1);
 
        const iRQ = readyQueue.indexOf(processToExecute);
        if (iRQ > -1) readyQueue.splice(iRQ, 1);
 
        solvedProcessesInfo.push({
          ...processToExecute,
          ft: currentTime,
          tat: currentTime - processToExecute.at,
          wat: currentTime - processToExecute.at - processToExecute.bt,
        });
      }
    }
 
    solvedProcessesInfo.sort((a, b) => {
      if (a.at !== b.at) return a.at - b.at;
      return a.job.localeCompare(b.job);
    });
 
    return { solvedProcessesInfo, ganttChartInfo };
  }
}
 
 