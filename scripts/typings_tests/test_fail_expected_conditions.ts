/// <reference path="../../built/index.d.ts" />
import {ExpectedConditions_} from 'protractor';
let ExpectedConditions: ExpectedConditions_;
ExpectedConditions.not(0);
ExpectedConditions.not('1');
ExpectedConditions.not(true);
ExpectedConditions.and(0);
ExpectedConditions.and('1');
ExpectedConditions.and(true);
ExpectedConditions.or(0, () => {});
ExpectedConditions.or('1', () => {});
ExpectedConditions.or(true, () => {});
ExpectedConditions.or(() => {}, 0);
ExpectedConditions.or(() => {}, '1');
ExpectedConditions.or(() => {}, true);
ExpectedConditions.or(0, '1');
ExpectedConditions.alertIsPresent(0);
ExpectedConditions.alertIsPresent('1');
ExpectedConditions.alertIsPresent(true);
ExpectedConditions.alertIsPresent(() => {});
ExpectedConditions.elementToBeClickable(0);
ExpectedConditions.elementToBeClickable('1');
ExpectedConditions.elementToBeClickable();
ExpectedConditions.elementToBeClickable(true);
ExpectedConditions.elementToBeClickable(() => {});
