export interface Task {
    id: string;
    duration: number;
    highlight?: boolean;
  }
   
  export interface CPUCore {
    id: string;
    queue: Task[];
    isIdle: boolean;
    currentTask?: Task;
    timeLeft: number;
  }
   
  export interface WorkStealLog {
    type: 'complete' | 'steal';
    coreId: string;
    taskId: string;
    fromCoreId?: string;
  }
   
  /**
  * Assign a task to the least loaded core.
  */
  export function autoAssignTask(task: Task, cores: CPUCore[]): void {
    const target = cores.reduce((min, core) =>
      core.queue.length < min.queue.length ? core : min
    );
    target.queue.push({ ...task });
  }
   
  /**
  * Perform work stealing once: idle core steals from busiest core.
  */
  export function simulateStealing(cores: CPUCore[], logs: WorkStealLog[]): void {
    const idleCore = cores.find(c => c.queue.length === 0 && c.isIdle);
    const busiest = cores.reduce((max, core) =>
      core.queue.length > max.queue.length ? core : max
    );
   
    if (idleCore && busiest.queue.length > 1) {
      const stolenTask = busiest.queue.pop();
      if (stolenTask) {
        stolenTask.highlight = true;
        idleCore.queue.push(stolenTask);
        logs.unshift({
          type: 'steal',
          coreId: idleCore.id,
          taskId: stolenTask.id,
          fromCoreId: busiest.id,
        });
      }
    }
  }
   
  /**
  * Runs task execution simulation across all cores.
  */
  export function runSimulationStep(
    cores: CPUCore[],
    logs: WorkStealLog[],
    onStepComplete: () => void
  ): void {
    for (const core of cores) {
      if (core.isIdle && core.queue.length > 0) {
        const task = core.queue.shift();
        if (task) {
          core.currentTask = task;
          core.timeLeft = task.duration;
          core.isIdle = false;
          executeTask(core, logs, cores, onStepComplete);
        }
      }
    }
  }
   
  /**
  * Simulate the execution of one task.
  */
  function executeTask(
    core: CPUCore,
    logs: WorkStealLog[],
    allCores: CPUCore[],
    onStepComplete: () => void
  ): void {
    const interval = setInterval(() => {
      core.timeLeft--;
      if (core.timeLeft <= 0) {
        clearInterval(interval);
        logs.unshift({
          type: 'complete',
          coreId: core.id,
          taskId: core.currentTask!.id,
        });
        core.currentTask = undefined;
        core.isIdle = true;
        simulateStealing(allCores, logs);
        runSimulationStep(allCores, logs, onStepComplete);
      }
    }, 1000);
  }