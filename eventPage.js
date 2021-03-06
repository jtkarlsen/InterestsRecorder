﻿/**
 * Collect the contextual data of link clicks and store it.
 */

var session;
var machineId;

var MILLISECONDS_PER_HOUR = 60 /* min/hour */ * 60 /* sec/min */ * 1000 /* ms/s */;

//var englishStopwords = [
//	'being', 'should', 'ourselves', 'further', 'ours', 'what', 'if', 'your', 'most', 'their', 'same', 'own', 'to',
//	'will', 'you', 'in', 'yourselves', 'until', 'here', 'both', 'against', 'these', 'it', 'or', 'so', 'myself', 'them',
//	'there', 'more', 'not', 'any', 'such', 'had', 'by', 'during', 'doing', 'am', 'a', 'than', 'its', 'on', 'she',
//	'between', 'only', 'were', 'some', 'because', 'which', 'that', 'where', 'he', 'did', 'our', 'above', 'was', 'out',
//	'can', 'no', 'having', 'as', 'after', 'are', 'themselves', 'him', 'before', 'just', 'again', 'me', 'with', 'they',
//	'those', 'then', 'once', 'few', 'the', 'yourself', 'when', 'why', 'other', 'into', 'theirs', 'now', 'too', 'itself',
//	'at', 'herself', 'up', 'very', 'off', 'an', 'be', 'i', 'and', 'for', 'been', 'himself', 'under', 'all', 't', 'nor',
//	'whom', 'have', 'hers', 'below', 'do', 's', 'does', 'this', 'we', 'his', 'each', 'my', 'is', 'yours', 'how', 'over',
//	'of', 'don', 'from', 'who', 'through', 'down', 'has', 'but', 'about', 'while', 'her', 'comment', 'new', 'prev'
//];

// http://www.ranks.nl/stopwords
var englishStopwords = [
    "a",
    "able",
    "about",
    "above",
    "abst",
    "accordance",
    "according",
    "accordingly",
    "across",
    "act",
    "actually",
    "added",
    "adj",
    "affected",
    "affecting",
    "affects",
    "after",
    "afterwards",
    "again",
    "against",
    "ah",
    "all",
    "almost",
    "alone",
    "along",
    "already",
    "also",
    "although",
    "always",
    "am",
    "among",
    "amongst",
    "an",
    "and",
    "announce",
    "another",
    "any",
    "anybody",
    "anyhow",
    "anymore",
    "anyone",
    "anything",
    "anyway",
    "anyways",
    "anywhere",
    "apparently",
    "approximately",
    "are",
    "aren",
    "arent",
    "arise",
    "around",
    "as",
    "aside",
    "ask",
    "asking",
    "at",
    "auth",
    "available",
    "away",
    "awfully",
    "b",
    "back",
    "be",
    "became",
    "because",
    "become",
    "becomes",
    "becoming",
    "been",
    "before",
    "beforehand",
    "begin",
    "beginning",
    "beginnings",
    "begins",
    "behind",
    "being",
    "believe",
    "below",
    "beside",
    "besides",
    "between",
    "beyond",
    "biol",
    "both",
    "brief",
    "briefly",
    "but",
    "by",
    "c",
    "ca",
    "came",
    "can",
    "cannot",
    "can't",
    "cause",
    "causes",
    "certain",
    "certainly",
    "co",
    "com",
    "come",
    "comes",
    "contain",
    "containing",
    "contains",
    "could",
    "couldnt",
    "d",
    "date",
    "did",
    "didn't",
    "different",
    "do",
    "does",
    "doesn't",
    "doing",
    "done",
    "don't",
    "down",
    "downwards",
    "due",
    "during",
    "e",
    "each",
    "ed",
    "edu",
    "effect",
    "eg",
    "eight",
    "eighty",
    "either",
    "else",
    "elsewhere",
    "end",
    "ending",
    "enough",
    "especially",
    "et",
    "et-al",
    "etc",
    "even",
    "ever",
    "every",
    "everybody",
    "everyone",
    "everything",
    "everywhere",
    "ex",
    "except",
    "f",
    "far",
    "few",
    "ff",
    "fifth",
    "first",
    "five",
    "fix",
    "followed",
    "following",
    "follows",
    "for",
    "former",
    "formerly",
    "forth",
    "found",
    "four",
    "from",
    "further",
    "furthermore",
    "g",
    "gave",
    "get",
    "gets",
    "getting",
    "give",
    "given",
    "gives",
    "giving",
    "go",
    "goes",
    "gone",
    "got",
    "gotten",
    "h",
    "had",
    "happens",
    "hardly",
    "has",
    "hasn't",
    "have",
    "haven't",
    "having",
    "he",
    "hed",
    "hence",
    "her",
    "here",
    "hereafter",
    "hereby",
    "herein",
    "heres",
    "hereupon",
    "hers",
    "herself",
    "hes",
    "hi",
    "hid",
    "him",
    "himself",
    "his",
    "hither",
    "home",
    "how",
    "howbeit",
    "however",
    "hundred",
    "i",
    "id",
    "ie",
    "if",
    "i'll",
    "im",
    "immediate",
    "immediately",
    "importance",
    "important",
    "in",
    "inc",
    "indeed",
    "index",
    "information",
    "instead",
    "into",
    "invention",
    "inward",
    "is",
    "isn't",
    "it",
    "itd",
    "it'll",
    "its",
    "itself",
    "i've",
    "j",
    "just",
    "k",
    "keep",
    "keeps",
    "kept",
    "kg",
    "km",
    "know",
    "known",
    "knows",
    "l",
    "largely",
    "last",
    "lately",
    "later",
    "latter",
    "latterly",
    "least",
    "less",
    "lest",
    "let",
    "lets",
    "like",
    "liked",
    "likely",
    "line",
    "little",
    "'ll",
    "look",
    "looking",
    "looks",
    "ltd",
    "m",
    "made",
    "mainly",
    "make",
    "makes",
    "many",
    "may",
    "maybe",
    "me",
    "mean",
    "means",
    "meantime",
    "meanwhile",
    "merely",
    "mg",
    "might",
    "million",
    "miss",
    "ml",
    "more",
    "moreover",
    "most",
    "mostly",
    "mr",
    "mrs",
    "much",
    "mug",
    "must",
    "my",
    "myself",
    "n",
    "na",
    "name",
    "namely",
    "nay",
    "nd",
    "near",
    "nearly",
    "necessarily",
    "necessary",
    "need",
    "needs",
    "neither",
    "never",
    "nevertheless",
    "new",
    "next",
    "nine",
    "ninety",
    "no",
    "nobody",
    "non",
    "none",
    "nonetheless",
    "noone",
    "nor",
    "normally",
    "nos",
    "not",
    "noted",
    "nothing",
    "now",
    "nowhere",
    "o",
    "obtain",
    "obtained",
    "obviously",
    "of",
    "off",
    "often",
    "oh",
    "ok",
    "okay",
    "old",
    "omitted",
    "on",
    "once",
    "one",
    "ones",
    "only",
    "onto",
    "or",
    "ord",
    "other",
    "others",
    "otherwise",
    "ought",
    "our",
    "ours",
    "ourselves",
    "out",
    "outside",
    "over",
    "overall",
    "owing",
    "own",
    "p",
    "page",
    "pages",
    "part",
    "particular",
    "particularly",
    "past",
    "per",
    "perhaps",
    "placed",
    "please",
    "plus",
    "poorly",
    "possible",
    "possibly",
    "potentially",
    "pp",
    "predominantly",
    "present",
    "previously",
    "primarily",
    "probably",
    "promptly",
    "proud",
    "provides",
    "put",
    "q",
    "que",
    "quickly",
    "quite",
    "qv",
    "r",
    "ran",
    "rather",
    "rd",
    "re",
    "readily",
    "really",
    "recent",
    "recently",
    "ref",
    "refs",
    "regarding",
    "regardless",
    "regards",
    "related",
    "relatively",
    "research",
    "respectively",
    "resulted",
    "resulting",
    "results",
    "right",
    "run",
    "s",
    "said",
    "same",
    "saw",
    "say",
    "saying",
    "says",
    "sec",
    "section",
    "see",
    "seeing",
    "seem",
    "seemed",
    "seeming",
    "seems",
    "seen",
    "self",
    "selves",
    "sent",
    "seven",
    "several",
    "shall",
    "she",
    "shed",
    "she'll",
    "shes",
    "should",
    "shouldn't",
    "show",
    "showed",
    "shown",
    "showns",
    "shows",
    "significant",
    "significantly",
    "similar",
    "similarly",
    "since",
    "six",
    "slightly",
    "so",
    "some",
    "somebody",
    "somehow",
    "someone",
    "somethan",
    "something",
    "sometime",
    "sometimes",
    "somewhat",
    "somewhere",
    "soon",
    "sorry",
    "specifically",
    "specified",
    "specify",
    "specifying",
    "still",
    "stop",
    "strongly",
    "sub",
    "substantially",
    "successfully",
    "such",
    "sufficiently",
    "suggest",
    "sup",
    "sure",
    "comment",
    "new",
    "prev"
];

//var norwegianStopwords = [
//	'hvor', 'bli', 'sjøl', 'disse', 'hjå', 'eit', 'nokor', 'kven', 'når', 'kva', 'så', 'enn', 'en', 'opp', 'deim', 'si',
//	'skal', 'dere', 'ha', 'og', 'kunne', 'min', 'et', 'inkje', 'jeg', 'har', 'mange', 'vært', 'skulle', 'kan', 'eller',
//	'hvorfor', 'vere', 'å', 'mitt', 'korso', 'mellom', 'so', 'då', 'mi', 'vår', 'kom', 'verte', 'deires', 'sine', 'vil',
//	'etter', 'seg', 'hoss', 'mykje', 'hvem', 'dykkar', 'honom', 'dei', 'korleis', 'på', 'hun', 'hoe', 'ingi',
//	'kvarhelst', 'kun', 'meget', 'ingen', 'din', 'deira', 'henne', 'de', 'ikke', 'blitt', 'uten', 'elles', 'hver',
//	'vort', 'selv', 'no', 'både', 'vors', 'alle', 'ho', 'hossen', 'blei', 'samme', 'være', 'av', 'vi', 'me', 'ned',
//	'før', 'upp', 'dem', 'sidan', 'oss', 'siden', 'noka', 'det', 'du', 'sin', 'somme', 'fordi', 'med', 'ville', 'ein',
//	'ble', 'hvordan', 'hvis', 'eg', 'hva', 'at', 'sia', 'sitt', 'inni', 'fra', 'vart', 'hennes', 'noko', 'kvar', 'men',
//	'vore', 'i', 'nå', 'for', 'mot', 'bare', 'varte', 'um', 'ut', 'denne', 'der', 'mine', 'hans', 'kvifor', 'ja',
//	'begge', 'slik', 'båe', 'den', 'hadde', 'til', 'deres', 'som', 'di', 'medan', 'somt', 'er', 'ikkje', 'også',
//	'hennar', 'om', 'han', 'blir', 'ett', 'noen', 'da', 'ditt', 'over', 'hvilke', 'man', 'meg', 'nokon', 'kvi', 'eitt',
//	'sånn', 'ved', 'noe', 'dette', 'var', 'hvilken', 'dykk', 'inn', 'nokre', 'her', 'deg', 'må', 'gi', 'ga', 'igjen', 'kommentar',
//    'kommentarer'
//];

// http://www.ranks.nl/stopwords/norwegian
var norwegianStopwords = [
    "alle",
    "andre",
    "arbeid",
    "av",
    "begge",
    "bort",
    "bra",
    "bruke",
    "da",
    "denne",
    "der",
    "deres",
    "det",
    "din",
    "disse",
    "du",
    "eller",
    "en",
    "ene",
    "eneste",
    "enhver",
    "enn",
    "er",
    "et",
    "folk",
    "for",
    "fordi",
    "forsøke",
    "fra",
    "få",
    "før",
    "først",
    "gjorde",
    "gjøre",
    "god",
    "gå",
    "ha",
    "hadde",
    "han",
    "hans",
    "hennes",
    "her",
    "hva",
    "hvem",
    "hver",
    "hvilken",
    "hvis",
    "hvor",
    "hvordan",
    "hvorfor",
    "i",
    "ikke",
    "inn",
    "innen",
    "kan",
    "kunne",
    "lage",
    "lang",
    "lik",
    "like",
    "makt",
    "mange",
    "med",
    "meg",
    "meget",
    "men",
    "mens",
    "mer",
    "mest",
    "min",
    "mye",
    "må",
    "måte",
    "navn",
    "nei",
    "ny",
    "nå",
    "når",
    "og",
    "også",
    "om",
    "opp",
    "oss",
    "over",
    "part",
    "punkt",
    "på",
    "rett",
    "riktig",
    "samme",
    "sant",
    "si",
    "siden",
    "sist",
    "skulle",
    "slik",
    "slutt",
    "som",
    "start",
    "stille	",
    "så",
    "tid",
    "til",
    "tilbake",
    "tilstand",
    "under",
    "ut",
    "uten",
    "var",
    "ved",
    "verdi",
    "vi",
    "vil",
    "ville",
    "vite",
    "vår",
    "være",
    "vært",
    "å",
    "kommentar",
    "kommentarer"
];


 
chrome.runtime.onMessage.addListener(
    function (request, sender) {
        if (request.command == "recordLink") {
            setSessionTimeout();
			var interest = {};
			interest.interest = request.interest;
            interest.domain = request.domain;
            storeInterest(interest);
        }
		else if(request.command == "recordPageVisit") {
			var domain = request.domain;
            if (!isSessionValid()) {
                setSessionTimeout();
            }
            chrome.storage.sync.get('username', function (result) {
                if (result.username !== undefined && result.username !== '') {
                    submitDomain(domain);
                }
            })
		}
        else if(request.command == "userLogout") {
            setNewSession();
        }
        else if(request.command == "changeIcon") {
            setIcon(request.icon);
        }
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
        chrome.storage.sync.get('username', function (result) {
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
    if (!isSessionValid()) {
        session = {};
        session['sessionId'] = d;
    }
    var t = new Date(+d + 1*MILLISECONDS_PER_HOUR);
    session['timeout'] = t;
    chrome.storage.local.set({'session': session})
}

function isSessionValid() {
    var d = Date.now();
    if (session === undefined || +session['timeout'] < +d || (+session['sessionId']+4*MILLISECONDS_PER_HOUR < +d) ) {
        return false
    }
    return true
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

function setIcon(icon) {
    //chrome.browserAction.setIcon({
    //    path: icon
    //});
    chrome.browserAction.setBadgeText({
        text: icon
    })
}

setMachineId();
setSession();