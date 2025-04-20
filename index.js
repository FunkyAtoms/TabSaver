let myLeads = []
const inputEl = document.getElementById("input-el")
const inputBtn = document.getElementById("input-btn")
const testBtn = document.getElementById("test-btn")
const ulEl = document.getElementById("ul-el")
const deleteBtn = document.getElementById("delete-btn")
const sortBtn = document.getElementById("sort-btn");
const sortZBtn = document.getElementById("Zsort-btn");
const leadsFromLocalStorage = JSON.parse( localStorage.getItem("myLeads") )
const tabBtn = document.getElementById("tab-btn")
const timesBtn = document.getElementById("time-btn")
const timesrevBtn = document.getElementById("timerev-btn")

if (leadsFromLocalStorage) {
    myLeads = leadsFromLocalStorage
    render(myLeads)
}

//For OperaGX users: make sure to turn on Allow access to search page results in extensions settings
//I may have added activeTab permission in manifest.json file to make sure
tabBtn.addEventListener("click", function(){ 
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        const currentTime = new Date().getTime(); // get current timestamp
        myLeads.push({url: tabs[0].url, timestamp: currentTime})
        localStorage.setItem("myLeads", JSON.stringify(myLeads) )
        render(myLeads)
    })
})

function render(leads) {
    let listItems = "";
    for (let i = 0; i < leads.length; i++) {
        const lead = leads[i];
        const timestamp = new Date(lead.timestamp).toLocaleString(); // format timestamp
        listItems += `
            <li>
                <a target='_blank' href='${lead.url}'>${lead.url}</a>
                <span class="timestamp"> (saved at ${timestamp})</span>
            </li>
        `;
    } //Displays timestamp saved
    ulEl.innerHTML = listItems;
}

deleteBtn.addEventListener("dblclick", function() {
    console.log("db Button clicked!");
    localStorage.clear()
    myLeads = []
    render(myLeads)
})

inputBtn.addEventListener("click", function() {
    if (inputEl.value.trim() !== "") { // check if the input is not empty
        const currentTime = new Date().getTime(); // get current timestamp
        myLeads.push({ url: inputEl.value, timestamp: currentTime });
        inputEl.value = "";
        localStorage.setItem("myLeads", JSON.stringify(myLeads));
        render(myLeads);
    } else {
        alert("Please enter a URL"); // display an alert if the input is empty
    }
});

sortBtn.addEventListener("click", function() {
    console.log("sorted!")
    myLeads.sort((a, b) => a.url.localeCompare(b.url)); // sort by URL A-Z alphabetically
    localStorage.setItem("myLeads", JSON.stringify(myLeads) );
    render(myLeads);
});

sortZBtn.addEventListener("click", function() {
    console.log("reverse!")
    myLeads.sort((a, b) => b.url.localeCompare(a.url)); // sort by URL Z-A alphabetically
    localStorage.setItem("myLeads", JSON.stringify(myLeads) );
    render(myLeads);
});

timesBtn.addEventListener("click", function(){
    console.log("Timez rate!")
    myLeads.sort((a, b) => a.timestamp - b.timestamp); // sort by timestamp in ascending order
    localStorage.setItem("myLeads", JSON.stringify(myLeads));
    render(myLeads);
})

timesrevBtn.addEventListener("click", function(){
    console.log("Timez Thirds: Timez Rewind!")
    myLeads.sort((a, b) => b.timestamp - a.timestamp); // sort by timestamp in descending order
    localStorage.setItem("myLeads", JSON.stringify(myLeads));
    render(myLeads);
})
