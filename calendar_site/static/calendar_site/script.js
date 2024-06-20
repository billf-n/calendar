currentDate = new Date();
calendarDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const options = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric"
};
const monthDropdown = document.querySelector("#month-drop");
const yearDropdown = document.querySelector("#year-drop");

function loadDates() {

    // document.getElementById("month").innerHTML = months[calendarDate.getMonth()];
    // document.getElementById("year").innerHTML = calendarDate.getFullYear();
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
        eachDate += `<button class="last-date-numbers" onclick="changeDate(${i})">${i}</div>`;
        totalDays++;
    }

    // current month's dates
    for (i=1; i<=daysInMonth; i++) {
        if (calendarDate.getDate() == i) {
            if (1) {
            eachDate += `<button type="button" class="date-numbers" id="selected" onclick="changeDate(${i})">${i}</button>`;
            }
        }
        else if ((calendarDate.getFullYear() == currentDate.getFullYear())
            && (calendarDate.getMonth() == currentDate.getMonth())
            && (i==currentDate.getDate())) {
            eachDate += `<button type="button" class="date-numbers" id="today" onclick="changeDate(${i})">${i}</button>`;
        }
        else {
            eachDate += `<button type="button" class="date-numbers" onclick="changeDate(${i})">${i}</button>`;
        }
        totalDays++;
    }

    // next month's dates
    for (i=1; i<=42-totalDays; i++) {
        eachDate += `<button type="button" onclick="changeDate(${i})" class="next-date-numbers">${i}</button>`;
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


function changeDate(date = calendarDate.getDate()) {
    console.log(date)
    calendarDate = new Date(parseInt(yearDropdown.options[yearDropdown.selectedIndex].text), 
    monthDropdown.selectedIndex, date);
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
