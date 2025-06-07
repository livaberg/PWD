# &lt;history-app&gt;

A custom web component that displays interesting historical events for a given date. It defaults to today's date but allows users to select any date or fetch a random historical fact. Each fact includes a direct link to a related Wikipedia search for further reading.


## Attributes

None


## Features

- Displays a historical fact based on a date - today's date on initial load, or a chosen or random date.  
- Allows users to pick any date via an accessible date picker.  
- Provides a button to fetch a random historical event.  
- Dynamically creates Wikipedia search links related to the displayed event.  


## Events

None


## Example

```html
<history-app></history-app>
```


## Dependencies

The component relies on:

   - **Numbers API** for fetching historical facts by date.  
      http://numbersapi.com/  

   - **Wikipedia** for providing extended reading.  
      https://en.wikipedia.org/  
