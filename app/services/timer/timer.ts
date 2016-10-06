import { Injectable } from 'angular2/core';

@Injectable()
export class Timer {
  private started: Date;
  private stopped: Date;
  private endTime: Date;
  private duration: Number;
  private remaining: Number;
  private timer;

  constructor(duration: Number) {
    this.duration = duration*1000;
  }

  public start():void {
    this.started = new Date();
    this.endTime = new Date(this.started.getTime() + this.duration);
    this.timer = setInterval(this.checkRemaining.bind(this), 100);
  }

  checkRemaining() {
    this.remaining = ((this.endTime-new Date())/1000);
    if (this.remaining <= 0) {
      this.stop();
      this.remaining = 0;
    }
  }

  public stop(): void {
    clearInterval(this.timer);
    this.stopped = new Date();
  }

}
