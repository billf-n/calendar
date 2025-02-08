
// function from https://stackoverflow.com/a/6348597/23877268
function addEvent(element, evnt, funct){
    console.log(element);
    if (element.attachEvent)
        return element.attachEvent('on'+evnt, funct);
    else
        return element.addEventListener(evnt, funct, false);
}


function leaveGroupPopup(id, username) {
    // display a confirmation
    let container = document.createElement("div");
    
    if (0) {
        leaveGroup(id, username)
    }
} 

function leaveGroup(id, username) {
    let url = window.location.origin + `/leavegroup/${id}`;
    fetch(url, {
        method: "POST",
        body: JSON.stringify({
            username: username
        })
    }).then((response) => {

    });
}

// add event listeners to buttons.

let leaveGroups = document.getElementsByClassName("leave-group");
for (let i=0; i < leaveGroups.length; i++) {
    addEvent(leaveGroups[i], "click", (event) => {
        let btn = event.target;
        let groupInfo = JSON.parse(btn.value);
        leaveGroupPopup(groupInfo["id"], groupInfo["username"]);
    })
}

addEvent(document.getElementById("create-group-button"), "click", () => {
    groupName = document.getElementById("group-name").value;
    createGroup(groupName);
});

