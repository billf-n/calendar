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

$("#create-group-form").submit(function(e) {
    // from: 
    // https://stackoverflow.com/questions/1960240/jquery-ajax-submit-form

    e.preventDefault(); // avoid to execute the actual submit of the form.

    let form = $(this);
    let actionUrl = form.attr('action');
    
    $.ajax({
        type: "POST",
        url: actionUrl,
        data: form.serialize(), // serializes the form's elements.
        success: function(data)
        {
            if (data === "Error retrieving current user info.") {
                // TODO: also display this on the page instead.
                alert(data);
            } else {
                window.open(data, "_self");
            }
        }
    });
    
});
