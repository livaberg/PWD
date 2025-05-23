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
      --tile-size: 80px;
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
      background: url("${IMG_URLS[0]}") no-repeat center/80%, radial-gradient(#fff, #ffd700);;
    }
  </style>
`
