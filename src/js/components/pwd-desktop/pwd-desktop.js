/**
 * Main element representing a web desktop UI.
 * Includes a taskbar, a desktop area, a dock with app icons, and a real-time clock.
 *
 * This component encapsulates its structure and styling in Shadow DOM.
 */
class PwdDesktop extends HTMLElement {
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
    this.windowOffset = 0 // Offset used for cascading window placement to avoid exact overlap
    this.zIndexCounter = 10 // Initial z-index to manage which window is on top

    this.shadowRoot.innerHTML = `
      <style>
        @import "/css/styles.css";
      </style>
      
      <div id="taskbar">
        <button id="start-button" title="Start Menu">☰ Start</button>
        <div id="clock"></div>
      </div>

      <div id="dock">
        <button class="app-icon" data-label="Memory">
          <img src="icons/memory.png" alt="Memory Icon" />
        </button>
        <button class="app-icon" data-label="Messages">
          <img src="icons/messaging.png" alt="Messaging Icon" />
        </button>
        <button class="app-icon" data-label="Custom App">
          <img src="icons/custom.png" alt="Custom Icon" />
        </button>
      </div>

      <main id="desktop">
        <button class="trash-bin" title="Trash Bin">
          <img src="icons/garbage.png" alt="Trash icon" />
        </button>
      </main>

      <div id="icon-attribution">
              <small>
          <a
            href="https://www.flaticon.com/free-icons/memory"
            title="memory icons"
            target="_blank"
            rel="noopener"
            >Memory icon by Freepik - Flaticon
          </a>
          <a
            href="https://www.flaticon.com/free-icons/messages"
            title="messages icons"
            target="_blank"
            rel="noopener"
            >Messages icon created by Freepik - Flaticon
          </a>
          <a
            href="https://www.flaticon.com/free-icons/app"
            title="app icons"
            target="_blank"
            rel="noopener"
            >App icon created by Freepik - Flaticon
          </a>
          <a
            href="https://www.flaticon.com/free-icons/recycle-bin"
            title="recycle bin icons"
            target="_blank"
            rel="noopener"
            >Recycle bin icons created by Freepik - flaticon
          </a>
        </small>
      </div>
    `

    // Start the clock and update it every minute
    this.updateClock()
    setInterval(() => this.updateClock(), 60000)

    const desktop = this.shadowRoot.querySelector('#desktop')

    const appButtons = this.shadowRoot.querySelectorAll('.app-icon')
    appButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const label = btn.getAttribute('data-label') || 'App'
        const appWindow = document.createElement('app-window')
        appWindow.setAttribute('title', label)
        appWindow.style.zIndex = this.zIndexCounter++

        // Cascade the window position
        const offset = this.windowOffset
        appWindow.style.top = `${100 + offset}px`
        appWindow.style.left = `${100 + offset}px`
        this.windowOffset += 30
        if (this.windowOffset > 300) this.windowOffset = 0

        let appContent
        switch (label) {
          case 'Memory':
            appContent = document.createElement('memory-app')
            break
          case 'Messages':
            appContent = document.createElement('message-app')
            break
          case 'Custom App':
            appContent = document.createElement('custom-app')
            break
          default:
            appContent = document.createElement('div')
        }

        appWindow.appendChild(appContent)

        // Increase z-index on click
        appWindow.addEventListener('mousedown', () => {
          appWindow.style.zIndex = this.zIndexCounter++
        })

        desktop.appendChild(appWindow)
      })
    })
  }

  /**
   * Updates the clock element with the current date and time in Swedish locale.
   * Format: Weekday Day Month HH:MM (e.g., "mån 20 maj 14:32").
   */
  updateClock () {
    const clock = this.shadowRoot.getElementById('clock')
    if (!clock) return
    const now = new Date()
    const dateStr = now.toLocaleDateString('sv-SE', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    })
    const timeStr = now.toLocaleTimeString('sv-SE', {
      hour: '2-digit',
      minute: '2-digit'
    })
    clock.textContent = `${dateStr} ${timeStr}`
  }
}

// Define the custom element <pwd-desktop>
customElements.define('pwd-desktop', PwdDesktop)
