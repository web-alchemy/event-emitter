const path = require('node:path');
const { assert } = require('chai');
const package = require('../package.json');

const [paramName, paramValue] = process.argv.slice(3)[0].split('=')

if (paramName !== '--lib-type') {
  throw new Error('Set parameter `--lib-type` to `module` or `main`')
}

const libPath = path.join(process.cwd(), package[paramValue])
console.log(`Testing file: ${libPath}`)
const importPromise = import(libPath).then((mod) => mod.default)

describe('Event Emitter', () => {

  let ee;

  beforeEach(async () => {
    const EventEmitter = await importPromise
    ee = new EventEmitter()
  });

  it('should exists with empty events', () => {
    assert.isObject(ee);
    assert.isObject(ee._events);
    assert.lengthOf(Object.keys(ee._events), 0);
  });

  describe('subscribe handlers', () => {
    it('should have a function `on`', () => {
      assert.property(ee, 'on');
      assert.typeOf(ee.on, 'function');
    });

    it('should create handler for new event type', () => {
      const fn = () => {};
      const eventName = 'some-event'
      ee.on(eventName, fn);
      assert.property(ee._events, eventName);
      assert.deepEqual(ee._events[eventName], [fn]);
    });

    it('should append new handler for existing event type', () => {
      const fn1 = () => {};
      const fn2 = () => {};
      const eventName = 'event';
      ee.on(eventName, fn1);
      ee.on(eventName, fn2);
      assert.property(ee._events, eventName);
      assert.deepEqual(ee._events[eventName], [fn2, fn1]);
    });

    it('should add the same handler only once', () => {
      const fn = () => {};
      const fn2 = () => {};
      const eventName = 'event';
      ee.on(eventName, fn);
      ee.on(eventName, fn);
      assert.property(ee._events, eventName);
      assert.deepEqual(ee._events[eventName], [fn]);
      ee.on(eventName, fn);
      ee.on(eventName, fn2);
      ee.on(eventName, fn);
      assert.deepEqual(ee._events[eventName], [fn2, fn]);
    });
  });

  describe('unsubscribe handlers', () => {
    it('should have a function `off`', () => {
      assert.property(ee, 'off');
      assert.typeOf(ee.off, 'function');
    });

    it('should remove handlers for event type', () => {
      const fn1 = () => {};
      const fn2 = () => {};
      const eventName = 'event';
      ee.on(eventName, fn1);
      ee.on(eventName, fn2);
      ee.off(eventName, fn1);
      assert.property(ee._events, eventName);
      assert.deepEqual(ee._events[eventName], [fn2]);
    });

    it('should remove event name property if there are no handlers', () => {
      const fn1 = () => {};
      const fn2 = () => {};
      const eventName = 'event';
      ee.on(eventName, fn1);
      ee.on(eventName, fn2);
      ee.off(eventName, fn1);
      ee.off(eventName, fn2);
      assert.notProperty(ee._events, eventName);
    });
  });

  describe('emit events', () => {
    it('should have a function `emit`', () => {
      assert.property(ee, 'emit');
      assert.typeOf(ee.emit, 'function');
    });

    it('should emit handler for event type with arguments', (done) => {
      const eventName = 'emit-event-name';
      const arg1 = 'some-arg';
      const arg2 = {
        a: 'a',
        props: ['1', 2, 'x']
      };
      const fn = (...args) => {
        assert.deepEqual(args, [arg1, arg2]);
        done();
      };
      ee.on(eventName, fn);
      ee.emit(eventName, arg1, arg2);
    });

    it('should handle error', (done) => {
      const eventName = 'emit-event-name';
      const error = new Error();
      error.name = 'test-error';
      error.message = 'some error description';
      const fn = () => {
        throw error;
      }
      ee.on(eventName, fn);
      ee.on('error', (type, ex) => {
        assert.deepEqual(ex, error);
        assert.equal(type, eventName);
        done();
      });

      ee.emit(eventName);
    });

    it('should continue handle events, if error happens', (done) => {
      let count = 0;
      const end = () => {
        count++;
        if (count === 2) {
          done();
        }
      }

      const eventName = 'emit-event-name';

      const error = new Error();
      error.name = 'test-error';
      error.message = 'some error description';
      const handlerWithError = () => {
        throw error;
      }

      const arg1 = 'some-arg';
      const arg2 = {
        a: 'a',
        props: ['1', 2, 'x']
      };
      const handler = (...args) => {
        assert.deepEqual(args, [arg1, arg2]);
        end();
      };

      ee.on(eventName, handlerWithError);
      ee.on(eventName, handler);
      ee.on('error', (type, ex) => {
        assert.deepEqual(ex, error);
        assert.equal(type, eventName);
        end();
      });

      ee.emit(eventName, arg1, arg2);
    });
  });

  describe('once subscribe handler', () => {
    it('should have a function `once`', () => {
      assert.property(ee, 'once');
      assert.typeOf(ee.once, 'function');
    });

    it('should create handler for new event type', () => {
      const fn = () => {};
      const eventName = 'some-event';
      ee.once(eventName, fn);
      assert.property(ee._events, eventName);
      assert.isNotEmpty(ee._events[eventName]);
    });

    it('should emit handler for event type with arguments', () => {
      const eventName = 'emit-event-name';
      const arg1 = 'some-arg';
      const arg2 = {
        a: 'a',
        props: ['1', 2, 'x']
      };
      const fn = (...args) => {
        assert.deepEqual(args, [arg1, arg2]);
      };
      ee.once(eventName, fn);
      ee.emit(eventName, arg1, arg2);
    });

    it('should remove handlers for event type after one call', () => {
      const fn1 = () => {};
      const fn2 = () => {};
      const eventName = 'event';
      ee.on(eventName, fn1);
      ee.once(eventName, fn2);
      ee.emit(eventName);
      assert.property(ee._events, eventName);
      assert.deepEqual(ee._events[eventName], [fn1]);
    });
  });

  describe('error handling', () => {
    it('should create handler for errors', () => {
      const fn = () => {};
      const eventName = 'error';
      ee.on(eventName, fn);
      assert.property(ee._events, eventName);
      assert.isNotEmpty(ee._events[eventName]);
    });

    it('should catch synchronous errors', () => {
      const errorEventType = 'example-event';
      const errorMessage = 'some error message';
      function handlerWithError() {
        throw new Error(errorMessage);
      }
      function errorHandler(type, error) {
        assert.equal(type, errorEventType);
        assert.equal(error.message, errorMessage);
      }
      ee.on('error', errorHandler);
      ee.on(errorEventType, handlerWithError);
      ee.emit(errorEventType);
    });

    it('should catch asynchronous errors in handlers with returned promises', (done) => {
      const errorEventType = 'example-event';
      const errorMessage = 'some error message';
      function handlerWithError() {
        return Promise.resolve()
          .then(() => {
            throw new Error(errorMessage)
          })
      }
      function errorHandler(type, error) {
        assert.equal(type, errorEventType);
        assert.equal(error.message, errorMessage);
        done();
      }
      ee.on('error', errorHandler);
      ee.on(errorEventType, handlerWithError);
      ee.emit(errorEventType);
    });

    it('should catch asynchronous errors in async handlers', (done) => {
      const errorEventType = 'example-event';
      const errorMessage = 'some error message';
      async function handlerWithError() {
        throw new Error(errorMessage);
      }
      function errorHandler(type, error) {
        assert.equal(type, errorEventType);
        assert.equal(error.message, errorMessage);
        done();
      }
      ee.on('error', errorHandler);
      ee.on(errorEventType, handlerWithError);
      ee.emit(errorEventType);
    });
  });
});