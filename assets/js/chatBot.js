// chatbot.js

const API_KEY = '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';
const API_URL = 'https://api.openai.com/v1/completions';

console.log(`API key: ${API_KEY}`);
console.log(`API URL: ${API_URL}`);

//----------------------- speech recognition
/*if ('webkitSpeechRecognition' in window) {
  // The Web Speech API is supported


  // Create a new instance of the webkitSpeechRecognition object
  const recognition = new webkitSpeechRecognition();
  recognition.lang = 'en-US';  // Set the language to US English
  recognition.interimResults = false;  // Don't return interim results
  recognition.maxAlternatives = 1;  // Only return one result

  // Start listening for speech
  recognition.start();

  // Add event listeners for the result and end events
  recognition.addEventListener('result', (event) => {
    // Get the transcription of the speech
    const transcription = event.results[0][0].transcript;
    // Update the input field with the transcription
    document.getElementById('input').value = transcription;
  });
  
  recognition.addEventListener('end', () => {
    // Start listening for speech again
    recognition.start();
  });
  
  // Add an event listener for the error event
  recognition.addEventListener('error', (event) => {
    console.error(event.error);
  });
//------------------------- end of speech rec
}*/


document.getElementById('chatbot-form').addEventListener('submit', async (event) => {
  event.preventDefault();

  // Get the user's input
  const input = document.getElementById('input').value;

  // Use the GPT-3 API to generate a response
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: 'text-davinci-002',
      prompt: input,
      temperature: 0.7,
      max_tokens: 2048,
    }),
  });

  // Get the response text from the API
  const responseText = await response.text();
  const responseJSON = JSON.parse(responseText);
  const chatbotResponse = responseJSON.choices[0].text;

  // Format the chatbot response as code or normal text depending on the type
  let formattedResponse;
  if (input.toLowerCase().includes('code')) {
    formattedResponse = `<pre class="code"><code>${chatbotResponse}</code></pre>`;
  } else {
    formattedResponse = `<pre class="normal">${chatbotResponse}</pre>`;
  }

  let displayedText = '';

  // Set an interval to update the page every 100 milliseconds
  const interval = setInterval(() => {
    // Add the next character to the displayed text
    displayedText += formattedResponse[displayedText.length];  // Use formattedResponse here
  
    // Update the page with the new displayed text
    document.getElementById('chatbot-response').innerHTML = `<p>${displayedText}</p>`;
  
    // If all the text has been displayed, clear the interval
    if (displayedText === formattedResponse) {  // Use formattedResponse here
      clearInterval(interval);
    }
  }, 10);


  // Display the chatbot response on the page
  //document.getElementById('chatbot-response').innerHTML += `<p>${formattedResponse}</p>`;
});