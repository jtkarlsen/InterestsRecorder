

function setUserCredentials() {
    var username = document.getElementById("input-username").value;
    var password = document.getElementById("input-password").value;
    if (username.length < 2 || password.length < 5) {
        document.getElementById("message").innerHTML = 'Username or password too short';
    } else {
        var url = 'http://129.242.219.56:5000/user/';
        var xmlHttp = null;
        var params = "username="+username+"&password="+password;

        xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function() {
            if (xmlHttp.readyState == 4) {
                if (xmlHttp.status == 200) {
                    setAuthenticated(username);
                } else {
                    document.getElementById("message").innerHTML = xmlHttp.responseText;
                }
            }
        }
        xmlHttp.open( "POST", url, true );
        xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlHttp.send( params );
    }
}

function removeUserCredentials() {
    chrome.storage.local.set({'username': ''}, function() {
        if (chrome.extension.lastError) {
            alert('An error occurred: ' + chrome.extension.lastError.message);
        }
    });
    setLoginVisible();
    document.getElementById("message").innerHTML = 'Not logged in';
    chrome.runtime.sendMessage({command: "userLogout"});
}

function createUserCredentials() {
    var username = document.getElementById("input-username").value;
    var password = document.getElementById("input-password").value;
    if (username.length < 3 || password.length < 5) {
        document.getElementById("message").innerHTML = 'Username or password too short';
    } else {
        var url = 'http://129.242.219.56:5000/user/new';
        var xmlHttp = null;
        var params = "username="+username+"&password="+password;

        xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function() {
            if (xmlHttp.readyState == 4) {
                if (xmlHttp.status == 200) {
                    setAuthenticated(username);
                } else {
                    document.getElementById("message").innerHTML = xmlHttp.responseText;
                }
            }
        }
        xmlHttp.open( "POST", url, true );
        xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlHttp.send( params );
    }
}
function init() {
    setLoginVisible();
    chrome.storage.local.get('username', function (result) {
        var username = '';
        if (result.username !== undefined && result.username !== '') {
            username = result.username;
            showUsername(username);
            setLogoutVisible();
        }
    })
}

function setAuthenticated(username) {
    chrome.storage.local.set({'username': username});
    setLogoutVisible();
    showUsername(username);
}

function setLoginVisible() {
    document.getElementById("login").style.display = "block";
    document.getElementById("logout").style.display = "none";
}

function setLogoutVisible() {
    document.getElementById("login").style.display = "none";
    document.getElementById("logout").style.display = "block";
}

function showUsername(username) {
    document.getElementById("message").innerHTML = 'User: '+username;
}

window.onload = function() {
    document.getElementById("setUserCredentials").addEventListener("click", setUserCredentials);
    document.getElementById("removeUserCredentials").addEventListener("click", removeUserCredentials);
    document.getElementById("createUserCredentials").addEventListener("click", createUserCredentials);
    init();
};