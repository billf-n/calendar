// load joined groups / group invites (use cookie / {socket??})

const socket = io();
const member_list_max_chars = 30;

// set the buttons to work.
let viewGroups = document.getElementsByClassName("view-group-button");

function viewGroup(groupName) {
    // check token, if they are actually in the group (backend)
    // send socket to view group
}

function createGroup(){
    
}

function loadGroups() {
    socket.emit("load_groups", (res) => {
        joined = document.getElementById("joined-groups-sub");
        for (i = 0; i < res.length; i++) {
            container = document.createElement("div");
            container.classList.add("little-box-section");
            container.classList.add("joined-group");
            container.id = res["group_id"];

            title = document.createElement("h3");
            title.textContent = res["group_name"];

            members = document.createElement("p");
            j = 0;
            memberList = "";
            while ((j < res["users"].length) && 
            (memberList.length < member_list_max_chars)) {
                memberList.concat(", ", res["users"][j])
                j++;
            }
            memberList = memberList.substring(0, member_list_max_chars);
            members.textContent = memberList;

            button = document.createElement("button");
            button.id = res["group_id"];
            button.classList.add("small-button");
            button.textContent = "View group";

            container.appendChild(title);
            container.appendChild(members);
            container.appendChild(button);
            joined.appendChild(container);
        }
    })
}

function loadGroupInvites() {
    invites = document.getElementById("group-invites-sub");
    socket.emit("load_group_invites", (res) => {
        for (i = 0; i < res.length; i++) {
            container = document.createElement("div");
            container.classList.add("little-box-section");
            container.classList.add("group-invite");
            container.id = res["group_id"];

            title = document.createElement("h3");
            title.textContent = res["group_name"];

            members = document.createElement("p");
            j = 0;
            memberList = "";
            while ((j < res["users"].length) && 
            (memberList.length < member_list_max_chars)) {
                memberList.concat(", ", res["users"][j])
                j++;
            }
            memberList = memberList.substring(0, member_list_max_chars);
            members.textContent = memberList;

            acceptButton = document.createElement("button");
            acceptButton.id = res["group_id"];
            acceptButton.classList.add("small-button");
            acceptButton.classList.add("accept-invite");
            acceptButton.textContent = "Accept";

            declineButton = document.createElement("button");
            declineButton.id = res["group_id"];
            declineButton.classList.add("small-button");
            declineButton.classList.add("decline-invite");
            declineButton.textContent = "Decline";

            container.appendChild(title);
            container.appendChild(members);
            container.appendChild(acceptButton);
            container.appendChild(declineButton);
            joined.appendChild(container);
        }
    })
}

function createGroupPopup() {
    let createGroupSection = document.getElementById("create-group-popup-wrap");
    createGroupSection.innerHTML = '<div id="create-group-popup" class="hidden">\
    <h3>Create a group</h3>\
    <div id="group-name-div">\
        <label for="new-group-name" id="group-name-label">Group name</label>\
        <input type="input" name="new-group-name" id="new-group-name">\
    </div>\
    <button class="small-button">Create a group</button>\
    </div>';
    setTimeout(function() {
        document.getElementById("create-group-popup").classList.add("expanded");
        document.getElementById("create-group-popup").classList.remove("hidden");
    }, 1);
}

function removeGroupPopup() {
    let createGroupSection = document.getElementById("create-group-popup");
    document.getElementById("create-group-popup").classList.add("hidden");
    document.getElementById("create-group-popup").classList.remove("expanded");
    setTimeout(function() {
        createGroupSection.innerHTML = "";
    }, 200);
}

function acceptInvite(groupId) {
}

function declineInvite(groupId) {

}

for (i=0; i<viewGroups.length; i++) {
    viewGroups[i].addEventListener("click", function(element){
        viewGroup(element.value);
    })
}

let acceptGroupInvites = document.getElementsByClassName("accept-invite");
for (i=0; i<acceptGroupInvites.length; i++) {
    acceptGroupInvites[i].addEventListener("click", function(element){
        acceptInvite(element.value);
        console.log("accept");
    })
}

let declineGroupInvites = document.getElementsByClassName("decline-invite");
for (i=0; i<declineGroupInvites.length; i++) {
    declineGroupInvites[i].addEventListener("click", function(element){
        console.log("decline");
    })
}

loadGroups();

let popupDisplayed = 0;

let createGroupButton = document.getElementById("create-group-button");
console.log(createGroupButton);
createGroupButton.addEventListener("click", function(e){
    if (!popupDisplayed) {
        createGroupPopup();
        popupDisplayed = 1;
    } else {
        removeGroupPopup();
        popupDisplayed = 0;
    }
})
