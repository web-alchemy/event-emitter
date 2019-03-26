# Event Emitter

## Table of Contents
- [Installing](#installing)
- [Using](#using)

## Installing
```
npm install --save @web-alchemy/event-emitter
```

## Using
```javascript
// import as ecmascript module
import EventEmitter from '@web-alchemy/event-emitter';

// require as commonjs module
const EventEmitter = require('@web-alchemy/event-emitter');

// include via script tag in html as umd module
<script src="node_modules/@web-alchemy/event-emitter/dist/event-emitter.js"></script>
// The library will be available through `window.EventEmitter`
```
```javascript
const ee = new EventEmitter();

// subscribe to event
ee.on('some-event-name', (...args) => {
  console.log(...args);
})

// unsubscribe for event
const handler = () => {/* ... */}
ee.off('some-event-name', handler);

// Add handler for given event type, which will be called one time
ee.once('some-event-name', (...args) => {
  console.log(...args);
});

// Calls the appropriate event handlers, passing the agruments to the handlers.
ee.emit('some-event-name', arg1, arg2, /*...*/, argN);
```