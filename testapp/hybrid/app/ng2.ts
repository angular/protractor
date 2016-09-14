import {Component} from '@angular/core';
import {adapter} from './upgrader';

@Component({
  selector: 'ng2',
  templateUrl: './html/ng2.html'
})
export class Ng2Component {
  callCount: number = 0;
  clickButton = () => {
    setTimeout(() => {
      this.callCount++;
    }, 1000);
  };
}
