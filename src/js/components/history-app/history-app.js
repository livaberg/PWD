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
   * Renders the UI and sets up event listeners.
   */
  connectedCallback () {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: flex;
          flex-direction: column;
          height: 100%;
          max-height: 100vh;
          font-family: "Lucida Handwriting", cursive, sans-serif;
          box-sizing: border-box;
          padding: 1rem;
          overflow: hidden;
        }

        h1 {
          font-size: 1.8rem;
          margin-bottom: 1rem;
          color: #222;
        }

        .dateDisplay {
          font-weight: bold; 
          color: #333; 
          margin-top: -0.5rem;
        }

        .dateContainer {
          padding: 0.5rem 0.75rem;
          background-color: #e6f0ff;
          border-radius: 0.5rem;
          font-weight: bold;
          color: #333;
          text-align: right;
          white-space: nowrap;
          user-select: none;
          margin-left: auto;
          position: relative;
          overflow: hidden;
        }

        .content {
          flex: 1;
        }

        .control-row {
          display: flex;
          justify-content: space-around;
          align-items: center;
          gap: 0.75rem;
          margin-top: 1.5rem;
          margin-bottom: 1rem;
          width: 100%;
          max-width: 400px;
        }

        .fact-box {
          border: 1px solid #ddd;
          background-color: #fefefe;
          border-radius: 0.75rem;
          padding: 1rem 1.25rem;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
          margin-top: 1rem;
        }

        input[type="date"] {
          padding: 0.5rem;
          font-size: 1rem;
          border: 1px solid #ccc;
          border-radius: 0.5rem;
          width: 155px;
          height: 40px;
          max-width: 300px;
          box-sizing: border-box;
        }

        button {
          padding: 0.6rem 1.2rem;
          font-size: 1rem;
          background-color: #007acc;
          color: white;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
        }

        button:hover {
          background-color: #005fa3;
        }

        #output {
          margin-top: -1rem;
          font-size: 1.05rem;
          line-height: 1.6;
          color: #444;
        }

        #output a {
          display: inline-block;
          margin-top: 0.5rem;
          color: #007acc;
          text-decoration: none;
          font-weight: 500;
        }

        #output a:hover {
          text-decoration: underline;
        }
      </style>

        <h1>On this day...</h1>
        <div id="dateDisplay" class="dateContainer"></div>

        <div id="output" class="content"></div>
        <h3>Want to explore historical events for another date?</h3>
        <div class="control-row">
        <input type="date" id="datePicker" aria-label="Choose another date"/>
        <button id="randomButton">Go random</button>
      </div>
    `

    const output = this.shadowRoot.querySelector('#output')
    const dateDisplay = this.shadowRoot.querySelector('#dateDisplay')
    const datePicker = this.shadowRoot.querySelector('#datePicker')
    const randomButton = this.shadowRoot.querySelector('#randomButton')

    /**
     * Creates a Wikipedia search link for the given historical fact.
     *
     * @param {string} fact - The historical fact to create a link for.
     * @returns {string} - The URL for the Wikipedia search.
     */
    const createWikiLink = (fact) => {
      const searchQuery = encodeURIComponent(fact.split('.').slice(0, 2).join('. '))
      return `https://en.wikipedia.org/w/index.php?search=${searchQuery}`
    }

    /**
     * Fetches a historical fact for the given month and day.
     *
     * @param {object} params - The parameters for the fetch.
     * @param {number} params.month - The month of the event (1-12).
     * @param {number} params.day - The day of the event (1-31).
     * @returns {Promise<void>} - A promise that resolves when the fact is fetched and displayed.
     */
    const fetchFact = async ({ month, day }) => {
      output.textContent = ''
      try {
        const response = await fetch(`http://numbersapi.com/${month}/${day}/date`)
        const fact = await response.text()
        const date = extractDate(fact)
        const wikiSearchUrl = createWikiLink(fact)

        dateDisplay.textContent = date

        output.innerHTML = `
          <div class="fact-box">
            <p>${fact}</p>
            <p><a href="${wikiSearchUrl}" target="_blank" rel="noopener noreferrer">Read more on Wikipedia</a></p>
          </div>
        `
      } catch (err) {
        dateDisplay.textContent = 'Date: –'
        output.textContent = 'Could not fetch historical data.'
      }
    }

    /**
     * Extracts the date from the fact string to display it.
     *
     * @param {string} fact - The historical fact string.
     * @returns {string} - The formatted date string (e.g., "January 1").
     */
    const extractDate = (fact) => {
      const match = fact.match(/^([A-Za-z]+)\s+(\d{1,2})(?:st|nd|rd|th)?\b/)
      if (match) {
        const [, month, day] = match
        return `${month} ${day}`
      }
      return 'Unknown'
    }

    // Show today's date fact on initial load
    const today = new Date()
    datePicker.valueAsDate = today
    fetchFact({ month: today.getMonth() + 1, day: today.getDate() })

    // When another date is selected, fetch the fact for that date
    datePicker.addEventListener('change', () => {
      const selectedDate = new Date(datePicker.value)
      const month = selectedDate.getMonth() + 1
      const day = selectedDate.getDate()
      fetchFact({ month, day })
    })

    // When the random button is clicked, fetch the fact for that date
    randomButton.addEventListener('click', async () => {
      output.textContent = ''
      try {
        const response = await fetch('http://numbersapi.com/random/date')
        const fact = await response.text()
        const date = extractDate(fact)
        const wikiSearchUrl = createWikiLink(fact)

        dateDisplay.textContent = date

        output.innerHTML = `
          <div class="fact-box">
            <p>${fact}</p>
            <p><a href="${wikiSearchUrl}" target="_blank" rel="noopener noreferrer">Search on Wikipedia</a></p>
          </div>
        `
      } catch (err) {
        output.textContent = 'Could not fetch random historical data.'
      }
    })
  }
}

// Define the custom element <history-app>
customElements.define('history-app', HistoryApp)
