var currentAccount = "";
var bindedContract = [];
var contractListners = [];
var knownHash = [];
var preferences;

// Check if account changed
function accountUpdate(account) {
    if (currentAccount != account) {
        currentAccount = account;

        if (typeof account == 'undefined') {
            toast("Please unlock account");
            $("#main").load("./views/locked.html")
            $("#navbarNavAltMarkup").find("#cntAsAccount").text("User : Locked");
            return;
        }
        else
            $("#main").load("./views/main.html")

        provider.eth.defaultAccount = account;
        $("#navbarNavAltMarkup").find("#cntAsAccount").text("User : " + account.substring(0, 10) + "[...]");
        reloadPreference();
    }
}
// Start DApp 
function startDapp(provider) {
    if (!provider.isConnected()) {
        toast("Not connected")
        //Metamask needed 
        $('#main').replaceWith('<div><a href="https://metamask.io/"><img src="./img/metamask-required.png" /></a></div>');
        return;
    }
	//First load
	accountUpdate(provider.eth.accounts[0]);
	
    //Account refresh
    setInterval(() => {
        web3.eth.getAccounts((err, accounts) => {
            console.log("Refresh account ...");
            if (err) return
            accountUpdate(accounts[0]);
        })
    }, 3000);

    provider.sendAsync = Web3.providers.HttpProvider.prototype.send;
}
// Reload user preferences
function reloadPreference() {	
    toast("Reloading preferences for " + currentAccount + "...");
    getUserPreference(currentAccount);
}
// Display message (toast style)
function toast(message) {
    var x = document.getElementById("snackbar");
    x.className = "show";
    x.innerHTML = message;
    setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
}
// Generate keccak256 hash of passed string
function generateHash() {
    let codeToHash = $("#strToHash").val();
    let hashed = keccak_256(codeToHash);
    knownHash.push({ hash: '0x'+hashed, plain: codeToHash });
    console.log(knownHash);
}
/*
function generateHash(clear) {
    let codeToHash = clear;
    let hashed = keccak256(codeToHash);
    knownHash.push({ hash: hashed, plain: codeToHash });
    console.log(knownHash);
}*/