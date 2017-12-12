chrome.webRequest.onBeforeRequest.addListener(
    function (details) {
        return {
            redirectUrl: "https://raw.githubusercontent.com/sunxfancy/hack/threeSplitScreen.js"
        };
    }, {
        urls: ["http://px.hebnx.com/rs/train/js/threeSplitScreen.js"]
    }, ["blocking"]);