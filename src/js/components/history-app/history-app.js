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

        h1 {
          font-size: 1.4rem;
          margin-bottom: 1rem;
          color: #333;
        }

        label {
          font-weight: bold;
          display: block;
          margin-bottom: 0.3rem;
        }

        input[type="date"] {
          padding: 0.5rem;
          font-size: 1rem;
          border: 1px solid #ccc;
          border-radius: 0.4rem;
          width: 100%;
          box-sizing: border-box;
        }

        #output {
          margin-top: 1rem;
          font-size: 1rem;
          color: #444;
        }

        #loading {
          margin-top: 1rem;
          font-style: italic;
          color: gray;
        }
      </style>
      <div>
        <h1>On this day:...</h1>
        <div id="output"></div>
        <p>Want to view another date?</p>
        <label for="datePicker">Choose a date to explore its historical events:</label>
        <input type="date" id="datePicker" />
        <p>View a random date in history:</p>
        <button id="randomButton">Random</button>
        <div id="loading" hidden>Loading...</div>
      </div>
    `

    const output = this.shadowRoot.querySelector('#output')
    const datePicker = this.shadowRoot.querySelector('#datePicker')
    const randomButton = this.shadowRoot.querySelector('#randomButton')
    const loading = this.shadowRoot.querySelector('#loading')

    /**
     * Fetches a historical fact for the given month and day.
     *
     * @param {object} params - The parameters for the fetch.
     * @param {number} params.month - The month of the event (1-12).
     * @param {number} params.day - The day of the event (1-31).
     * @param {string} [params.label] - Optional label for the Wikipedia link. Defaults to "month_day" format.
     * @returns {Promise<void>} - A promise that resolves when the fact is fetched and displayed.
     */
    const fetchFact = async ({ month, day, label }) => {
      loading.hidden = false
      output.textContent = ''
      try {
        const response = await fetch(`http://numbersapi.com/${month}/${day}/date`)
        const fact = await response.text()

        // If label not provided, default to month_day format
        const wikiLabel = label ?? `${month}_${day}`

        output.innerHTML = `
          <p>${fact}</p>
          <p><a href="https://en.wikipedia.org/wiki/${wikiLabel}" target="_blank" rel="noopener noreferrer">Read more on Wikipedia</a></p>
        `
      } catch (err) {
        output.textContent = 'Could not fetch historical data.'
      } finally {
        loading.hidden = true
      }
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
      loading.hidden = false
      output.textContent = ''
      try {
        const response = await fetch('http://numbersapi.com/random/date')
        const fact = await response.text()

        // Extract month name and day from the start of the fact, e.g. "January 1st ..."
        const dateMatch = fact.match(/^([A-Za-z]+) (\d{1,2})/)
        if (dateMatch) {
          const monthName = dateMatch[1]
          const day = dateMatch[2]
          const wikiLabel = `${monthName}_${day}`
          output.innerHTML = `
            <p>${fact}</p>
            <p><a href="https://en.wikipedia.org/wiki/${wikiLabel}" target="_blank" rel="noopener noreferrer">Read more on Wikipedia</a></p>
          `
        } else {
          // If no date found, just show the fact without wiki link
          output.innerHTML = `<p>${fact}</p>`
        }
      } catch (err) {
        output.textContent = 'Could not fetch random historical data.'
      } finally {
        loading.hidden = true
      }
    })
  }
}

// Define the custom element <history-app>
customElements.define('history-app', HistoryApp)
