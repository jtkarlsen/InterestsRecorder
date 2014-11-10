/**
 * Track clicks on links and send data to eventPage for storage.
 */

function submitInterest(e) {
	// different types at the moment to allow possible alteration in the future.
	console.log(e);
	if (e.type == "title") {
		chrome.runtime.sendMessage({command: "recordPageVisit", title: e.title, url:e.url});
	}
	else if (e.type == "googleInputValue") {
		chrome.runtime.sendMessage({command: "recordSearch", interest: e.interest});
	}
	else if (e.type == "link") {
		chrome.runtime.sendMessage({command: "recordLink", interest: e.interest});
	}
}

function clickEvent(e) {
	if(window.location.href.indexOf("http://localhost:8080/") > -1) {
		
	} else if(e.target.localName == "a" || e.target.parentNode.localName == "a") {
		submitInterest({type:"link", interest:e.target.innerText});
	}
}

/**
 * Set up event handler for mouse clicks on the page.
 */
document.body.addEventListener('click', clickEvent, true);

// setTimeout is to accomodate for sited with dynamically loaded data.
setTimeout(function() {
	if(window.location.href.indexOf("https://www.google.no/") > -1) {
		submitInterest({type:"googleInputValue",interest:document.getElementById('gbqfq').value});
	}
	//submitInterest({type:"title",title:document.title,url:window.location.href});
}, 1000);

if(window.location.href.indexOf("http://localhost:8080/") > -1) {
	
	chrome.storage.sync.get('query', function (result) {
		var query = result.query;
		if (query === undefined) {
			query = {
				"query": {
				"match_all": {}
			},
			"sort": {
				"pubDate": {
					"order": "desc"
				}
			}
			};
		}
		var event = new CustomEvent('InterestsEvent', { 'detail': query });
        event.initEvent('feedRecorderInterestsEvent');
        document.dispatchEvent(event);
	});
}


/**
* List of possible data to access
*/

// get selected text: window.getSelection().toString()