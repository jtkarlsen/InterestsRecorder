/**
 * Collect the contextual data of link clicks and store it.
 */
 
var sessionId = Date.now();

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
 
chrome.runtime.onMessage.addListener (
    function (request, sender) {

        if (request.command == "recordLink") {
			var interest = {};
			interest.sessionId = sessionId;
			interest.interest = request.interest;
			interest.time = getTime();
            navigator.geolocation.getCurrentPosition (function (position) {
                interest.geoLatitude = position.coords.latitude
                interest.geoLongditude = position.coords.longitude
				storeInterest(interest);
            }, function() {
					storeInterest(interest);
			});
        }
		else if(request.command == "recordPageVisit") {
			var interest = {};
			interest.sessionId = sessionId;
			interest.title = request.title;
			interest.url = request.url;
			interest.time = getTime();
            navigator.geolocation.getCurrentPosition (function (position) {
                interest.geoLatitude = position.coords.latitude
                interest.geoLongditude = position.coords.longitude
				storeInterest(interest);
            }, function() {
					storeInterest(interest);
			});
		}
		else if(request.command == "recordSearch") {
			var interest = {};
			interest.sessionId = sessionId;
			interest.interest = request.interest;
			interest.time = getTime();
            navigator.geolocation.getCurrentPosition (function (position) {
                interest.geoLatitude = position.coords.latitude
                interest.geoLongditude = position.coords.longitude
				storeInterest(interest);
            }, function() {
					storeInterest(interest);
			});
		}
		else if(request.command == 'generateQuery') {
			createQuery();
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
	cleanedInterests = interest.interest.replace(/[^-æøåa-zA-Z0-9 ]/g, '');
	console.log(cleanedInterests);
	
	cleanedInterestsWithoutStopwords = removeStopwords(cleanedInterests);
	console.log(cleanedInterestsWithoutStopwords);
	
	interest.interest = cleanedInterestsWithoutStopwords;
	
	if(interest.interest.length > 0) {
		chrome.storage.sync.get('interests', function (result) {
			var interests = result.interests;
			if (interests === undefined) {
				interests = [];
			}
			console.log(interests);
			interests.push(interest);
			saveInterests(interests);
		});
	}
	
}

function saveInterests(interests) {
		chrome.storage.sync.set({'interests': interests});
}

function removeStopwords(interest)
{
	
	return getNoneStopWords(interest)
	/*var url = 'http://localhost:5000/sentence/';
    var xmlHttp = null;

    xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url+interest, false );
    xmlHttp.send( null );
    return JSON.parse(xmlHttp.responseText);*/
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
		if (!commonObj[word] && isNaN(word)) {
			uncommonArr.push(word);
		}
	}
	return uncommonArr;
}

setTimeout(createQuery, 1000, 1000*60*15);

function createQuery() {
	console.log('creating query');
	chrome.storage.sync.get('interests', function (result) {
			var interests = result.interests;
			if (interests === undefined) {
				interests = [];
			}
			var queryObject = createQueryObject(interests);
			console.log(queryObject);
			chrome.storage.sync.set({'query': queryObject});
			console.log('query created');
		});
}

function createQueryObject(interests) {
	var interestTuples = [];
	var shouldArray = [];
	var interestsString = "";
	var msTreshhold = 2592000000;  // 172800000 = 48 hours, 2592000000 = 30 days

	for(var i = 0; i<interests.length; i++) {
		var time = interests[i].time;
		time = time.replace(/'/g, "");
		time = time.slice(0, -1);
		var freshness = getFreshness(time);
		var timeBoost = (msTreshhold - freshness) / 1000;
		if (timeBoost > 0) {
			var subInterests = interests[i].interest;
			for(var j = 0; j<subInterests.length; j++) {
				var notFound = true;
				var interest = subInterests[j];
				for (var k = 0; k<interestTuples.length; k++) {
					if(interestTuples[k].interest === interest) {
						interestTuples[k].count = interestTuples[k].count + timeBoost;
						notFound = false;
					}
				}
				if (interestTuples.length === 0 || notFound){
					var interestTuple = {'interest':interest, 'count':timeBoost};
					interestTuples.push(interestTuple);
				}
			}
		}
		
	}
	for(var l = 0; l<interestTuples.length; l++) {
		interestsString += (interestTuples[l].interest + ' ');

		if(interestTuples[l].count > 0) {
			var should = {
				"multi_match": {
					"query": interestTuples[l].interest,
					"fields": [ "title" ],
					"boost": interestTuples[l].count
				}
			};
			shouldArray.push(should);
		}
	}
	console.log(interestTuples);
	var query;
	if(interestsString.length > 0) {
		query = {
			"query": {
				"bool": {
//					"must": [
//						{
//							"multi_match": {
//								"query":    interestsString,
//								"fields": [ "title" ]
//							}
//						}],
					"should": shouldArray
				}
			}
		};
	}
	return query;
}