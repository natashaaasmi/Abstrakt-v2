//send message on context menu click
chrome.runtime.onMessage.addListener(
  function(request,sender,sendResponse){
    if (request.id=== "contextMenuClicked") {
      //send response to background
      sendResponse({copy:"message received"})
      //test selection function
      var selectedText = document.getSelection().toString();
      console.log(selectedText);
      //send message w/ selected text to gpt3.js
      chrome.runtime.sendMessage({id:"textFromContent", data:selectedText}, function(response) {
        console.log(response.answer)
      });
    }
  })
    
  
