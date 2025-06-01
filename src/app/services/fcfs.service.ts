// src/app/services/fcfs.service.ts
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
export class FcfsService {
  fcfs(arrivalTime: number[], burstTime: number[]) {
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
 
    let finishTime: number[] = [];
    let ganttChartInfo: GanttChartInfo[] = [];
 
    const solvedProcessesInfo: ProcessInfo[] = processesInfo.map((p, i) => {
      if (i === 0 || p.at > finishTime[i - 1]) {
        finishTime[i] = p.at + p.bt;
        ganttChartInfo.push({
          job: p.job,
          start: p.at,
          stop: finishTime[i],
        });
      } else {
        finishTime[i] = finishTime[i - 1] + p.bt;
        ganttChartInfo.push({
          job: p.job,
          start: finishTime[i - 1],
          stop: finishTime[i],
        });
      }
 
      return {
        ...p,
        ft: finishTime[i],
        tat: finishTime[i] - p.at,
        wat: finishTime[i] - p.at - p.bt,
      };
    });
 
    return { solvedProcessesInfo, ganttChartInfo };
  }
}
 