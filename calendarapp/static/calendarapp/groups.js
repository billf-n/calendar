// object with
// keys: {
// "group_id": [id], 
// "username": "[username]"
// }
// and values either 0 or 1, if the confirm leave popup is up.
let groupsWithPopup = {};

// function from https://stackoverflow.com/a/6348597/23877268
function addEvent(element, evnt, funct){
    if (element.attachEvent)
        return element.attachEvent('on'+evnt, funct);
    else
        return element.addEventListener(evnt, funct, false);
}


// from https://docs.djangoproject.com/en/5.1/howto/csrf/#using-csrf
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
const csrftoken = getCookie('csrftoken');

function leaveGroupPopup(id, username, button1) {
    // display a confirmation
    let popup = document.createElement("div");
    popup.classList.add("leave-group-popup");
    popup.id = `popup-${id}-${username}`;

    let inner = `
    <h3>Are you sure?</h3>
    <div class="opposite-sides gap-4">
        <button id="cancel-${id}-${username}" class="material-symbols-outlined leave-group-cancel">close</button>
        <button id="confirm-${id}-${username}"value="{
                "id":${id},
                "user":"${username}"
              }" class="button-small leave-group-confirm">Leave group
        </button>
    </div>`
    popup.innerHTML = inner;

    let joinedGroup = button1.parentNode.parentNode;
    joinedGroup.after(popup);

    document.getElementById(`cancel-${id}-${username}`)
    .addEventListener("click", () => {
        removeLeavePopup(id, username);
    })

    document.getElementById(`confirm-${id}-${username}`)
    .addEventListener("click", () => {
        leaveGroup(id, username);
    })

    groupsWithPopup[button1.value] = 1;
}


function removeLeavePopup(id, username) {
    let btn1 = document.getElementById(`leavebtn1-${id}-${username}`);
    let popup = document.getElementById(`popup-${id}-${username}`);
    popup.remove();
    groupsWithPopup[btn1.value] = 0;
    return;
}


function leaveGroup(id, username) {
      let url = window.location.origin + `/leavegroup/${id}`;
    fetch(url, {
        method: "POST",
        headers: {"X-CSRFToken": csrftoken},
        body: JSON.stringify({
            username: username
        })
    }).then((response) => {
        if (response.ok) {
            let group = document.getElementById(`section-${id}-${username}`);
            group.remove();
        }
    });
}

// add event listeners to buttons.

let leaveGroups = document.getElementsByClassName("leave-group");
for (let i=0; i < leaveGroups.length; i++) {
    groupsWithPopup[leaveGroups[i].value] = 0;
    addEvent(leaveGroups[i], "click", (event) => {
        
        let btn = event.target;
        let groupInfo = JSON.parse(btn.value);
        if (groupsWithPopup[leaveGroups[i].value] === 1) {
            removeLeavePopup(groupInfo["id"], groupInfo["user"]);
            return;
        }
        
        leaveGroupPopup(groupInfo["id"], groupInfo["user"], btn);
    })
}

addEvent(document.getElementById("create-group-button"), "click", () => {
    groupName = document.getElementById("group-name").value;
    createGroup(groupName);
});

