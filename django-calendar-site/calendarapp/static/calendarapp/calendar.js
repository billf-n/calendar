const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const options = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric"
};

currentDate = new Date();
calendarDate = new Date();

let yearDropdownValues = [];
for (let i = currentDate.getFullYear(); i < currentDate.getFullYear() + 10; i++) {
    yearDropdownValues.push(i);
}


function loadDates() {

    // document.getElementById("month").innerHTML = months[calendarDate.getMonth()];
    // document.getElementById("year").innerHTML = calendarDate.getFullYear();
    let firstOfMonth = new Date();
    firstOfMonth.setTime(calendarDate.getTime()); // sets the full date to calendardate
    firstOfMonth.setDate(1);
    let firstWeekday = firstOfMonth.getDay();
    if (firstWeekday === 0) {
        firstWeekday = 7;
    }

    let lastOfMonth = new Date(calendarDate.getFullYear(), calendarDate.getMonth()+1, 0);
    let daysInMonth = lastOfMonth.getDate();
    let eachDate='';

    // adding previous month's dates
    let lastOfLastMonth = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), 0);
    let firstOfLastMonth = lastOfLastMonth.getDate()-firstWeekday+2;
    let totalDays = 0;
    for (i=firstOfLastMonth; i<=lastOfLastMonth.getDate(); i++) {
        eachDate += `<button class="date-numbers last-month-numbers">${i}</button>`;
        totalDays++;
    }

    // current month's dates
    for (i=1; i<=daysInMonth; i++) {
        if (calendarDate.getDate() == i) {
            eachDate += `<button type="button" class="date-numbers current-month-numbers selected" id="selected">${i}</button>`;
        }
        else if ((calendarDate.getFullYear() == currentDate.getFullYear())
            && (calendarDate.getMonth() == currentDate.getMonth())
            && (i==currentDate.getDate())) {
            eachDate += `<button type="button" class="date-numbers current-month-numbers today" id="today">${i}</button>`;
        }
        else {
            eachDate += `<button type="button" class="date-numbers current-month-numbers">${i}</button>`;
        }
        totalDays++;
    }

    // next month's dates
    for (i=1; i<=42-totalDays; i++) {
        eachDate += `<button type="button" class="date-numbers next-month-numbers">${i}</button>`;
    }

    // This should only happen when not changing using the dropdown!
    document.getElementById("month-drop").value = months[calendarDate.getMonth()];
    if (!yearDropdownValues.includes(calendarDate.getFullYear())) {
        yearDropdownValues.push(calendarDate.getFullYear());
        updateYearDropdown();
    }
    document.getElementById("year-drop").value = calendarDate.getFullYear();
    document.getElementById("date-grid").innerHTML = eachDate;

    let date_buttons = document.getElementsByClassName("current-month-numbers");
    for (i = 0; i < date_buttons.length; i++) {
        date_buttons[i].addEventListener("click", function(element){ 
            changeDate(element.currentTarget.textContent);
        }, false);
    }
    date_buttons = document.getElementsByClassName("last-month-numbers");
    for (i = 0; i < date_buttons.length; i++) {
        date_buttons[i].addEventListener("click", function(element){ 
            changeDate(element.currentTarget.textContent, calendarDate.getMonth()-1);
        }, false);
    }
    date_buttons = document.getElementsByClassName("next-month-numbers");
    for (i = 0; i < date_buttons.length; i++) {
        date_buttons[i].addEventListener("click", function(element){ 
            changeDate(element.currentTarget.textContent, calendarDate.getMonth());
        }, false);
    }

    document.getElementById("event-date").value = formatDate(calendarDate);

}

// to do on document load

const monthDropdown = document.querySelector("#month-drop");
const yearDropdown = document.querySelector("#year-drop");
const dateDisplay = document.getElementById("date-display")

monthDropdown.addEventListener("change", () => {
    changeDate(
        1,
        monthDropdown.selectedIndex,
        calendarDate.getFullYear()
    );
});

yearDropdown.addEventListener("change", () => {
    changeDate(
        calendarDate.getDate(),
        calendarDate.getMonth(),
        parseInt(yearDropdown.selectedOptions[0].textContent)
    );
});

function updateYearDropdown() {
    yearDropdown.replaceChildren(); // clear options
    yearDropdownValues.sort();
    yearDropdownValues.forEach((e) => {
        let option = document.createElement("option");
        option.classList.add("year-drop-btn");
        option.innerText = e;
        option.value = e;
        yearDropdown.appendChild(option);
    });
}

dateDisplay.innerHTML = currentDate.toLocaleDateString("en-AU", options);
dateDisplay.addEventListener("click", function(){
    changeDate(
        currentDate.getDate(), 
        currentDate.getMonth(), 
        currentDate.getFullYear());
});


document.getElementById("last-month").addEventListener("click", function(element){
    changeDate(calendarDate.getDate(), calendarDate.getMonth()-1);
});

document.getElementById("next-month").addEventListener("click", function(element){
    changeDate(calendarDate.getDate(), calendarDate.getMonth()+1);
})


function changeDate(
    // default to keeping it the same
    date = calendarDate.getDate(),
    month = calendarDate.getMonth(),
    year = calendarDate.getFullYear()) 
{
    debugger;
    let monthChanged = false;
    if (month != calendarDate.getMonth()) {
        monthChanged = true;
    }
    calendarDate.setDate(date);
    calendarDate.setMonth(month);
    calendarDate.setFullYear(year);
    
    loadDates();
    // loadEvents();
}

function loadEvents() {
    fetch(window.location.href, {
        method: "GET",
        headers: {
            "calendar-date": calendarDate.toISOString(),
        },
    })
}

function createCalendarEvent() {
    form = document.getElementById("create-new-event");
    fetch(form.action, {
        method: "POST",
        body: JSON.stringify(new FormData(form))
    })
}

let form = document.getElementById("new-user-form") || null;
if (form) {
    function submitNewUser(event) {
        event.preventDefault();
        fetch(form.action, {
            method: "post",
            body: new FormData(form)
        }).then((response) => {
            let resjson = response.json();
            if (resjson.signed_in) {
                document.getElementById("popup-background").remove();
            }
        });
    }
    form.addEventListener("submit", submitNewUser);
}

loadDates();
if (signedIn) {
    loadEvents();
}
updateYearDropdown();
