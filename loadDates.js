currentDate = new Date("2024-2-2");
const options = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric"
};
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
document.getElementById("month").innerHTML = months[currentDate.getMonth()];
document.getElementById("year").innerHTML = currentDate.getFullYear();
document.getElementById("todayDate").innerHTML = currentDate.toLocaleDateString("en-AU", options);
firstOfMonth = currentDate;
firstOfMonth.setDate((1));
firstWeekday = firstOfMonth.getDay();
lastOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth()+1, 0);
daysInMonth = lastOfMonth.getDate();
eachDate="";

// previous month's dates
let lastMonthDate = 6-firstWeekday;
var lastOfLastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
let lastDateLM = lastOfLastMonth.getDate()-firstWeekday+2;
console.log(lastMonthDate, lastDateLM);
for (i=lastDateLM; i<=lastOfLastMonth.getDate(); i++) {
    eachDate += `<div class="date-numbers"><p class="last-month-dates">${i}</p></div>`;
}

// current month's dates
for (i=1; i<=daysInMonth; i++) {
    eachDate += `<div class="date-numbers"><p class="current-month-dates">${i}</p></div>`;
}
document.getElementById("dates").innerHTML = eachDate;
document.getElementById("test").innerHTML = "";
