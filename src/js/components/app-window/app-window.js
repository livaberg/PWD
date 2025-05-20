/**
 * Custom HTML element representing a window-like interface for hosting applications.
 *
 * This component renders a draggable-like window with a header, title, and a close button.
 * It uses Shadow DOM to encapsulate its structure and styling.
 */
class AppWindow extends HTMLElement {
  /**
   * Constructor sets up the Shadow DOM in open mode.
   */
  constructor () {
    super()
    this.attachShadow({ mode: 'open' }) // Enables external access for testing/debugging
  }

  /**
   * Lifecycle method called when the element is added to the DOM.
   *
   * Sets up the UI structure and styling for the window and injects scoped styles via Shadow DOM.
   * Also attaches a click handler for the close button.
   */
  connectedCallback () {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          position: absolute;
          top: 100px;
          left: 100px;
          width: 550px;
          height: 550px;
          border: 2px solid #666;
          background: white;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
          user-select: none;
          border-radius: 16px;
        }
        .header {
          background: #e5e1e1;
          box-shadow: 0 4px 2px rgba(0, 0, 0, 0.4);
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
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
        }
        .content {
          padding: 10px;
          height: calc(100% - 42px);
          overflow: auto;
        }
        button.close-btn {
          background:rgb(244, 87, 69);
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
        <span class="title">Memory Game</span>
        <button class="close-btn" title="Close">&times;</button>
      </div>
      <div class="content">
        <slot></slot>
      </div>
    `
    // const title = this.getAttribute('title')
    // this.shadowRoot.querySelector('.title').textContent = title

    // Close button just removes the element
    this.shadowRoot
      .querySelector('.close-btn')
      .addEventListener('click', () => this.remove())
  }
}

// Define the custom element <app-window>
customElements.define('app-window', AppWindow)
