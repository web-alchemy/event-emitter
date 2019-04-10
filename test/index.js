import { assert } from 'chai';
import EventEmitter from '../src/event-emitter';

describe('Event Emitter', () => {

  let ee;

  beforeEach(() => {
    ee = new EventEmitter();
  });

  it('should exists with empty events', () => {
    assert.isObject(ee);
    assert.isObject(ee._events);
    assert.equal(Object.keys(ee._events), 0);
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
      assert.deepEqual(ee._events[eventName], [fn1, fn2]);
    });

    it('should add the same handler only once', () => {
      const fn = () => {};
      const eventName = 'event';
      ee.on(eventName, fn);
      ee.on(eventName, fn);
      assert.property(ee._events, eventName);
      assert.deepEqual(ee._events[eventName], [fn]);
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
      ee.on(eventName, fn);
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
});