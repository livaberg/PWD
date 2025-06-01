/**
 * Custom HTML element representing a window-like interface for hosting applications.
 *
 * This component renders a draggable-like window with a header, title, and a close button.
 * It uses Shadow DOM to encapsulate its structure and styling.
 */
class AppWindow extends HTMLElement {
  /**
   * Initialize shadow DOM and bind drag handlers.
   */
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })

    this._dragging = false
    this._onDrag = this._onDrag.bind(this)
    this._onDragEnd = this._onDragEnd.bind(this)
  }

  /**
   * Render UI and attach event listeners.
   */
  connectedCallback () {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          position: absolute;
          top: 100px;
          left: 100px;
          width: 535px;
          height: 565px;
          border: 2px solid #666;
          background: white;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
          user-select: none;
          border-radius: 16px;
          z-index: 1;
          background-color: #f9f7f3;
        }
        .header {
          background: #e5e1e1;
          color: black;
          font-size: 18px;
          font-weight: bold;
          padding: 8px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2px solid #888;
          border-top-left-radius: 16px;
          border-top-right-radius: 16px;
          cursor: grab;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
          user-select: none;
        }
        .header:active {
          cursor: grabbing;
        }
        .content {
          padding: 10px;
          height: calc(100% - 42px);
          overflow: auto;
        }
        button.close-btn {
          background: rgb(244, 87, 69);
          border: 1px solid rgb(17, 16, 16);
          color: rgb(61, 60, 60);
          font-size: 18px;
          font-weight: bold;
          width: 28px;
          height: 28px;
          border-radius: 4px;
          cursor: pointer;
          line-height: 1;
          user-select: none;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.2s, border-color 0.2s, transform 0.2s ease-in-out;
        }
        button.close-btn:hover {
          transform: scale(1.2);
        }
      </style>
      <div class="header">
        <span class="title"></span>
        <button class="close-btn" title="Close">&times;</button>
      </div>
      <div class="content">
        <slot></slot>
      </div>
    `

    const title = this.getAttribute('title')
    this.shadowRoot.querySelector('.title').textContent = title

    this.shadowRoot.querySelector('.close-btn').addEventListener('click', () => this.remove())

    const header = this.shadowRoot.querySelector('.header')
    header.addEventListener('mousedown', this._onDragStart.bind(this))

    // Click on the header brings the window to the front
    this.addEventListener('mousedown', () => this._bringToFront())
  }

  /**
   * Start dragging on mouse down.
   *
   * @param {MouseEvent} event - The mouse event.
   */
  _onDragStart (event) {
    event.preventDefault()
    this._dragging = true
    this._startX = event.clientX
    this._startY = event.clientY
    const rect = this.getBoundingClientRect()
    this._offsetX = this._startX - rect.left
    this._offsetY = this._startY - rect.top

    window.addEventListener('mousemove', this._onDrag)
    window.addEventListener('mouseup', this._onDragEnd)
  }

  /**
   * Move the window as the mouse moves.
   *
   * @param {MouseEvent} event - The mouse event.
   */
  _onDrag (event) {
    if (!this._dragging) return
    const left = event.clientX - this._offsetX
    const top = event.clientY - this._offsetY
    this.style.left = `${left}px`
    this.style.top = `${top}px`
  }

  /**
   * Stop dragging on mouse up.
   */
  _onDragEnd () {
    this._dragging = false
    window.removeEventListener('mousemove', this._onDrag)
    window.removeEventListener('mouseup', this._onDragEnd)
  }

  /**
   * Bring the window to the front by setting a higher z-index.
   */
  _bringToFront () {
    const siblings = Array.from(this.parentElement.children)
    const maxZ = siblings.reduce((max, el) => {
      const z = parseInt(window.getComputedStyle(el).zIndex) || 0
      return z > max ? z : max
    }, 0)

    this.style.zIndex = maxZ + 1
  }
}

// Register the custom element with the browser
customElements.define('app-window', AppWindow)
