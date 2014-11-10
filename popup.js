

function deleteUserProfile() {
	chrome.storage.local.clear();
}

function generateUserProfile() {
	chrome.runtime.sendMessage({command: "generateQuery"});
}

window.onload = function() {
	document.getElementById("deleteButton").addEventListener("click", deleteUserProfile);
	document.getElementById("generateButton").addEventListener("click", generateUserProfile);
};