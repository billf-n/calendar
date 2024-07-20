const switchButton = document.getElementById("switch-text");
const title = document.getElementById("title");
const submitButton = document.getElementById("submit-text");
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

    signupVar = true;
    document.title = "Sign up - Events";
}

function switchToLogin() {
    transitionElement(title, "Log in to your account");
    transitionElement(submitButton, "Log in");
    transitionElement(switchButton, "Don't have an account?");

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
