const member_list_max_chars = 30;

// set the buttons to work.
let viewGroups = document.getElementsByClassName("view-group-button");


function loadGroups() {
    fetch("");
}

function loadGroupInvites() {

}

for (i=0; i<viewGroups.length; i++) {
    viewGroups[i].addEventListener("click", function(element){
        viewGroup(element.value);
    })
}

loadGroups();

document.getElementById("create-group-button").addEventListener("click", function(){
    groupName = document.getElementById("group-name").value;
    createGroup(groupName);
});

