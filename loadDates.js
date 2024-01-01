let currentDate = new Date();
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
let firstOfMonth = currentDate;
firstOfMonth.setDate((1));
let firstWeekday = firstOfMonth.getDay();
let lastOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth()+1, 0);
let daysInMonth = lastOfMonth.getDate();
let eachDate="";

// previous month's dates
let lastMonthDate = 6-firstWeekday;
let lastOfLastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);

for (let i=lastMonthDate; i<=lastOfLastMonth.getDate(); i--) {
    eachDate += `<div class="date-numbers"><p class="last-month-dates">${i}</p></div>`;
}

// current month's dates
for (let i=1; i<=daysInMonth; i++) {
    eachDate += `<div class="date-numbers"><p class="current-month-dates">${i}</p></div>`;
}
document.getElementById("dates").innerHTML = eachDate;
document.getElementById("test").innerHTML = "";
