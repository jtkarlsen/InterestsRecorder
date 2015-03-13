/**
 * Track clicks on links and send data to eventPage for storage.
 */

function submitInterest(e) {
	console.log(e);
	if (e.type == "domain") {
		chrome.runtime.sendMessage({command: "recordPageVisit", domain: e.domain});
	}
	else if (e.type == "link") {
		chrome.runtime.sendMessage({command: "recordLink", interest: e.interest, domain: e.domain});
	}
}

function clickEvent(e) {
	if(window.location.href.indexOf("http://129.242.219.56/") > -1
        || window.location.href.indexOf("http://localhost:8080/") > -1) {
		
	} else if(e.target.localName == "a" || e.target.parentNode.localName == "a") {
		submitInterest({type:"link", interest:e.target.innerText, domain:document.domain});
	}
}

/**
 * Set up event handler for mouse clicks on the page.
 */
document.body.addEventListener('click', clickEvent, true);

// setTimeout is to accommodate for sited with dynamically loaded data.
setTimeout(function() {
	submitInterest({type:"domain", domain:document.domain});
}, 10000);

if(window.location.href.indexOf("http://129.242.219.56/") > -1
    || window.location.href.indexOf("http://localhost:8080/") > -1) {

	chrome.storage.sync.get('username', function (result) {
		var username = result.username;
		if (username !== undefined || username !== '') {
            var event = new CustomEvent('InterestsEvent', { 'detail': username });
            event.initEvent('feedRecorderInterestsEvent');
            document.dispatchEvent(event);
		}
	});
}