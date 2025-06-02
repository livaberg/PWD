import { API_KEY, CHANNEL } from '../../../../secrets.js'

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
      </style>

      <div class="chat-wrapper">
      <div class="messages">
        <div class="message other">Hej!</div>
          <div class="message self">Testar det här är ett jättejätte jättelångt meddelande</div>
        </div>
     
      <div class="footer">
      <div class="current-user">Chatting as: ${this.username}</div>
      <div class="input-area">
        <textarea rows="2" placeholder="Type your message..."></textarea>
        <button>Send</button>
      </div>
      </div>
    </div>
    `

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

    this.shadowRoot.querySelector('button').addEventListener('click', () => {
      const textarea = this.shadowRoot.querySelector('textarea')
      const messageText = textarea.value.trim()
      if (messageText) {
        this.sendMessage(messageText)
        textarea.value = ''
        // console.log(`Sent message: ${messageText}`)
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
          // console.log(`Sent message: ${messageText}`)
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
}

// Define the custom element <message-app>
customElements.define('message-app', MessageApp)
