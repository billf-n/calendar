const switchButton = document.getElementById("switch-text");
const title = document.getElementById("title");
const submitButton = document.getElementById("submit-text");
const mode = document.getElementById("mode");
let signupVar = true;

function transitionElement(e, newMsg) {
    e.classList.add("out");
    setTimeout(function() {
        e.classList.remove("out");
        e.textContent = newMsg;
        e.classList.add("fadein");
        setTimeout(function(){
            e.classList.remove("fadein");
        }, 250);
    }, 250);
}

function switchToSignup() {
    transitionElement(title, "Sign up for a new account");
    transitionElement(submitButton, "Sign up");
    transitionElement(switchButton, "Already have an account?");
    mode.textContent = "signup";

    signupVar = true;
    document.title = "Sign up - Events";
}

function switchToLogin() {
    transitionElement(title, "Log in to your account");
    transitionElement(submitButton, "Log in");
    transitionElement(switchButton, "Don't have an account?");
    mode.textContent = "login";

    signupVar = false;
    document.title = "Log in - Events";
}

switchButton.addEventListener("click", function(e){
    if (signupVar) {
        switchToLogin();
    } else {
        switchToSignup();
    }
}, false)

$("#signup-form").submit(function(e) {
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
            if ((data === "User already exists.") || 
                (data === "Incorrect login details.")) {
                alert(data);
            } else {
                window.open(data, "_self");
            }
        }
    });
    
});
