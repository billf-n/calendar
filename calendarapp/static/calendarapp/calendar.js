const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const options = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric"
};

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

currentDate = new Date();
calendarDate = new Date();

let yearDropdownValues = [];
for (let i = currentDate.getFullYear(); i < currentDate.getFullYear() + 10; i++) {
    yearDropdownValues.push(i);
}


function loadDates(date = calendarDate.getDate(), monthIndex = calendarDate.getMonth(), year = calendarDate.getFullYear()) {

    // document.getElementById("month").innerHTML = months[calendarDate.getMonth()];
    // document.getElementById("year").innerHTML = calendarDate.getFullYear();
    calendarDate = new Date(year, monthIndex, date);
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
        eachDate += `<button class="date-numbers last-month-numbers" tabindex=-1>${i}</button>`;
        totalDays++;
    }

    // current month's dates
    for (i=1; i<=daysInMonth; i++) {
        if (calendarDate.getDate() == i) {
            eachDate += `<button type="button" class="date-numbers current-month-numbers selected" id="selected" tabindex=0>${i}</button>`;
        }
        else if ((calendarDate.getFullYear() == currentDate.getFullYear())
            && (calendarDate.getMonth() == currentDate.getMonth())
            && (i==currentDate.getDate())) {
            eachDate += `<button type="button" class="date-numbers current-month-numbers today" id="today" tabindex=-1>${i}</button>`;
        }
        else {
            eachDate += `<button type="button" class="date-numbers current-month-numbers" tabindex=-1>${i}</button>`;
        }
        totalDays++;
    }

    // next month's dates
    for (i=1; i<=42-totalDays; i++) {
        eachDate += `<button type="button" class="date-numbers next-month-numbers" tabindex=-1>${i}</button>`;
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
            changeDate(element.currentTarget.textContent, calendarDate.getMonth()+1);
        }, false);
    }

    document.getElementById("event-date").value = formatDate(calendarDate);

}

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


function changeDate(
    // default to keeping it the same
    date = calendarDate.getDate(),
    monthIndex = calendarDate.getMonth(),
    year = calendarDate.getFullYear()) 
{
    let daysInNewMonth = new Date(year, monthIndex+1, 0).getDate();
    if (date > daysInNewMonth) {
        date = daysInNewMonth;
    }
    let newDate = new Date(year, monthIndex, date);
    calendarDate.setTime(newDate.getTime());
    let monthChanged = false;
    if (monthIndex != calendarDate.getMonth()) {
        monthChanged = true;
    }
    
    loadDates(date, monthIndex, year);
}

// to do on document load

const monthDropdown = document.querySelector("#month-drop");
const yearDropdown = document.querySelector("#year-drop");
const dateDisplay = document.getElementById("date-display");

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


let formTimezone = document.getElementById("form-timezone");
formTimezone.value = Intl.DateTimeFormat().resolvedOptions().timeZone;


let timeInput = document.getElementById("event-time");
timeInput.value = currentDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

let goingButtons = document.getElementsByClassName("going-button");

for (const btn of goingButtons) {
    btn.addEventListener("click", (event) => {
        let eventId = btn.value;
        let url = window.location.origin + `/going/${groupId}&${eventId}`;
        fetch(url, {
            method: "POST",
            headers: {"X-CSRFToken": csrftoken},
        }).then((response) => response.text())
        .then((text) => {
            let attendeesList = document.getElementById(`${eventId}-attendees`);
            attendeesList.textContent = text;
            if (text.includes(username)) {
                btn.classList.add("going-selected");
            }
            else {
                btn.classList.remove("going-selected");
            }
        });
    });
}

let deleteEventBtns = document.getElementsByClassName("delete-button");
for (let i=0; i < deleteEventBtns.length; i++) {
    let btn = deleteEventBtns[i];
    btn.addEventListener("click", (event) => {
        let eventId = btn.value;
        let url = window.location.origin + `/delete_event/${groupId}&${eventId}`;
        fetch(url, {
            method: "POST",
            headers: {"X-CSRFToken": csrftoken},
        }).then((response) => {
            if (response.ok) {
                btn.parentElement.parentElement.remove();
            }
        });
    })
}

let newUserForm = document.getElementById("new-user-form") || null;
if (newUserForm) {
    newUserForm.action = window.location.origin + "/signup";
}

loadDates();
updateYearDropdown();
