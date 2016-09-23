import { Injectable } from 'angular2/core';
import { Timer } from './timer.ts'

@Injectable()
export class TimerFactory {
  public create(seconds: int) {
    return new Timer(seconds);
  }
}
