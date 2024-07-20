const switchButton = document.getElementById("switch-button");
const title = document.getElementById("title");
const submitButton = document.getElementById("submit-button");
console.log(submitButton);
let signup = true;

switchButton.addEventListener("click", function(e){
    if (signup) {

        title.classList.add("out");
        setTimeout(function(){
            title.classList.remove("out");
            title.textContent = "Log in to your account";
            title.classList.add("fadein");
            setTimeout(function(){
                title.classList.remove("fadein");
            }, 250);
        }, 250);
        submitButton.textContent = "Log in";
        switchButton.textContent = "Don't have an account?";
        signup = false;
    } else {
        title.classList.add("out");
        setTimeout(function(){
            title.classList.remove("out");
            title.textContent = "Sign up for a new account";
            title.classList.add("fadein");
            setTimeout(function(){
                title.classList.remove("fadein");
            }, 250);
        }, 250);
        submitButton.textContent = "Sign up";
        switchButton.textContent = "Already have an account?";
        signup = true;
    }
}, false)