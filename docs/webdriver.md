##[](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L15)








##[webdriver.WebDriver](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L47)
Creates a new WebDriver client, which provides control over a browser.

Every WebDriver command returns a {@code webdriver.promise.Promise} that
represents the result of that command. Callbacks may be registered on this
object to manipulate the command result or catch an expected error. Any
commands scheduled with a callback are considered sub-commands and will
execute before the next command in the current frame. For example:
<pre><code>
  var message = [];
  driver.call(message.push, message, 'a').then(function() {
    driver.call(message.push, message, 'b');
  });
  driver.call(message.push, message, 'c');
  driver.call(function() {
    alert('message is abc? ' + (message.join('') == 'abc'));
  });
</code></pre>




###Params

Param | Type | Description
--- | --- | ---
session | !(webdriver.Session&#124;webdriver.promise.Promise) | Either a known session or a promise that will be resolved to a session.
executor | !webdriver.CommandExecutor | The executor to use when sending commands to the browser.
opt_flow | webdriver.promise.ControlFlow | The flow to schedule commands through. Defaults to the active flow object.





##[this.session_](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L76)








##[this.executor_](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L79)








##[this.flow_](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L82)








##[webdriver.WebDriver.attachToSession](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L87)
Creates a new WebDriver client for an existing session.




###Params

Param | Type | Description
--- | --- | ---
executor | !webdriver.CommandExecutor | Command executor to use when querying for session details.
sessionId | string | ID of the session to attach to.




###Returns

Type | Description
--- | ---
!webdriver.WebDriver | A new client for the specified session.


##[webdriver.WebDriver.createSession](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L102)
Creates a new WebDriver session.




###Params

Param | Type | Description
--- | --- | ---
executor | !webdriver.CommandExecutor | The executor to create the new session with.
desiredCapabilities | !webdriver.Capabilities | The desired capabilities for the new session.




###Returns

Type | Description
--- | ---
!webdriver.WebDriver | The driver for the newly created session.


##[webdriver.WebDriver.prototype.controlFlow](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L243)







###Returns

Type | Description
--- | ---
!webdriver.promise.ControlFlow | The control flow used by this instance.


##[webdriver.WebDriver.prototype.schedule](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L252)
Schedules a {@code webdriver.Command} to be executed by this driver's
{@code webdriver.CommandExecutor}.




###Params

Param | Type | Description
--- | --- | ---
command | !webdriver.Command | The command to schedule.
description | string | A description of the command for debugging.




###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved with the command result.


##[webdriver.WebDriver.prototype.getSession](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L304)







###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise for this client's session.


##[webdriver.WebDriver.prototype.getCapabilities](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L312)







###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will resolve with the this instance's capabilities.


##[webdriver.WebDriver.prototype.getCapability](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L323)
Returns a promise for one of this driver's capabilities.




###Params

Param | Type | Description
--- | --- | ---
name | string | The name of the capability to query.




###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will resolve with the given capability once its value is ready.


##[webdriver.WebDriver.prototype.quit](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L338)
Schedules a command to quit the current session. After calling quit, this
instance will be invalidated and may no longer be used to issue commands
against the browser.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved when the command has completed.


##[webdriver.WebDriver.prototype.actions](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L357)
Creates a new action sequence using this driver. The sequence will not be
scheduled for execution until {@link webdriver.ActionSequence#perform} is
called. 


###Example
```javascript
<pre><code>
  driver.actions().
      mouseDown(element1).
      mouseMove(element2).
      mouseUp().
      perform();
</code></pre>
```





###Returns

Type | Description
--- | ---
!webdriver.ActionSequence | A new action sequence for this instance.


##[webdriver.WebDriver.prototype.executeScript](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L375)
Schedules a command to execute JavaScript in the context of the currently
selected frame or window. The script fragment will be executed as the body
of an anonymous function. If the script is provided as a function object,
that function will be converted to a string for injection into the target
window.

Any arguments provided in addition to the script will be included as script
arguments and may be referenced using the {@code arguments} object.
Arguments may be a boolean, number, string, or {@code webdriver.WebElement}.
Arrays and objects may also be used as script arguments as long as each item
adheres to the types previously mentioned.

The script may refer to any variables accessible from the current window.
Furthermore, the script will execute in the window's context, thus
{@code document} may be used to refer to the current document. Any local
variables will not be available once the script has finished executing,
though global variables will persist.

If the script has a return value (i.e. if the script contains a return
statement), then the following steps will be taken for resolving this
functions return value:
<ul>
<li>For a HTML element, the value will resolve to a
    {@code webdriver.WebElement}</li>
<li>Null and undefined return values will resolve to null</li>
<li>Booleans, numbers, and strings will resolve as is</li>
<li>Functions will resolve to their string representation</li>
<li>For arrays and objects, each member item will be converted according to
    the rules above</li>
</ul>




###Params

Param | Type | Description
--- | --- | ---
script | !(string&#124;Function) | The script to execute.
var_args | ...* | The arguments to pass to the script.




###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will resolve to the scripts return value.


##[webdriver.WebDriver.prototype.executeAsyncScript](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L424)
Schedules a command to execute asynchronous JavaScript in the context of the
currently selected frame or window. The script fragment will be executed as
the body of an anonymous function. If the script is provided as a function
object, that function will be converted to a string for injection into the
target window.

Any arguments provided in addition to the script will be included as script
arguments and may be referenced using the {@code arguments} object.
Arguments may be a boolean, number, string, or {@code webdriver.WebElement}.
Arrays and objects may also be used as script arguments as long as each item
adheres to the types previously mentioned.

Unlike executing synchronous JavaScript with
{@code webdriver.WebDriver.prototype.executeScript}, scripts executed with
this function must explicitly signal they are finished by invoking the
provided callback. This callback will always be injected into the
executed function as the last argument, and thus may be referenced with
{@code arguments[arguments.length - 1]}. The following steps will be taken
for resolving this functions return value against the first argument to the
script's callback function:
<ul>
<li>For a HTML element, the value will resolve to a
    {@code webdriver.WebElement}</li>
<li>Null and undefined return values will resolve to null</li>
<li>Booleans, numbers, and strings will resolve as is</li>
<li>Functions will resolve to their string representation</li>
<li>For arrays and objects, each member item will be converted according to
    the rules above</li>
</ul>

Example #1: Performing a sleep that is synchronized with the currently
selected window:
<code><pre>
var start = new Date().getTime();
driver.executeAsyncScript(
    'window.setTimeout(arguments[arguments.length - 1], 500);').
    then(function() {
      console.log('Elapsed time: ' + (new Date().getTime() - start) + ' ms');
    });
</pre></code>

Example #2: Synchronizing a test with an AJAX application:
<code><pre>
var button = driver.findElement(By.id('compose-button'));
button.click();
driver.executeAsyncScript(
    'var callback = arguments[arguments.length - 1];' +
    'mailClient.getComposeWindowWidget().onload(callback);');
driver.switchTo().frame('composeWidget');
driver.findElement(By.id('to')).sendKEys('dog@example.com');
</pre></code>

Example #3: Injecting a XMLHttpRequest and waiting for the result. In this
example, the inject script is specified with a function literal. When using
this format, the function is converted to a string for injection, so it
should not reference any symbols not defined in the scope of the page under
test.
<code><pre>
driver.executeAsyncScript(function() {
  var callback = arguments[arguments.length - 1];
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "/resource/data.json", true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      callback(xhr.resposneText);
    }
  }
  xhr.send('');
}).then(function(str) {
  console.log(JSON.parse(str)['food']);
});
</pre></code>




###Params

Param | Type | Description
--- | --- | ---
script | !(string&#124;Function) | The script to execute.
var_args | ...* | The arguments to pass to the script.




###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will resolve to the scripts return value.


##[webdriver.WebDriver.prototype.call](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L515)
Schedules a command to execute a custom function.




###Params

Param | Type | Description
--- | --- | ---
fn | !Function | The function to execute.
opt_scope | Object | The object in whose scope to execute the function.
var_args | ...* | Any arguments to pass to the function.




###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved with the function's result.


##[webdriver.WebDriver.prototype.wait](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L534)
Schedules a command to wait for a condition to hold, as defined by some
user supplied function. If any errors occur while evaluating the wait, they
will be allowed to propagate.




###Params

Param | Type | Description
--- | --- | ---
fn | function (): boolean | The function to evaluate as a wait condition.
timeout | number | How long to wait for the condition to be true.
opt_message | string | An optional message to use if the wait times out.




###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved when the wait condition has been satisfied.


##[webdriver.WebDriver.prototype.sleep](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L550)
Schedules a command to make the driver sleep for the given amount of time.




###Params

Param | Type | Description
--- | --- | ---
ms | number | The amount of time, in milliseconds, to sleep.




###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved when the sleep has finished.


##[webdriver.WebDriver.prototype.getWindowHandle](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L561)
Schedules a command to retrieve they current window handle.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved with the current window handle.


##[webdriver.WebDriver.prototype.getAllWindowHandles](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L573)
Schedules a command to retrieve the current list of available window handles.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved with an array of window handles.


##[webdriver.WebDriver.prototype.getPageSource](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L585)
Schedules a command to retrieve the current page's source. The page source
returned is a representation of the underlying DOM: do not expect it to be
formatted or escaped in the same way as the response sent from the web
server.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved with the current page source.


##[webdriver.WebDriver.prototype.close](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L600)
Schedules a command to close the current window.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved when this command has completed.


##[webdriver.WebDriver.prototype.get](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L611)
Schedules a command to navigate to the given URL.




###Params

Param | Type | Description
--- | --- | ---
url | string | The fully qualified URL to open.




###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved when the document has finished loading.


##[webdriver.WebDriver.prototype.getCurrentUrl](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L622)
Schedules a command to retrieve the URL of the current page.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved with the current URL.


##[webdriver.WebDriver.prototype.getTitle](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L634)
Schedules a command to retrieve the current page's title.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved with the current page's title.


##[webdriver.WebDriver.prototype.findElement](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L645)
Schedule a command to find an element on the page. If the element cannot be
found, a {@code bot.ErrorCode.NO_SUCH_ELEMENT} result will be returned
by the driver. Unlike other commands, this error cannot be suppressed. In
other words, scheduling a command to find an element doubles as an assert
that the element is present on the page. To test whether an element is
present on the page, use {@code #isElementPresent} instead.

<p>The search criteria for find an element may either be a
{@code webdriver.Locator} object, or a simple JSON object whose sole key
is one of the accepted locator strategies, as defined by
{@code webdriver.Locator.Strategy}. For example, the following two statements
are equivalent:
<code><pre>
var e1 = driver.findElement(By.id('foo'));
var e2 = driver.findElement({id:'foo'});
</pre></code>

<p>When running in the browser, a WebDriver cannot manipulate DOM elements
directly; it may do so only through a {@link webdriver.WebElement} reference.
This function may be used to generate a WebElement from a DOM element. A
reference to the DOM element will be stored in a known location and this
driver will attempt to retrieve it through {@link #executeScript}. If the
element cannot be found (eg, it belongs to a different document than the
one this instance is currently focused on), a
{@link bot.ErrorCode.NO_SUCH_ELEMENT} error will be returned.




###Params

Param | Type | Description
--- | --- | ---
locatorOrElement | !(webdriver.Locator&#124;Object.&lt;string&gt;&#124;Element) | The locator strategy to use when searching for the element, or the actual
    DOM element to be located by the server.





##[webdriver.WebDriver.prototype.isElementPresent](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L767)
Schedules a command to test if an element is present on the page.

<p>If given a DOM element, this function will check if it belongs to the
document the driver is currently focused on. Otherwise, the function will
test if at least one element can be found with the given search criteria.




###Params

Param | Type | Description
--- | --- | ---
locatorOrElement | !(webdriver.Locator&#124;Object.&lt;string&gt;&#124;Element) | The locator strategy to use when searching for the element, or the actual
    DOM element to be located by the server.





##[webdriver.WebDriver.prototype.findElements](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L794)
Schedule a command to search for multiple elements on the page.




###Params

Param | Type | Description
--- | --- | ---
locator | (webdriver.Locator&#124;Object.&lt;string&gt;) | The locator strategy to use when searching for the element.





##[webdriver.WebDriver.prototype.takeScreenshot](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L830)
Schedule a command to take a screenshot. The driver makes a best effort to
return a screenshot of the following, in order of preference:
<ol>
  <li>Entire page
  <li>Current window
  <li>Visible portion of the current frame
  <li>The screenshot of the entire display containing the browser
</ol>






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved to the screenshot as a base-64 encoded PNG.


##[webdriver.WebDriver.prototype.manage](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L849)







###Returns

Type | Description
--- | ---
!webdriver.WebDriver.Options | The options interface for this instance.


##[webdriver.WebDriver.prototype.navigate](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L858)







###Returns

Type | Description
--- | ---
!webdriver.WebDriver.Navigation | The navigation interface for this instance.


##[webdriver.WebDriver.prototype.switchTo](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L867)







###Returns

Type | Description
--- | ---
!webdriver.WebDriver.TargetLocator | The target locator interface for this instance.


##[webdriver.WebDriver.Navigation](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L877)
Interface for navigating back and forth in the browser history.




###Params

Param | Type | Description
--- | --- | ---
driver | !webdriver.WebDriver | The parent driver.





##[this.driver_](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L884)








##[webdriver.WebDriver.Navigation.prototype.to](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L889)
Schedules a command to navigate to a new URL.




###Params

Param | Type | Description
--- | --- | ---
url | string | The URL to navigate to.




###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved when the URL has been loaded.


##[webdriver.WebDriver.Navigation.prototype.back](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L903)
Schedules a command to move backwards in the browser history.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved when the navigation event has completed.


##[webdriver.WebDriver.Navigation.prototype.forward](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L915)
Schedules a command to move forwards in the browser history.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved when the navigation event has completed.


##[webdriver.WebDriver.Navigation.prototype.refresh](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L927)
Schedules a command to refresh the current page.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved when the navigation event has completed.


##[webdriver.WebDriver.Options](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L940)
Provides methods for managing browser and driver state.




###Params

Param | Type | Description
--- | --- | ---
driver | !webdriver.WebDriver | The parent driver.





##[this.driver_](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L947)








##[webdriver.WebDriver.Options.prototype.addCookie](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L952)
Schedules a command to add a cookie.




###Params

Param | Type | Description
--- | --- | ---
name | string | The cookie name.
value | string | The cookie value.
opt_path | string | The cookie path.
opt_domain | string | The cookie domain.
opt_isSecure | boolean | Whether the cookie is secure.
opt_expiry | (number&#124;!Date) | When the cookie expires. If specified as a number, should be in milliseconds since midnight, January 1, 1970 UTC.




###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved when the cookie has been added to the page.


##[webdriver.WebDriver.Options.prototype.deleteAllCookies](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L1009)
Schedules a command to delete all cookies visible to the current page.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved when all cookies have been deleted.


##[webdriver.WebDriver.Options.prototype.deleteCookie](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L1021)
Schedules a command to delete the cookie with the given name. This command is
a no-op if there is no cookie with the given name visible to the current
page.




###Params

Param | Type | Description
--- | --- | ---
name | string | The name of the cookie to delete.




###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved when the cookie has been deleted.


##[webdriver.WebDriver.Options.prototype.getCookies](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L1037)
Schedules a command to retrieve all cookies visible to the current page.
Each cookie will be returned as a JSON object as described by the WebDriver
wire protocol.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved with the cookies visible to the current page.


##[webdriver.WebDriver.Options.prototype.getCookie](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L1052)
Schedules a command to retrieve the cookie with the given name. Returns null
if there is no such cookie. The cookie will be returned as a JSON object as
described by the WebDriver wire protocol.




###Params

Param | Type | Description
--- | --- | ---
name | string | The name of the cookie to retrieve.




###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved with the named cookie, or {@code null} if there is no such cookie.


##[webdriver.WebDriver.Options.prototype.logs](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L1070)







###Returns

Type | Description
--- | ---
!webdriver.WebDriver.Logs | The interface for managing driver logs.


##[webdriver.WebDriver.Options.prototype.timeouts](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L1079)







###Returns

Type | Description
--- | ---
!webdriver.WebDriver.Timeouts | The interface for managing driver timeouts.


##[webdriver.WebDriver.Options.prototype.window](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L1088)







###Returns

Type | Description
--- | ---
!webdriver.WebDriver.Window | The interface for managing the current window.


##[webdriver.WebDriver.Timeouts](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L1098)
An interface for managing timeout behavior for WebDriver instances.




###Params

Param | Type | Description
--- | --- | ---
driver | !webdriver.WebDriver | The parent driver.





##[this.driver_](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L1105)








##[webdriver.WebDriver.Timeouts.prototype.implicitlyWait](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L1110)
Specifies the amount of time the driver should wait when searching for an
element if it is not immediately present.
<p/>
When searching for a single element, the driver should poll the page
until the element has been found, or this timeout expires before failing
with a {@code bot.ErrorCode.NO_SUCH_ELEMENT} error. When searching
for multiple elements, the driver should poll the page until at least one
element has been found or this timeout has expired.
<p/>
Setting the wait timeout to 0 (its default value), disables implicit
waiting.
<p/>
Increasing the implicit wait timeout should be used judiciously as it
will have an adverse effect on test run time, especially when used with
slower location strategies like XPath.




###Params

Param | Type | Description
--- | --- | ---
ms | number | The amount of time to wait, in milliseconds.




###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved when the implicit wait timeout has been set.


##[webdriver.WebDriver.Timeouts.prototype.setScriptTimeout](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L1139)
Sets the amount of time to wait, in milliseconds, for an asynchronous script
to finish execution before returning an error. If the timeout is less than or
equal to 0, the script will be allowed to run indefinitely.




###Params

Param | Type | Description
--- | --- | ---
ms | number | The amount of time to wait, in milliseconds.




###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved when the script timeout has been set.


##[webdriver.WebDriver.Timeouts.prototype.pageLoadTimeout](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L1156)
Sets the amount of time to wait for a page load to complete before returning
an error.  If the timeout is negative, page loads may be indefinite.




###Params

Param | Type | Description
--- | --- | ---
ms | number | The amount of time to wait, in milliseconds.




###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved when the timeout has been set.


##[webdriver.WebDriver.Window](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L1173)
An interface for managing the current window.




###Params

Param | Type | Description
--- | --- | ---
driver | !webdriver.WebDriver | The parent driver.





##[this.driver_](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L1180)








##[webdriver.WebDriver.Window.prototype.getPosition](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L1185)
Retrieves the window's current position, relative to the top left corner of
the screen.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved with the window's position in the form of a {x:number, y:number} object literal.


##[webdriver.WebDriver.Window.prototype.setPosition](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L1199)
Repositions the current window.




###Params

Param | Type | Description
--- | --- | ---
x | number | The desired horizontal position, relative to the left side of the screen.
y | number | The desired vertical position, relative to the top of the of the screen.




###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved when the command has completed.


##[webdriver.WebDriver.Window.prototype.getSize](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L1218)
Retrieves the window's current size.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved with the window's size in the form of a {width:number, height:number} object
    literal.


##[webdriver.WebDriver.Window.prototype.setSize](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L1232)
Resizes the current window.




###Params

Param | Type | Description
--- | --- | ---
width | number | The desired window width.
height | number | The desired window height.




###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved when the command has completed.


##[webdriver.WebDriver.Window.prototype.maximize](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L1249)
Maximizes the current window.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved when the command has completed.


##[webdriver.WebDriver.Logs](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L1262)
Interface for managing WebDriver log records.




###Params

Param | Type | Description
--- | --- | ---
driver | !webdriver.WebDriver | The parent driver.





##[this.driver_](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L1269)








##[webdriver.WebDriver.Logs.prototype.get](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L1274)
Fetches available log entries for the given type.

<p/>Note that log buffers are reset after each call, meaning that
available log entries correspond to those entries not yet returned for a
given log type. In practice, this means that this call will return the
available log entries since the last call, or from the start of the
session.




###Params

Param | Type | Description
--- | --- | ---
type | !webdriver.logging.Type | The desired log type.




###Returns

Type | Description
--- | ---
!webdriver.promise.Promise.&lt;!Array.&lt;!webdriver.logging.Entry&gt;&gt; | A promise that will resolve to a list of log entries for the specified
  type.


##[webdriver.WebDriver.Logs.prototype.getAvailableLogTypes](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L1305)
Retrieves the log types available to this driver.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise.&lt;!Array.&lt;!webdriver.logging.Type&gt;&gt; | A promise that will resolve to a list of available log types.


##[webdriver.WebDriver.TargetLocator](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L1318)
An interface for changing the focus of the driver to another frame or window.




###Params

Param | Type | Description
--- | --- | ---
driver | !webdriver.WebDriver | The parent driver.





##[this.driver_](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L1325)








##[webdriver.WebDriver.TargetLocator.prototype.activeElement](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L1330)
Schedules a command retrieve the {@code document.activeElement} element on
the current document, or {@code document.body} if activeElement is not
available.






###Returns

Type | Description
--- | ---
!webdriver.WebElement | The active element.


##[webdriver.WebDriver.TargetLocator.prototype.defaultContent](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L1344)
Schedules a command to switch focus of all future commands to the first frame
on the page.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved when the driver has changed focus to the default content.


##[webdriver.WebDriver.TargetLocator.prototype.frame](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L1358)
Schedules a command to switch the focus of all future commands to another
frame on the page.
<p/>
If the frame is specified by a number, the command will switch to the frame
by its (zero-based) index into the {@code window.frames} collection.
<p/>
If the frame is specified by a string, the command will select the frame by
its name or ID. To select sub-frames, simply separate the frame names/IDs by
dots. As an example, "main.child" will select the frame with the name "main"
and then its child "child".
<p/>
If the specified frame can not be found, the deferred result will errback
with a {@code bot.ErrorCode.NO_SUCH_FRAME} error.




###Params

Param | Type | Description
--- | --- | ---
nameOrIndex | (string&#124;number) | The frame locator.




###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved when the driver has changed focus to the specified frame.


##[webdriver.WebDriver.TargetLocator.prototype.window](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L1384)
Schedules a command to switch the focus of all future commands to another
window. Windows may be specified by their {@code window.name} attribute or
by its handle (as returned by {@code webdriver.WebDriver#getWindowHandles}).
<p/>
If the specificed window can not be found, the deferred result will errback
with a {@code bot.ErrorCode.NO_SUCH_WINDOW} error.




###Params

Param | Type | Description
--- | --- | ---
nameOrHandle | string | The name or window handle of the window to switch focus to.




###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved when the driver has changed focus to the specified window.


##[webdriver.WebDriver.TargetLocator.prototype.alert](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L1404)
Schedules a command to change focus to the active alert dialog. This command
will return a {@link bot.ErrorCode.NO_MODAL_DIALOG_OPEN} error if a modal
dialog is not currently open.






###Returns

Type | Description
--- | ---
!webdriver.Alert | The open alert.


##[webdriver.Key.chord](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L1418)
Simulate pressing many keys at once in a "chord". Takes a sequence of
{@link webdriver.Key}s or strings, appends each of the values to a string,
and adds the chord termination key ({@link webdriver.Key.NULL}) and returns
the resultant string.

Note: when the low-level webdriver key handlers see Keys.NULL, active
modifier keys (CTRL/ALT/SHIFT/etc) release via a keyup event.




###Params

Param | Type | Description
--- | --- | ---
var_args | ...string | The key sequence to concatenate.




###Returns

Type | Description
--- | ---
string | The null-terminated key sequence.


##[webdriver.WebElement](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L1450)
Represents a DOM element. WebElements can be found by searching from the
document root using a {@code webdriver.WebDriver} instance, or by searching
under another {@code webdriver.WebElement}:
<pre><code>
  driver.get('http://www.google.com');
  var searchForm = driver.findElement(By.tagName('form'));
  var searchBox = searchForm.findElement(By.name('q'));
  searchBox.sendKeys('webdriver');
</code></pre>

The WebElement is implemented as a promise for compatibility with the promise
API. It will always resolve itself when its internal state has been fully
resolved and commands may be issued against the element. This can be used to
catch errors when an element cannot be located on the page:
<pre><code>
  driver.findElement(By.id('not-there')).then(function(element) {
    alert('Found an element that was not expected to be there!');
  }, function(error) {
    alert('The element was not found, as expected');
  });
</code></pre>




###Params

Param | Type | Description
--- | --- | ---
driver | !webdriver.WebDriver | The parent WebDriver instance for this element.
id | !(string&#124;webdriver.promise.Promise) | Either the opaque ID for the underlying DOM element assigned by the server, or a promise that will
    resolve to that ID or another WebElement.





##[webdriver.WebElement.equals](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L1532)
Compares to WebElements for equality.




###Params

Param | Type | Description
--- | --- | ---
a | !webdriver.WebElement | A WebElement.
b | !webdriver.WebElement | A WebElement.




###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved to whether the two WebElements are equal.


##[webdriver.WebElement.prototype.getDriver](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L1560)







###Returns

Type | Description
--- | ---
!webdriver.WebDriver | The parent driver for this instance.


##[webdriver.WebElement.prototype.toWireValue](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L1568)







###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that resolves to this element's JSON representation as defined by the WebDriver wire protocol.


##[webdriver.WebElement.prototype.findElement](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L1595)
Schedule a command to find a descendant of this element. If the element
cannot be found, a {@code bot.ErrorCode.NO_SUCH_ELEMENT} result will
be returned by the driver. Unlike other commands, this error cannot be
suppressed. In other words, scheduling a command to find an element doubles
as an assert that the element is present on the page. To test whether an
element is present on the page, use {@code #isElementPresent} instead.
<p/>
The search criteria for find an element may either be a
{@code webdriver.Locator} object, or a simple JSON object whose sole key
is one of the accepted locator strategies, as defined by
{@code webdriver.Locator.Strategy}. For example, the following two
statements are equivalent:
<code><pre>
var e1 = element.findElement(By.id('foo'));
var e2 = element.findElement({id:'foo'});
</pre></code>
<p/>
Note that JS locator searches cannot be restricted to a subtree. All such
searches are delegated to this instance's parent WebDriver.




###Params

Param | Type | Description
--- | --- | ---
locator | (webdriver.Locator&#124;Object.&lt;string&gt;) | The locator strategy to use when searching for the element.





##[webdriver.WebElement.prototype.isElementPresent](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L1638)
Schedules a command to test if there is at least one descendant of this
element that matches the given search criteria.

<p>Note that JS locator searches cannot be restricted to a subtree of the
DOM. All such searches are delegated to this instance's parent WebDriver.




###Params

Param | Type | Description
--- | --- | ---
locator | (webdriver.Locator&#124;Object.&lt;string&gt;) | The locator strategy to use when searching for the element.





##[webdriver.WebElement.prototype.findElements](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L1663)
Schedules a command to find all of the descendants of this element that match
the given search criteria.
<p/>
Note that JS locator searches cannot be restricted to a subtree. All such
searches are delegated to this instance's parent WebDriver.




###Params

Param | Type | Description
--- | --- | ---
locator | (webdriver.Locator&#124;Object.&lt;string&gt;) | The locator strategy to use when searching for the elements.





##[webdriver.WebElement.prototype.click](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L1690)
Schedules a command to click on this element.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved when the click command has completed.


##[webdriver.WebElement.prototype.sendKeys](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L1702)
Schedules a command to type a sequence on the DOM element represented by this
instance.
<p/>
Modifier keys (SHIFT, CONTROL, ALT, META) are stateful; once a modifier is
processed in the keysequence, that key state is toggled until one of the
following occurs:
<ul>
<li>The modifier key is encountered again in the sequence. At this point the
state of the key is toggled (along with the appropriate keyup/down events).
</li>
<li>The {@code webdriver.Key.NULL} key is encountered in the sequence. When
this key is encountered, all modifier keys current in the down state are
released (with accompanying keyup events). The NULL key can be used to
simulate common keyboard shortcuts:
<code><pre>
    element.sendKeys("text was",
                     webdriver.Key.CONTROL, "a", webdriver.Key.NULL,
                     "now text is");
    // Alternatively:
    element.sendKeys("text was",
                     webdriver.Key.chord(webdriver.Key.CONTROL, "a"),
                     "now text is");
</pre></code></li>
<li>The end of the keysequence is encountered. When there are no more keys
to type, all depressed modifier keys are released (with accompanying keyup
events).
</li>
</ul>
<strong>Note:</strong> On browsers where native keyboard events are not yet
supported (e.g. Firefox on OS X), key events will be synthesized. Special
punctionation keys will be synthesized according to a standard QWERTY en-us
keyboard layout.




###Params

Param | Type | Description
--- | --- | ---
var_args | ...string | The sequence of keys to type. All arguments will be joined into a single sequence (var_args is
    permitted for convenience).




###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved when all keys have been typed.


##[webdriver.WebElement.prototype.getTagName](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L1759)
Schedules a command to query for the tag/node name of this element.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved with the element's tag name.


##[webdriver.WebElement.prototype.getCssValue](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L1771)
Schedules a command to query for the computed style of the element
represented by this instance. If the element inherits the named style from
its parent, the parent will be queried for its value.  Where possible, color
values will be converted to their hex representation (e.g. #00ff00 instead of
rgb(0, 255, 0)).
<p/>
<em>Warning:</em> the value returned will be as the browser interprets it, so
it may be tricky to form a proper assertion.




###Params

Param | Type | Description
--- | --- | ---
cssStyleProperty | string | The name of the CSS style property to look up.




###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved with the requested CSS value.


##[webdriver.WebElement.prototype.getAttribute](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L1795)
Schedules a command to query for the value of the given attribute of the
element. Will return the current value, even if it has been modified after
the page has been loaded. More exactly, this method will return the value of
the given attribute, unless that attribute is not present, in which case the
value of the property with the same name is returned. If neither value is
set, null is returned (for example, the "value" property of a textarea
element). The "style" attribute is converted as best can be to a
text representation with a trailing semi-colon. The following are deemed to
be "boolean" attributes and will return either "true" or null:

<p>async, autofocus, autoplay, checked, compact, complete, controls, declare,
defaultchecked, defaultselected, defer, disabled, draggable, ended,
formnovalidate, hidden, indeterminate, iscontenteditable, ismap, itemscope,
loop, multiple, muted, nohref, noresize, noshade, novalidate, nowrap, open,
paused, pubdate, readonly, required, reversed, scoped, seamless, seeking,
selected, spellcheck, truespeed, willvalidate

<p>Finally, the following commonly mis-capitalized attribute/property names
are evaluated as expected:
<ul>
  <li>"class"
  <li>"readonly"
</ul>




###Params

Param | Type | Description
--- | --- | ---
attributeName | string | The name of the attribute to query.




###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved with the attribute's value. The returned value will always be either a string or
    null.


##[webdriver.WebElement.prototype.getText](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L1832)
Get the visible (i.e. not hidden by CSS) innerText of this element, including
sub-elements, without any leading or trailing whitespace.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved with the element's visible text.


##[webdriver.WebElement.prototype.getSize](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L1845)
Schedules a command to compute the size of this element's bounding box, in
pixels.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved with the element's size as a {@code {width:number, height:number}} object.


##[webdriver.WebElement.prototype.getLocation](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L1858)
Schedules a command to compute the location of this element in page space.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved to the element's location as a {@code {x:number, y:number}} object.


##[webdriver.WebElement.prototype.isEnabled](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L1870)
Schedules a command to query whether the DOM element represented by this
instance is enabled, as dicted by the {@code disabled} attribute.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved with whether this element is currently enabled.


##[webdriver.WebElement.prototype.isSelected](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L1883)
Schedules a command to query whether this element is selected.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved with whether this element is currently selected.


##[webdriver.WebElement.prototype.submit](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L1895)
Schedules a command to submit the form containing this element (or this
element if it is a FORM element). This command is a no-op if the element is
not contained in a form.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved when the form has been submitted.


##[webdriver.WebElement.prototype.clear](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L1909)
Schedules a command to clear the {@code value} of this element. This command
has no effect if the underlying DOM element is neither a text INPUT element
nor a TEXTAREA element.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved when the element has been cleared.


##[webdriver.WebElement.prototype.isDisplayed](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L1923)
Schedules a command to test whether this element is currently displayed.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved with whether this element is currently visible on the page.


##[webdriver.WebElement.prototype.getOuterHtml](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L1935)
Schedules a command to retrieve the outer HTML of this element.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved with the element's outer HTML.


##[webdriver.WebElement.prototype.getInnerHtml](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L1954)
Schedules a command to retrieve the inner HTML of this element.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved with the element's inner HTML.


##[webdriver.Alert](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L1965)
Represents a modal dialog such as {@code alert}, {@code confirm}, or
{@code prompt}. Provides functions to retrieve the message displayed with
the alert, accept or dismiss the alert, and set the response text (in the
case of {@code prompt}).




###Params

Param | Type | Description
--- | --- | ---
driver | !webdriver.WebDriver | The driver controlling the browser this alert is attached to.
text | !(string&#124;webdriver.promise.Promise) | Either the message text displayed with this alert, or a promise that will be resolved to said
    text.





##[this.driver_](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L1981)








##[this.text_](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L1992)








##[webdriver.Alert.prototype.getText](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L2001)
Retrieves the message text displayed with this alert. For instance, if the
alert were opened with alert("hello"), then this would return "hello".






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved to the text displayed with this alert.


##[webdriver.Alert.prototype.accept](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L2012)
Accepts this alert.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved when this command has completed.


##[webdriver.Alert.prototype.dismiss](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L2024)
Dismisses this alert.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved when this command has completed.


##[webdriver.Alert.prototype.sendKeys](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L2036)
Sets the response text on this alert. This command will return an error if
the underlying alert does not support response text (e.g. window.alert and
window.confirm).




###Params

Param | Type | Description
--- | --- | ---
text | string | The text to set.




###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved when this command has completed.


##[webdriver.UnhandledAlertError](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L2053)
An error returned to indicate that there is an unhandled modal dialog on the
current page.




###Params

Param | Type | Description
--- | --- | ---
message | string | The error message.
alert | !webdriver.Alert | The alert handle.





##[this.alert_](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L2064)








##[webdriver.UnhandledAlertError.prototype.getAlert](https://github.com/angular/protractor/blob/master/node_modules/selenium-webdriver/lib/webdriver/webdriver.js#L2070)







###Returns

Type | Description
--- | ---
!webdriver.Alert | The open alert.

