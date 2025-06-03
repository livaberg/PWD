/**
 * @file The history-app web component module.
 * @module history-app
 * @author Liv Åberg <lh224hh@student.lnu.se>
 */
class HistoryApp extends HTMLElement {
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
          height: 100vh;
          font-family: sans-serif;
          box-sizing: border-box;
        }
      </style>
      <div>
        <h1>History</h1>
      </div>
      `
  }

// http://numbersapi.com/2/29/date

// http://numbersapi.com/random/year
}

// Define the custom element <history-app>
customElements.define('history-app', HistoryApp)
