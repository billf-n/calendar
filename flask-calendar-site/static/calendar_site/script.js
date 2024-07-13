const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const options = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric"
};
// to do on document load
let currentDate = new Date();
let calendarDate = new Date(currentDate);

const socket = io();

const monthDropdown = document.querySelector("#month-drop");
const yearDropdown = document.querySelector("#year-drop");


//loadDates() is called later (also for doing once on document loading)

function loadDates() {

    document.getElementById("date-display").innerHTML = currentDate.toLocaleDateString("en-AU", options);
    firstOfMonth = new Date();
    firstOfMonth.setTime(calendarDate.getTime());
    firstOfMonth.setDate((1));
    firstWeekday = firstOfMonth.getDay();
    lastOfMonth = new Date(calendarDate.getFullYear(), calendarDate.getMonth()+1, 0);
    daysInMonth = lastOfMonth.getDate();
    eachDate='';

    // previous month's dates
    var lastOfLastMonth = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), 0);
    let lastDateLM = lastOfLastMonth.getDate()-firstWeekday+2;
    var totalDays = 0;
    for (i=lastDateLM; i<=lastOfLastMonth.getDate(); i++) {
        eachDate += `<button class="last-date-numbers">${i}</div>`;
        totalDays++;
    }

    // current month's dates
    for (i=1; i<=daysInMonth; i++) {
        if (calendarDate.getDate() == i) {
            eachDate += `<button type="button" class="date-numbers" id="selected">${i}</button>`;
        }
        else if ((calendarDate.getFullYear() == currentDate.getFullYear())
            && (calendarDate.getMonth() == currentDate.getMonth())
            && (i==currentDate.getDate())) {
            eachDate += `<button type="button" class="date-numbers" id="today">${i}</button>`;
        }
        else {
            eachDate += `<button type="button" class="date-numbers">${i}</button>`;
        }
        totalDays++;
    }

    // next month's dates
    for (i=1; i<=42-totalDays; i++) {
        eachDate += `<button type="button" class="next-date-numbers">${i}</button>`;
    }

    years = "";
    for (i=2000; i<2100; i++) {
        years += `<option class="year-drop-btn">${i}</option>`;
    }

    document.getElementById("year-drop").innerHTML = years;
    document.getElementById("month-drop").value = months[calendarDate.getMonth()];
    document.getElementById("year-drop").value = calendarDate.getFullYear();
    document.getElementById("dates").innerHTML = eachDate;

    // this is probably inefficient. doesnt seem right
    let date_buttons = $(".date-numbers");
    for (i = 0; i < date_buttons.length; i++) {
        date_buttons[i].addEventListener("click", function(element){ 
            changeDate(element.currentTarget.textContent);
        }, false);
    }

    $("#new-event-date").val(formatDate(calendarDate));
}

function changeDate(date = calendarDate.getDate()) {
    calendarDate.setFullYear(yearDropdown.options[yearDropdown.selectedIndex].text);
    calendarDate.setMonth(monthDropdown.selectedIndex);
    calendarDate.setDate(date);
    loadDates();
}

function lastMonth() {
    calendarDate.setMonth(calendarDate.getMonth()-1);
    loadDates();
}

function nextMonth() {
    calendarDate.setMonth(calendarDate.getMonth()+1);
    loadDates();
}

function loadEvents() {
    // display each event for this date

    socket.emit("load_events", formatDate(calendarDate), (res) => { // in future maybe add "user" param here
        eventList = $("#event-list");
        $("#event-list").empty();
        console.log(calendarDate);
        console.log(res);
        for (i = 0; i < res.length; i++) {
            // make a div and populate it with the info of res[i]
            e = document.createElement("div");
            title = document.createElement("h2");
            creator = document.createElement("h3");
            info = document.createElement("p");
            e.classList.add("event-entry");
            
            // this bit uses js while the parent is a jquery element :-)
            title.textContent = res[i]["title"];
            creator.textContent = "by: " + res[i]["creator"];
            info.textContent = res[i]["info"];
            e.appendChild(title);
            e.appendChild(creator);
            e.appendChild(info);

            eventList.append(e); // append that div (jquery method)
        }
    });
}

function createCalendarEvent() {
    socket.emit("create_event", $("#new-event-title").val(), $("#new-event-info").val(), $("#new-event-date").val());
    loadEvents();
}

loadDates();
loadEvents();
