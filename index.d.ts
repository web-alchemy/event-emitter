declare class EventEmitter {
  /**
   * Add handler for given event type
   * @param {string} type event type
   * @param {function} fn event handler
   */
  on(type: string, fn: (...args: any[]) => void): this;

  /**
   * Add handler for given event type, which will be called one time
   * @param {string} type event type
   * @param {function} fn event handler
   */
  once(type: string, fn: (...args: any[]) => void): this;

  /**
   * Remove handler for given event type
   * @param {string} type event type
   * @param {function} fn event handler
   */
  off(type: string, fn: (...args: any[]) => void): this;

  /**
   * Emit event with given arguments
   * @param {string} type event type
   * @param {any[]} args event arguments
   */
  emit(type: string, ...args: any[]): this;
}

export = EventEmitter;