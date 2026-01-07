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
const filterBtn = document.getElementById("filter-btn");
const filterMenu = document.getElementById("filter-menu");

if (leadsFromLocalStorage) {
    myLeads = leadsFromLocalStorage
    render(myLeads)
}

//For OperaGX users: make sure to turn on Allow access to search page results in extensions settings
//I may have added activeTab permission in manifest.json file to make sure
tabBtn.addEventListener("click", function(){ 
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        const currentTime = new Date().getTime(); // get current timestamp
        const tab = tabs[0];
        myLeads.push({
            url: tab.url,
            title: tab.title || tab.url, // Use title if available, fallback to URL
            timestamp: currentTime
        });
        localStorage.setItem("myLeads", JSON.stringify(myLeads));
        render(myLeads);
    });
})

function render(leads) {
    let listItems = "";
    for (let i = 0; i < leads.length; i++) {
        const lead = leads[i];
        const timestamp = new Date(lead.timestamp).toLocaleString();
        listItems += `
            <li>
                <a target='_blank' href='${lead.url}'>${lead.title || lead.url}</a>
                <span class="timestamp"> (saved at ${timestamp})</span>
                <button type="button" class="delete-single-btn" data-id="${lead.timestamp}" title="Delete this tab">Delete</button>
            </li>
        `;
    }
    ulEl.innerHTML = listItems;
}

// Toggle the menu when clicking the button
filterBtn.addEventListener("click", function(event) {
    event.stopPropagation(); // Prevents immediate closing
    filterMenu.classList.toggle("show");
});

// Close the menu if the user clicks anywhere else on the screen
document.addEventListener("click", function() {
    filterMenu.classList.remove("show");
});

deleteBtn.addEventListener("click", function() {
    const confirmation = confirm("Are you sure you want to delete ALL saved tabs? This cannot be undone.");
    if (confirmation) {
        console.log("Delete All confirmed");
        // Use removeItem specifically for your list so you don't accidentally 
        // wipe other extension settings if you add them later
        localStorage.removeItem("myLeads"); 
        myLeads = [];
        render(myLeads);
    } else {
        console.log("Delete All cancelled");
    }
});

inputBtn.addEventListener("click", function() {
    if (inputEl.value.trim() !== "") {
        const currentTime = new Date().getTime();
        myLeads.push({ 
            url: inputEl.value, 
            title: inputEl.value, // Set title to the URL for manual entries
            timestamp: currentTime 
        });
        inputEl.value = "";
        localStorage.setItem("myLeads", JSON.stringify(myLeads));
        render(myLeads);
    } else {
        alert("Please enter a URL");
    }
});

sortBtn.addEventListener("click", function() {
    console.log("Sorted A-Z by Title");
    myLeads.sort((a, b) => {
        // Use title if it exists, otherwise use the URL
        const nameA = (a.title || a.url).toLowerCase();
        const nameB = (b.title || b.url).toLowerCase();
        return nameA.localeCompare(nameB);
    });
    localStorage.setItem("myLeads", JSON.stringify(myLeads));
    render(myLeads);
});

sortZBtn.addEventListener("click", function() {
    console.log("Sorted Z-A by Title");
    myLeads.sort((a, b) => {
        const nameA = (a.title || a.url).toLowerCase();
        const nameB = (b.title || b.url).toLowerCase();
        return nameB.localeCompare(nameA); // Reverse the comparison
    });
    localStorage.setItem("myLeads", JSON.stringify(myLeads));
    render(myLeads);
});

timesBtn.addEventListener("click", function(){
    filterMenu.classList.remove("show");
    console.log("Timez rate!")
    myLeads.sort((a, b) => a.timestamp - b.timestamp); // sort by timestamp in ascending order
    localStorage.setItem("myLeads", JSON.stringify(myLeads));
    render(myLeads);
})

timesrevBtn.addEventListener("click", function(){
    filterMenu.classList.remove("show");
    console.log("Timez Thirds: Timez Rewind!")
    myLeads.sort((a, b) => b.timestamp - a.timestamp); // sort by timestamp in descending order
    localStorage.setItem("myLeads", JSON.stringify(myLeads));
    render(myLeads);
})

ulEl.addEventListener("click", function(event) {
    if (event.target.classList.contains("delete-single-btn")) {
        event.preventDefault();
        event.stopPropagation();
        const id = event.target.getAttribute("data-id");
        const index = myLeads.findIndex(lead => String(lead.timestamp) === id);
        if (index !== -1) {
            myLeads.splice(index, 1);
            localStorage.setItem("myLeads", JSON.stringify(myLeads));
            render(myLeads);
        }
    }
});

function render(leads) {
    let listItems = "";
    for (let i = 0; i < leads.length; i++) {
        const lead = leads[i];
        const timestamp = new Date(lead.timestamp).toLocaleString();
        listItems += `
            <li>
                <a target='_blank' href='${lead.url}'>${lead.title || lead.url}</a>
                <span class="timestamp"> (saved at ${timestamp})</span>
                <button type="button" class="delete-single-btn" data-id="${lead.timestamp}" title="Delete this tab">Delete</button>
            </li>
        `;
    }
    ulEl.innerHTML = listItems;

    // ADD THIS LINE TO UPDATE THE COUNTER
    document.getElementById("status-el").textContent = leads.length + " item(s) saved";
}