/**
 * Collect the contextual data of link clicks and store it.
 */

var session;
var machineId;

var MILLISECONDS_PER_HOUR = 60 /* min/hour */ * 60 /* sec/min */ * 1000 /* ms/s */;

var englishStopwords = [
	'being', 'should', 'ourselves', 'further', 'ours', 'what', 'if', 'your', 'most', 'their', 'same', 'own', 'to', 
	'will', 'you', 'in', 'yourselves', 'until', 'here', 'both', 'against', 'these', 'it', 'or', 'so', 'myself', 'them', 
	'there', 'more', 'not', 'any', 'such', 'had', 'by', 'during', 'doing', 'am', 'a', 'than', 'its', 'on', 'she', 
	'between', 'only', 'were', 'some', 'because', 'which', 'that', 'where', 'he', 'did', 'our', 'above', 'was', 'out', 
	'can', 'no', 'having', 'as', 'after', 'are', 'themselves', 'him', 'before', 'just', 'again', 'me', 'with', 'they', 
	'those', 'then', 'once', 'few', 'the', 'yourself', 'when', 'why', 'other', 'into', 'theirs', 'now', 'too', 'itself', 
	'at', 'herself', 'up', 'very', 'off', 'an', 'be', 'i', 'and', 'for', 'been', 'himself', 'under', 'all', 't', 'nor', 
	'whom', 'have', 'hers', 'below', 'do', 's', 'does', 'this', 'we', 'his', 'each', 'my', 'is', 'yours', 'how', 'over', 
	'of', 'don', 'from', 'who', 'through', 'down', 'has', 'but', 'about', 'while', 'her'
]

var norwegianStopwords = [
	'hvor', 'bli', 'sjøl', 'disse', 'hjå', 'eit', 'nokor', 'kven', 'når', 'kva', 'så', 'enn', 'en', 'opp', 'deim', 'si', 
	'skal', 'dere', 'ha', 'og', 'kunne', 'min', 'et', 'inkje', 'jeg', 'har', 'mange', 'vært', 'skulle', 'kan', 'eller', 
	'hvorfor', 'vere', 'å', 'mitt', 'korso', 'mellom', 'so', 'då', 'mi', 'vår', 'kom', 'verte', 'deires', 'sine', 'vil', 
	'etter', 'seg', 'hoss', 'mykje', 'hvem', 'dykkar', 'honom', 'dei', 'korleis', 'på', 'hun', 'hoe', 'ingi', 
	'kvarhelst', 'kun', 'meget', 'ingen', 'din', 'deira', 'henne', 'de', 'ikke', 'blitt', 'uten', 'elles', 'hver', 
	'vort', 'selv', 'no', 'både', 'vors', 'alle', 'ho', 'hossen', 'blei', 'samme', 'være', 'av', 'vi', 'me', 'ned', 
	'før', 'upp', 'dem', 'sidan', 'oss', 'siden', 'noka', 'det', 'du', 'sin', 'somme', 'fordi', 'med', 'ville', 'ein', 
	'ble', 'hvordan', 'hvis', 'eg', 'hva', 'at', 'sia', 'sitt', 'inni', 'fra', 'vart', 'hennes', 'noko', 'kvar', 'men', 
	'vore', 'i', 'nå', 'for', 'mot', 'bare', 'varte', 'um', 'ut', 'denne', 'der', 'mine', 'hans', 'kvifor', 'ja', 
	'begge', 'slik', 'båe', 'den', 'hadde', 'til', 'deres', 'som', 'di', 'medan', 'somt', 'er', 'ikkje', 'også', 
	'hennar', 'om', 'han', 'blir', 'ett', 'noen', 'da', 'ditt', 'over', 'hvilke', 'man', 'meg', 'nokon', 'kvi', 'eitt', 
	'sånn', 'ved', 'noe', 'dette', 'var', 'hvilken', 'dykk', 'inn', 'nokre', 'her', 'deg', 'må', 'gi', 'ga', 'igjen'
]


 
chrome.runtime.onMessage.addListener(
    function (request, sender) {
        setSessionTimeout();
        if (request.command == "recordLink") {
			var interest = {};
			interest.interest = request.interest;
			interest.time = getTime();
            storeInterest(interest);
        }
		else if(request.command == "recordPageVisit") {
			var domain = request.domain;
            chrome.storage.local.get('username', function (result) {
                if (result.username !== undefined && result.username !== '') {
                    submitDomain(domain);
                }
            })
		}
        else if(request.command == "userLogout") {
            setNewSession();
        }
		//else if(request.command == "recordSearch") {
		//	var interest = {};
		//	interest.sessionId = sessionId;
		//	interest.interest = request.interest;
		//	interest.time = getTime();
         //   navigator.geolocation.getCurrentPosition (function (position) {
         //       interest.geoLatitude = position.coords.latitude
         //       interest.geoLongditude = position.coords.longitude
		//		storeInterest(interest);
         //   }, function() {
		//			storeInterest(interest);
		//	});
		//}
		//else if(request.command == 'generateQuery') {
		//	createQuery();
		//}
        return true; // Needed because the response is asynchronous
    }
);

function getTime() {
	var d = new Date();
    var curr_date = addLeadingZero(d.getDate()+"");
    var curr_month = addLeadingZero((d.getMonth() + 1)+""); //Months are zero based
    var curr_year = addLeadingZero(d.getFullYear()+"");
	var curr_hour = addLeadingZero(d.getHours()+"");
	var curr_minute = addLeadingZero(d.getMinutes()+"");
	return curr_year+"-"+curr_month+"-"+curr_date+"'T'"+curr_hour+":"+curr_minute+"'Z'";
}

function getFreshness(date) {
	var date1 = new Date();
	var date2 = new Date(date);
	date2.setTime( date2.getTime() + date2.getTimezoneOffset()*60*1000 );
	var diff = date1 - date2;
	return diff;
}

function addLeadingZero(number) {
	if(number.length < 2) {
		number="0"+number;
	}
	return number;
}

function storeInterest(interest) {
	//check for empty interest
	if(interest.interest === '') {
		return;
	}
	var cleanedInterests = interest.interest.replace(/[^-æøåa-zA-Z0-9 ]/g, '');
	
	var cleanedInterestsWithoutStopWords = removeStopWords(cleanedInterests);
	
	interest.interest = cleanedInterestsWithoutStopWords;
	if(interest.interest.length > 0) {
        chrome.storage.local.get('username', function (result) {
            if (result.username !== undefined && result.username !== '') {
                submitInterest(interest, result.username)
            }
        })
	}
}

function submitInterest(interest, userId) {
	var url = 'http://129.242.219.56:5000/interest/';
    var xmlHttp = null;
    var waitcount = 0;
    while (machineId === undefined) {
        waitcount += 1;
    }
    if (waitcount > 0) {
        console.log('waitcount: '+waitcount);
    }
    var params = "userId="+userId+"&sessionId="+session['sessionId']+"&locationId="+machineId+"&interest="+JSON.stringify(interest);

    xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "POST", url, true );
    xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlHttp.send( params );
}

function submitDomain(domain) {
    var url = 'http://129.242.219.56:5000/domain/';
    var xmlHttp = null;
    var params = "domain="+domain+"&sessionId="+session['sessionId'];

    xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "POST", url, true );
    xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlHttp.send( params );
}

function removeStopWords(interest) {
	return getNoneStopWords(interest)
}

function getNoneStopWords(sentence) {
	var common = englishStopwords.concat(norwegianStopwords);
	var wordArr = sentence.split(' '),
		commonObj = {},
		uncommonArr = [],
		word, i;

	for (i = 0; i < common.length; i++) {
		commonObj[ common[i].trim() ] = true;
	}

	for (i = 0; i < wordArr.length; i++) {
		word = wordArr[i].trim().toLowerCase();
		if (!commonObj[word] && isNaN(word) && word.length > 1) {
			uncommonArr.push(word);
		}
	}
	return uncommonArr;
}

function setMachineId() {
    chrome.storage.local.get('machineId', function (result) {
        if (result.machineId === undefined) {
            machineId = generateMachineId();
            chrome.storage.local.set({'machineId': machineId})
        } else {
            machineId = result.machineId
        }
    })
}

function generateMachineId() {
    // From user broofa on StackOverflow - https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
    var id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
    return id
}

function setSessionTimeout() {
    var d = Date.now();
    if (session == undefined || +session['timeout'] < +d || (+session['sessionId']+4*MILLISECONDS_PER_HOUR < +d) ) {
        session = {};
        session['sessionId'] = d;
    }
    var t = new Date(+d + 1*MILLISECONDS_PER_HOUR);
    session['timeout'] = t;
    chrome.storage.local.set({'session': session})
}

function setSession() {
    chrome.storage.local.get('session', function (result) {
        if (result.session === undefined) {
            setSessionTimeout()
        } else {
            session = result.session
        }
    })
}

function setNewSession() {
    session = undefined;
    setSessionTimeout();
}

setMachineId();
setSession();