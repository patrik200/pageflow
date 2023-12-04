import { asyncTimeout } from "@worksolutions/utils";

type Task = () => void | Promise<void>;

export class BatchingScheduler {
  private asyncTask: Promise<any> | null = null;

  private tasks: Task[] = [];

  constructor(private timeMS: number) {}

  async add(task: Task, resolveUnset = false) {
    this.tasks.push(task);
    const startedPromise = this.start();
    if (resolveUnset) return;
    await startedPromise;
  }

  private start() {
    if (this.asyncTask) return this.asyncTask;
    this.asyncTask = asyncTimeout(this.timeMS)
      .then(() => this.runBatching())
      .then(() => (this.asyncTask = null));
  }

  private runBatching() {
    return new Promise<void>((resolve) => {
      const tasks = this.tasks;
      this.tasks = [];
      Promise.all(tasks.map((task) => task())).finally(resolve);
    });
  }

  get currentAsyncTask() {
    return this.asyncTask;
  }
}
