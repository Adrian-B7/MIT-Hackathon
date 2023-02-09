// Select all elements with the class '.s-item__details.clearfix'
const productDetails = document.querySelectorAll('.s-item__details.clearfix');

// Loop through each product detail
productDetails.forEach(async details => {
  // Get the parent element of the current detail element
  const infoDiv = details.parentElement;
  // Get the first 'a' element within the parent element
  const link = infoDiv.querySelector('a');
  // If there's no 'a' element, return and move on to the next iteration
  if (!link) {
    return;
  }
  // Fetch the content of the URL specified in the 'href' attribute of the 'a' element
  const response = await fetch(link.href);
  // If the fetch was unsuccessful, return and move on to the next iteration
  if (!response.ok) {
    return;
  }
  // Get the text content of the fetched response
  const content = await response.text();
  // Create a new DOMParser object
  const parser = new DOMParser();
  // Parse the text content as HTML
  const parsedHtml = parser.parseFromString(content, 'text/html');
  // Get the first element with the class '.item-highlights-wrapper' within the parsed HTML
  const highlightsWrapper = parsedHtml.querySelector('.item-highlights-wrapper');
  // If there's no '.item-highlights-wrapper' element, return and move on to the next iteration
  if (!highlightsWrapper) {
    return;
  }
  // Get all elements with the class '.item-highlight' within the '.item-highlights-wrapper' element
  const highlights = highlightsWrapper.querySelectorAll('.item-highlight');
  let targetHighlight;
  // Loop through each highlight
  highlights.forEach(highlight => {
    // If the text content of the current highlight starts with the string 'Get it by'
    if (highlight.textContent.startsWith('Get it by')) {
      // Set the current highlight as the target highlight
      targetHighlight = highlight;
    }
  });
  // If there's no target highlight, return and move on to the next iteration
  if (!targetHighlight) {
    return;
  }
  // Append the target highlight to the current detail element
  details.appendChild(targetHighlight);
});
