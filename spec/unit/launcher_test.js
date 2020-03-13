const Logger = require('../../built/logger').Logger;
const TaskRunner = require('../../built/taskRunner').TaskRunner;
const initFn = require('../../built/launcher').init;


describe('the launcher', function () {
    let runningTasks;
    let unblockTasks;
    let blockTasksPromise;

    beforeAll(() => {
        // disable launcher logs in console
        spyOn(Logger, 'writeTo').and.stub();
        // process.exit is called by launcher, stub it
        spyOn(process, 'exit').and.stub();
    });

    beforeEach(() => {
        blockTasksPromise = new Promise(resolve => {
            unblockTasks = resolve;
        });
        runningTasks = 0;

        let taskRunFn = async () => {
            runningTasks++;
            await blockTasksPromise;
            runningTasks--;
            return {taskId: 0, exitCode: 0, capabilities: {}};
        };

        spyOn(TaskRunner.prototype, 'run').and.callFake(taskRunFn);
    });

    it('should be able to run tasks in parallel', async function () {
        const conf = {
            specs: [
                'spec/unit/data/fakespecA.js',
                'spec/unit/data/fakespecB.js',
                'spec/unit/data/fakespecC.js',
            ],
            capabilities: {
                browserName: 'chrome',
                maxInstances: 3,
                shardTestFiles: true
            },
        };
        // no tasks should be run at beginning
        expect(runningTasks).toEqual(0);
        // start main launcher process
        const initPromise = initFn(null, conf);
        // wait for some promises inside initFn
        await new Promise(res => setTimeout(res));
        // maxInstances tasks running now
        expect(runningTasks).toBe(3);
        // finish the tasks
        unblockTasks();
        // wait until initFn done
        await initPromise;
        // all tasks should be done now
        expect(runningTasks).toBe(0);
    });

});
