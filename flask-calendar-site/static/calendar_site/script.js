currentDate = new Date();
calendarDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function loadDates() {

    // document.getElementById("month").innerHTML = months[calendarDate.getMonth()];
    // document.getElementById("year").innerHTML = calendarDate.getFullYear();
    firstOfMonth = new Date();
    firstOfMonth.setTime(calendarDate.getTime());
    firstOfMonth.setDate((1));
    firstWeekday = firstOfMonth.getDay();
    lastOfMonth = new Date(calendarDate.getFullYear(), calendarDate.getMonth()+1, 0);
    daysInMonth = lastOfMonth.getDate();
    eachDate='';

    // previous month's dates
    var lastOfLastMonth = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), 0);
    let firstofLastMonth = lastOfLastMonth.getDate()-firstWeekday+2;
    var totalDays = 0;
    for (i=firstofLastMonth; i<=lastOfLastMonth.getDate(); i++) {
        eachDate += `<button class="date-numbers last-month-numbers">${i}</div>`;
        totalDays++;
    }

    // current month's dates
    for (i=1; i<=daysInMonth; i++) {
        if (calendarDate.getDate() == i) {
            if (1) {
            eachDate += `<button type="button" class="date-numbers" id="selected">${i}</button>`;
            }
        }
        else if ((calendarDate.getFullYear() == currentDate.getFullYear())
            && (calendarDate.getMonth() == currentDate.getMonth())
            && (i==currentDate.getDate())) {
            eachDate += `<button type="button" class="date-numbers current-month-numbers" id="today">${i}</button>`;
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

    document.getElementById("year-drop").innerHTML = years;
    document.getElementById("month-drop").value = months[calendarDate.getMonth()];
    document.getElementById("year-drop").value = calendarDate.getFullYear();
    document.getElementById("date-grid").innerHTML = eachDate;

    // this is probably inefficient. doesnt seem right
    let date_buttons = $(".current-month-numbers");
    for (i = 0; i < date_buttons.length; i++) {
        date_buttons[i].addEventListener("click", function(element){ 
            changeDate(element.currentTarget.textContent);
        }, false);
    }
    date_buttons = $(".last-month-numbers");
    for (i = 0; i < date_buttons.length; i++) {
        date_buttons[i].addEventListener("click", function(element){ 
            changeDate(element.currentTarget.textContent, calendarDate.getMonth()-1);
        }, false);
    }
    date_buttons = $(".next-month-numbers");
    for (i = 0; i < date_buttons.length; i++) {
        date_buttons[i].addEventListener("click", function(element){ 
            changeDate(element.currentTarget.textContent, calendarDate.getMonth()+1);
        }, false);
    }

    $("#event_date").val(formatDate(calendarDate));

}


// to do on document load

const socket = io();

const monthDropdown = document.querySelector("#month-drop");
const yearDropdown = document.querySelector("#year-drop");
const dateDisplay = document.getElementById("date-display")

const options = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric"
};
dateDisplay.innerHTML = currentDate.toLocaleDateString("en-AU", options);
dateDisplay.addEventListener("click", function(element){
    changeDate(
        currentDate.getDate(), 
        currentDate.getMonth(), 
        currentDate.getFullYear());
});

years = "";
for (i=2024; i<2030; i++) {
    years += `<option class="year-drop-btn">${i}</option>`;
}

document.getElementById("last-month").addEventListener("click", function(element){
    changeDate(calendarDate.getDate(), calendarDate.getMonth()-1);
});

document.getElementById("next-month").addEventListener("click", function(element){
    changeDate(calendarDate.getDate(), calendarDate.getMonth()+1);
})

loadDates();
loadEvents();

function changeMonth() {

}

function changeDate(
    date = calendarDate.getDate(),
    month = monthDropdown.selectedIndex,
    year = yearDropdown.options[yearDropdown.selectedIndex].text) 
{
    calendarDate.setFullYear(year);
    calendarDate.setMonth(month);
    calendarDate.setDate(date);

    loadDates();
    loadEvents();
}

function loadEvents() {
    socket.emit("load_events", formatDate(calendarDate), (res) => { // in future maybe add "user" param here
        // display each event for this date
        eventList = $("#event-list");
        console.log(res);
        eventList.empty();
        for (i = 0; i < res.length; i++) {
            
            // make a div and populate it with the info of res[i]
            e = document.createElement("div");
            title = document.createElement("h2");
            creator = document.createElement("h3");
            info = document.createElement("p");
            e.classList.add("event-entry");
            
            // this bit uses js while the parent is a jquery element :-)
            title.textContent = res[i]["title"];
            creator.textContent = res[i]["creator"];
            info.textContent = res[i]["info"];

            e.appendChild(title);
            e.appendChild(creator);
            e.appendChild(info);

            eventList.append(e); // append that div (jquery method)
        }
    });
}

function createCalendarEvent() {
    console.log($("#new-event-title").val());
    console.log($("#new-event-date").val());
    socket.emit("create_event", $("#new-event-title").val(), $("#new-event-info").val(), $("#new-event-date").val());
    // loadEvents();
}
