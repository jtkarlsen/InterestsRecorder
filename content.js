/**
 * Track clicks on links and send data to eventPage for storage.
 */

function submitInterest(e) {
	// different types at the moment to allow possible alteration in the future.
	console.log(e);
	if (e.type == "domain") {
		chrome.runtime.sendMessage({command: "recordPageVisit", domain: e.domain});
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

// setTimeout is to accommodate for sited with dynamically loaded data.
setTimeout(function() {
	submitInterest({type:"domain", domain:document.domain});
}, 10000);

if(window.location.href.indexOf("http://localhost:8080/") > -1) {
	
	chrome.storage.local.get('query', function (result) {
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