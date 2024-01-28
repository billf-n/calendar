currentDate = new Date();
calendarDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());

function loadDates() {
    const options = {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric"
    };
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    // document.getElementById("month").innerHTML = months[calendarDate.getMonth()];
    // document.getElementById("year").innerHTML = calendarDate.getFullYear();
    document.getElementById("date-display").innerHTML = currentDate.toLocaleDateString("en-AU", options);
    firstOfMonth = calendarDate;
    firstOfMonth.setDate((1));
    firstWeekday = firstOfMonth.getDay();
    lastOfMonth = new Date(calendarDate.getFullYear(), calendarDate.getMonth()+1, 0);
    daysInMonth = lastOfMonth.getDate();
    eachDate='<div class="weekdays">Mon</div>\
    <div class="weekdays">Tue</div>\
    <div class="weekdays">Wed</div>\
    <div class="weekdays">Thu</div>\
    <div class="weekdays">Fri</div>\
    <div class="weekdays">Sat</div>\
    <div class="weekdays">Sun</div>';

    // previous month's dates
    var lastOfLastMonth = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), 0);
    let lastDateLM = lastOfLastMonth.getDate()-firstWeekday+2;
    var totalDays = 0;
    for (i=lastDateLM; i<=lastOfLastMonth.getDate(); i++) {
        eachDate += `<div class="last-date-numbers" onclick=""><p class="last-month-dates prevent-select">${i}</p></div>`;
        totalDays++;
    }

    // current month's dates
    for (i=1; i<=daysInMonth; i++) {
        console.log(calendarDate, currentDate, i);
        if (calendarDate.getFullYear() == currentDate.getFullYear() 
            && calendarDate.getMonth() == currentDate.getMonth() 
            && i==currentDate.getDate()) {
            eachDate += `<div class="date-numbers" id="today"><p class="current-month-dates prevent-select" id="today">${i}</p></div>`;
        }
        else {
            eachDate += `<div class="date-numbers"><p class="current-month-dates prevent-select">${i}</p></div>`;
        }
        totalDays++;
    }

    // next month's dates
    for (i=1; i<=42-totalDays; i++) {
        eachDate += `<div class="next-date-numbers"><p class="next-month-dates prevent-select">${i}</p></div>`;
    }

    years = "";
    for (i=2000; i<2100; i++) {
        years += `<option class="year-drop-btn">${i}</option>`;
    }

    document.getElementById("year-drop").innerHTML = years;
    document.getElementById("month-drop").value = months[calendarDate.getMonth()];
    document.getElementById("year-drop").value = calendarDate.getFullYear();
    document.getElementById("dates").innerHTML = eachDate;
    document.getElementById("test").innerHTML = "";

}

loadDates();

const monthButtons = document.querySelector(".month-drop-btn");
const monthDropdown = document.querySelector("#month-drop");

monthButtons.onclick = (event) => {
    event.preventDefault();
    console.log(monthDropdown.selectedIndex);
    calendarDate = new Date(calendarDate.getFullYear(), monthDropdown.selectedIndex, calendarDate.getDate());
    loadDates();
}

function lastMonth() {
    calendarDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), 0);
    loadDates();
}
function nextMonth() {
    calendarDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth()+2, 0);
    loadDates();
}
