/**
 * @file The message-app web component module.
 * @module message-app
 * @author Liv Åberg <lh224hh@student.lnu.se>
 */
class MessageApp extends HTMLElement {
  /**
   * Constructor sets up the Shadow DOM in open mode.
   */
  constructor () {
    super()
    this.attachShadow({ mode: 'open' }) // Enables external access for testing/debugging
  }

  /**
   * Lifecycle method called when the element is added to the DOM.
   * Renders the UI and starts the clock update interval.
   */
  connectedCallback () {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          height: 100%;
          font-family: sans-serif;
        }

        .chat-wrapper {
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: 1rem;
          box-sizing: border-box;
        }

        .messages {
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          padding-right: 0.5rem;
        }

        .message {
          max-width: 70%;
          padding: 0.75rem 1.25rem;
          border-radius: 1.5rem;
          line-height: 1.6;
          word-wrap: break-word;
          font-size: 1rem;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        }

        .message.self {
          background-color: #d0ebff;
          align-self: flex-end;
        }

        .message.other {
          background-color: #ffffff;
          align-self: flex-start;
          border: 1px solid #ddd;
        }

        .input-area {
          display: flex;
          gap: 0.5rem;
          margin-top: 1rem;
        }

        textarea {
          flex: 1;
          resize: none;
          padding: 0.5rem;
          font-size: 1rem;
          border-radius: 0.5rem;
          border: 1px solid #ccc;
          box-sizing: border-box;
        }

        button {
          padding: 0.5rem 1rem;
          font-size: 1rem;
          border-radius: 0.5rem;
          border: none;
          background-color: #339af0;
          color: white;
          cursor: pointer;
        }

        button:hover {
          background-color: #1c7ed6;
        }
      </style>

      <div class="chat-wrapper">
        <div class="messages">
          <div class="message other">Hej!</div>
          <div class="message self">Testar det här är ett jättejätte jättelångt meddelande</div>
        </div>
        <div class="input-area">
          <textarea rows="2" placeholder="Write a message..."></textarea>
          <button>Send</button>
        </div>
      </div>
    `
  }
}

// Define the custom element <message-app>
customElements.define('message-app', MessageApp)
