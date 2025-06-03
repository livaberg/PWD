# &lt;message-app&gt;

A web component that represents a message app for sending realtime messages with fellow students via a WebSocket connection.


## Attributes

None


## Features

- Real-time messaging
- Username storage in localStorage
- Emoji-picker for sending emojis
- WebSocket communication


## Events

None


## Example

```html
<message-app></message-app>
```


## Dependencies

The component relies on:

   - **WebSockets** for real-time communication between users.
    wss://courselab.lnu.se/message-app/socket

   - **LocalStorage** for storing the username across sessions.

   - **Emoji-picker-element** for emoji selection whitin the chat interface.
    https://www.npmjs.com/package/emoji-picker-element



