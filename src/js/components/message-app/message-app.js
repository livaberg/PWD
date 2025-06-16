import { API_KEY, CHANNEL } from '../../../../secrets.js'

/**
 * Chat message application. Manages user interaction, message sending and receiving via WebSocket, and emoji input.
 *
 * @file The message-app web component module.
 * @module message-app
 * @class MessageApp
 * @augments HTMLElement
 * @author Liv Åberg <lh224hh@student.lnu.se>
 */
class MessageApp extends HTMLElement {
  /**
   * Creates an instance of MessageApp and attaches a Shadow DOM.
   */
  constructor () {
    super()
    this.attachShadow({ mode: 'open' }) // Enables external access for testing/debugging
  }

  /**
   * Lifecycle method called when the element is added to the DOM.
   * Renders the UI, username prompt, event listeners, and WebSocket connection.
   */
  connectedCallback () {
    // Retrieve username from localStorage or prompt for it
    let username = localStorage.getItem('messageAppUsername')

    if (!username) {
      username = prompt('Please enter your username:')
      if (username) {
        localStorage.setItem('messageAppUsername', username)
      } else {
        username = 'Anonymous'
      }
    }

    this.username = username

    // Render initial HTML structure and styles
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          height: 100vh;
          font-family: sans-serif;
          box-sizing: border-box;
        }

        .chat-wrapper {
          display: flex;
          flex-direction: column;
          height: 100%;
          position: relative;
        }

        .message-wrapper.self {
          align-self: flex-end;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }

        .message-wrapper.other {
          align-self: flex-start;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .username {
          font-weight: bold;
          font-size: 0.75rem;
          color: #666;
          margin-bottom: 0.2rem;
          user-select: none;
        }

        .messages {
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          padding: 0 0.5rem 1rem 0.5rem;
          box-sizing: border-box;
        }

        .message {
          max-width: 70%;
          min-width: 30px;
          padding: 0.75rem 1.25rem;
          border-radius: 1.2rem;
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

        .footer {
          position: sticky;
          bottom: 0;
          padding: 0.5rem 1rem 1rem;
          z-index: 1;
        }

        .current-user {
          font-weight: bold;
          color: #333;
          font-size: 1rem;
          margin-bottom: 0.5rem;
        }
        
        .input-area {
          display: flex;
          gap: 0.5rem;
          margin-top: 0.1rem;
          margin-bottom: 1rem;
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

       .emoji-button {
          background: none;
          border: none;
          padding: 0;
          margin: 0;
          cursor: pointer;
          position: relative;
          display: flex;
          align-items: center;
          gap: 0.1rem;
          height: 2rem;
          width: auto;
          color: inherit;
        }

        .emoji-button:hover {
          background: none !important;
          border: none !important;
          box-shadow: none !important;
          outline: none !important;
          color: inherit;
        }

        .emoji-button .emoji {
          font-size: 1.4rem;
          pointer-events: none;
          position: relative;
          margin-left: -1.2rem;
        }

        .emoji-button .emoji.plus {
          position: absolute;
          right: -0.2rem;
          bottom: -0.1rem;
          font-size: 0.9rem;
          font-weight: bold;
          border-radius: 50%;
          padding: 0 0.1rem;
          box-shadow: 0 0 1px rgba(0,0,0,0.3);
          background-color: transparent;
        }

        .emoji-container {
          position: absolute;
          bottom: 70px;
          right: 1rem;
          z-index: 10;
          background: white;
          border-radius: 0.5rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }

        .emoji-button .emoji:first-child {
          margin-left: 0;
        }
      </style>

      <div class="chat-wrapper">
        <div class="messages">
        </div>
     
      <div class="footer">
      <div class="current-user">Chatting as: ${this.username}</div>
      <form class="input-area">
        <textarea rows="2" placeholder="Type your message..."></textarea>
        <button class="emoji-button" aria-label="Open emoji picker">
            <span class="emoji">❤️</span>
            <span class="emoji">😂</span>
            <span class="emoji plus">➕</span>
          </button>
          <div class="emoji-container" hidden>
            <emoji-picker></emoji-picker>
          </div>
        <button class="send-button">Send</button>
      </form>
      </div>
    </div>
    `

    // Element references
    const emojiButton = this.shadowRoot.querySelector('.emoji-button')
    const emojiContainer = this.shadowRoot.querySelector('.emoji-container')
    const emojiPicker = this.shadowRoot.querySelector('emoji-picker')
    const textarea = this.shadowRoot.querySelector('textarea')
    const sendButton = this.shadowRoot.querySelector('.send-button')

    // Insert emoji into textarea when clicked
    emojiPicker.addEventListener('emoji-click', event => {
      textarea.value += event.detail.unicode
    })

    const form = this.shadowRoot.querySelector('form')

    // Handle form submission
    form.addEventListener('submit', (event) => {
      event.preventDefault()
      const messageText = textarea.value.trim()

      if (messageText) {
        sendButton.disabled = true // Disable the send button to prevent multiple submissions

        this.sendMessage(messageText)
        textarea.value = ''

        setTimeout(() => {
          sendButton.disabled = false // Re-enable the send button after a short delay
        }
        , 500)
      }
    })

    /**
     * Handles clicks outside the emoji container to close it.
     *
     * @param {MouseEvent} event - The click event.
     */
    this._onClickOutside = (event) => {
      const path = event.composedPath()

      // Hide the emoji container if the click is outside of it
      if (!path.includes(emojiContainer) && !path.includes(emojiButton)) {
        emojiContainer.hidden = true
        document.removeEventListener('click', this._onClickOutside)
      }
    }

    document.addEventListener('click', this._onClickOutside)

    // Toggle emoji container visibility on button click
    emojiButton.addEventListener('click', (e) => {
      e.stopPropagation() // Prevent the click from propagating to the document
      emojiContainer.hidden = !emojiContainer.hidden

      if (!emojiContainer.hidden) {
        document.addEventListener('click', this._onClickOutside)
      } else {
        document.removeEventListener('click', this._onClickOutside)
      }
    })

    this.socket = new WebSocket('wss://courselab.lnu.se/message-app/socket')

    this.socket.addEventListener('open', () => {
      console.log('✅ WebSocket connected')
    })
    this.socket.addEventListener('error', (err) => {
      console.error('❌ WebSocket error:', err)
    })

    this.socket.addEventListener('close', () => {
      console.warn('⚠️ WebSocket disconnected')
    })

    this.socket.addEventListener('message', (event) => {
      const msg = JSON.parse(event.data)

      if (msg.type === 'heartbeat') {
        return
      }

      if (msg.type === 'message') {
        const messagesContainer = this.shadowRoot.querySelector('.messages')

        const wrapper = document.createElement('div')
        wrapper.classList.add('message-wrapper')
        wrapper.classList.add(msg.username === this.username ? 'self' : 'other')

        // Username
        const usernameElement = document.createElement('div')
        usernameElement.classList.add('username')
        usernameElement.textContent = msg.username === this.username ? 'You' : msg.username

        // Message content
        const messageElement = document.createElement('div')
        messageElement.classList.add('message')

        messageElement.classList.add(msg.username === this.username ? 'self' : 'other')

        messageElement.textContent = msg.data

        wrapper.appendChild(usernameElement)
        wrapper.appendChild(messageElement)
        messagesContainer.appendChild(wrapper)

        // Limit the number of messages displayed to the last 20
        while (messagesContainer.children.length > 20) {
          messagesContainer.removeChild(messagesContainer.firstChild)
        }

        messagesContainer.scrollTop = messagesContainer.scrollHeight
      }
    })

    this.shadowRoot.querySelector('textarea').addEventListener('keydown', (event) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault()
        const textarea = this.shadowRoot.querySelector('textarea')
        const messageText = textarea.value.trim()
        if (messageText) {
          this.sendMessage(messageText)
          textarea.value = ''
        }
      }
    })
  }

  /**
   * Sends a message through the WebSocket connection.
   *
   * @param {string} messageText - The text of the message to send.
   */
  sendMessage (messageText) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      const messageObject = {
        type: 'message',
        data: messageText,
        username: this.username,
        channel: CHANNEL,
        key: API_KEY
      }

      this.socket.send(JSON.stringify(messageObject))
    } else {
      console.warn('WebSocket is not open. Unable to send message.')
    }
  }

  /**
   * Called after the element has been removed from the DOM.
   * Cleans up event listeners and closes the WebSocket connection.
   */
  disconnectedCallback () {
    // Remove the click listener you added to the document
    document.removeEventListener('click', this._onClickOutside)

    // Close the WebSocket connection
    if (this.socket) {
      this.socket.close()
      this.socket = null
    }
  }
}

// Define the custom element <message-app>
customElements.define('message-app', MessageApp)
