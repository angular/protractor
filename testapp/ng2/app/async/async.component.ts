import { Component, NgZone } from '@angular/core';

@Component({
  templateUrl: 'app/async/async.component.html',
})
export class AsyncComponent {
  val1: number = 0;
  val2: number = 0;
  val3: number = 0;
  val4: number = 0;
  val5: number = 0;
  timeoutId = null;
  chainedTimeoutId = null;
  intervalId = null;
  intervalId_unzoned = null;

  constructor(private _ngZone: NgZone) {};

  increment(): void { this.val1++; };

  delayedIncrement(): void {
    this.cancelDelayedIncrement();
    this.timeoutId = setTimeout(() => {
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

      self.chainedTimeoutId = setTimeout(() => {
        self.val3++;
        helper(_i - 1);
      }, 500);
    }
    helper(i);
  };

  periodicIncrement(): void {
    this.cancelPeriodicIncrement();
    this.intervalId = setInterval(() => { this.val4++; }, 2000)
  };

  periodicIncrement_unzoned(): void {
    this.cancelPeriodicIncrement_unzoned();
    this._ngZone.runOutsideAngular(() => {
      this.intervalId_unzoned = setInterval(() => {
        this._ngZone.run(() => {
          this.val5++;
        });
      }, 2000)
    });
  };

  cancelDelayedIncrement(): void {
    if (this.timeoutId != null) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  };

  cancelChainedDelayedIncrements(): void {
    if (this.chainedTimeoutId != null) {
      clearTimeout(this.chainedTimeoutId);
      this.chainedTimeoutId = null;
    }
  };

  cancelPeriodicIncrement(): void {
    if (this.intervalId != null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  };

  cancelPeriodicIncrement_unzoned(): void {
    if (this.intervalId_unzoned != null) {
      clearInterval(this.intervalId_unzoned);
      this.intervalId_unzoned = null;
    }
  };
}
