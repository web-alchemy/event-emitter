/**
 * Event Emitter.
 * Simple library implementing event emitter pattern
 */

/**
 * @class EventEmitter
 */
class EventEmitter {
  /**
   * @constructor
   */
  constructor() {
    /** @member {Object} */
    this._events = {};
  }

  /**
   * Add handler for given event type
   * @param {string} type event type
   * @param {function} fn event handler
   */
  on(type, fn) {
    const events = this._events[type] || (this._events[type] = []);
    if (!events.some(handler => handler === fn)) {
      events.unshift(fn);
    };
    return this;
  }

  /**
   * Remove handler for given event type
   * @param {string} type event type
   * @param {function} fn event handler
   */
  off(type, fn) {
    let index, events = this._events[type];
    if (events && (index = events.indexOf(fn)) > -1) {
      events.splice(index, 1)
      if (events.length === 0) {
        delete this._events[type]
      };
    };
    return this;
  }

  /**
   * Add handler for given event type, which will be called one time
   * @param {string} type event type
   * @param {function} fn event handler
   */
  once(type, fn) {
    const handler = (...args) => {
      this.off(type, handler);
      fn(...args);
    };
    this.on(type, handler);
    return this;
  }

  /**
   * Emit event with given arguments
   * @param {string} type event type
   * @param {any[]} args event arguments
   */
  emit(type, ...args) {
    const events = this._events[type];
    if (events) {
      let index = events.length;
      while (index--) {
        try {
          events[index](...args);
        } catch(error) {
          this.emit('error', type, error);
        }
      }
    };
    return this;
  }
}

export default EventEmitter;
