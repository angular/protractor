import {bootstrap} from 'angular2/bootstrap';
import {Component} from 'angular2/core';
import {NgIf} from 'angular2/common';
import {TimerWrapper} from 'angular2/src/facade/async';

@Component({
  templateUrl: 'app/async/async-component.html',
  directives: [NgIf]
})
export class AsyncComponent {
  val1: number = 0;
  val2: number = 0;
  val3: number = 0;
  val4: number = 0;
  timeoutId = null;
  chainedTimeoutId = null;
  intervalId = null;

  increment(): void { this.val1++; };

  delayedIncrement(): void {
    this.cancelDelayedIncrement();
    this.timeoutId = TimerWrapper.setTimeout(() => {
      this.val2++;
      this.timeoutId = null;
    }, 2000);
  };

  chainedDelayedIncrements(i: number): void {
    this.cancelChainedDelayedIncrements();

    var self = this;
    function helper(_i) {
      if (_i <= 0) {
        self.chainedTimeoutId = null;
        return;
      }

      self.chainedTimeoutId = TimerWrapper.setTimeout(() => {
        self.val3++;
        helper(_i - 1);
      }, 500);
    }
    helper(i);
  };

  periodicIncrement(): void {
    this.cancelPeriodicIncrement();
    this.intervalId = TimerWrapper.setInterval(() => { this.val4++; }, 2000)
  };

  cancelDelayedIncrement(): void {
    if (this.timeoutId != null) {
      TimerWrapper.clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  };

  cancelChainedDelayedIncrements(): void {
    if (this.chainedTimeoutId != null) {
      TimerWrapper.clearTimeout(this.chainedTimeoutId);
      this.chainedTimeoutId = null;
    }
  };

  cancelPeriodicIncrement(): void {
    if (this.intervalId != null) {
      TimerWrapper.clearInterval(this.intervalId);
      this.intervalId = null;
    }
  };
}
