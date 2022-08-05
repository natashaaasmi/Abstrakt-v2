//listen for forwarded message from content (arriving thru background)
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.id === "forwardingToGPT3") {
    console.log(request.data)
    
    sendResponse({ final: "gpt3 received message from content" })
    getCompletion(request.data).then((resolve, reject) => {
      // resolve is an array with the first element being a boolean indicating success or failure
      // and the second element being the completion returned by OpenAI api:
      //if success:
      if (resolve[0]) {
        //this will send the completion back to background as a response
        sendResponse({ final: resolve[1] });
      //if failure:
      } else {
        sendResponse({ final: "Error" });
      }
    })
  }
})
getCompletion(prompt);

async function getCompletion(prompt) {
  console.log(prompt); 
  const url = 'https://api.openai.com/v1/engines/davinci/completions'
  const params = {
    "prompt": prompt,
    "max_tokens": 64,
    "temperature": 0.6,
    "frequency_penalty": 0.5
  };
  //replace default text with GPT3 API key
  const headers = {
    'Authorization': `Bearer ${PUT_API_KEY_HERE}`,
    'Content-Type': 'application/json' 
  };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(params)
    });
    const response = await res.json();
    console.log(response);
    output = `${prompt}${response.choices[0].text}`;
    chrome.runtime.sendMessage({ id: "simplifiedText", data: output }, function (response) {
      console.log(response.reply);
    }
    )
    console.log(output);
    return [true, output];
  } catch (err) {
    console.log(err);
    return [false, null];
  }
}

//send output to content script and/or popup
//send output to background, background will forward to inject.js


//try saving output to local storage then accessing thru popup.html
