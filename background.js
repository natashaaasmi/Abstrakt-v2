function tellContentToGo(){
    console.log("context menu clicked")
    chrome.tabs.query({active:true, currentWindow:true}, function(tabs){
        chrome.tabs.sendMessage(tabs[0].id, {id: "contextMenuClicked"}, function(response){
            console.log(response.copy)
        })
    })
}

//create context menu
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        title: "Click this you will. Hmmmm.",
        id: "contextMenu",
        contexts: ["all"],
    });
})


chrome.contextMenus.onClicked.addListener(tellContentToGo);


//receiving message from content
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.id === "textFromContent") {
        var textToForward = request.data
        console.log(textToForward)
        sendResponse({ answer: "background copy, forwarding to gpt3" })
        //forwarding message to GPT3
        chrome.tabs.query({active:true, currentWindow:true}, function(tabs){
            chrome.tabs.sendMessage(tabs[0].id, {id:"forwardingToGPT3", data:textToForward}, function(response){
                console.log(response.final)
            })
        })
        chrome.runtime.sendMessage({id:"testdynamictext", data: textToForward}, function(response){
            console.log(response.popup);
        })
    }
})

//receive message w/ output from gpt3
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    sendResponse({reply: "got message from GPT3, forwarding to inject.js"})
    var gpt3output = request.data
    //forward output to inject.js
    if (request.id ==="simplifiedText"){
        chrome.tabs.query({active:true, currentWindow: true}, function(tabs){
            chrome.tabs.sendMessage(tabs[0].id, {id:"forwardingSimplifiedText", data: gpt3output}, function(response){
                //inject inject.js upon receiving response
                if (response.go ==="inject"){
                    chrome.scripting.executeScript({
                        target: { tabId: tabs.id }, 
                        files: ['inject.js']
                    })

                }
            })

        })


    }
})



