//testing dynamic text replacement w/ temp msg from background
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    //replace request.id w/ simplifiedText
    //to see direct text, id is textFromContent
    if (request.id === "simplifiedText") {
        var newText = request.data;
        document.getElementById("test").innerHTML = newText;
    }
})
