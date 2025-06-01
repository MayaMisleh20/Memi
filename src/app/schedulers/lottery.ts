export interface LotteryProcess {
    name: string;
    tickets: number;
  }
   
  export function runLottery(
    processes: LotteryProcess[],
    cpuCount: number
  ): string[] {
    const winners: string[] = [];
   
    if (processes.length === 0) return winners;
   
    for (let i = 0; i < cpuCount; i++) {
      winners.push(pickWinner(processes));
    }
   
    return winners;
  }
   
  function pickWinner(processes: LotteryProcess[]): string {
    const ticketPool: string[] = [];
   
    for (const proc of processes) {
      for (let i = 0; i < proc.tickets; i++) {
        ticketPool.push(proc.name);
      }
    }
   
    if (ticketPool.length === 0) return 'No Winner';
   
    const randomIndex = Math.floor(Math.random() * ticketPool.length);
    return ticketPool[randomIndex];
  }