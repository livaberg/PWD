/**
 * @file The CSS template for the memory-app web component.
 * @module memory-app.css
 * @author Mats Loock <mats.loock@lnu.se>
 * @author Liv Åberg <lh224hh@student.lnu.se>
 */

import '../flipping-tile'

/*
 * Get image URLs.
 */
const NUMBER_OF_IMAGES = 9

const imgUrls = new Array(NUMBER_OF_IMAGES)
for (let i = 0; i < NUMBER_OF_IMAGES; i++) {
  imgUrls[i] = new URL(`./images/${i}.png`, import.meta.url).href
}

export const IMG_URLS = Object.freeze(imgUrls)

/*
 * Define the CSS template.
 */
export const cssTemplate = document.createElement('template')
cssTemplate.innerHTML = `
  <style>
    :host {
      --tile-size: 108px;
    }
    #game-board {
      display: grid;
      grid-template-columns: repeat(4, var(--tile-size));
      gap: 20px;
    }
    #game-board.small {
      grid-template-columns: repeat(2, var(--tile-size));
    }
    flipping-tile {
      width: var(--tile-size);
      height: var(--tile-size);
    }
    flipping-tile::part(tile-back) {
      border-width: 5px;
      background: url("${IMG_URLS[0]}") no-repeat center/80%, radial-gradient(#fff,rgb(238, 153, 228));
    }
  
    #size-selector-wrapper {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 100;
    }

    #size-selector {
      background: white;
      border: 1px solid #ccc;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    #size-selector button {
      cursor: pointer;
      padding: 6px 8px;
      font-size: 1em;
      border: 1px solid #999;
      background-color: white;
      border-radius: 4px;
      transition: background-color 0.3s ease;
    }

    #size-selector button:hover {
      background-color: #eee;
    }

    #size-selector button:focus {
      outline: 2px solid #0078d7;
      outline-offset: 2px;
    }
  </style>
`
