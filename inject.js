/*//default text: "simplifying"
<body>
    <p id="default">Summarizing...</p>
</body>

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.id == "forwardingSimplifiedText"){
        //get simplified text from background
        var textToDisplay = request.data;
        chrome.storage.local.set({key: textToDisplay}, function(){
            console.log(`Value is ` + textToDisplay);
        }
        //then send response to background, id: "inject"
        sendResponse({go:"inject"});
    }
});

document.body.style.backgroundColor = 'orange';
*/