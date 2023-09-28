const calendarGrid = document.querySelector(".calendar-grid");

const monthSelect = document.querySelector(".month-select");
const yearInput = document.querySelector(".year-input");
const jumpInput = document.querySelector(".jump-input");

const calendarToggleBtn = document.querySelector(".btn-toggle");
const calendarJumpBtn = document.querySelector(".btn-jump");

// State & Listeners
const today = new Date();
let selectedDay = today.getDate();
let selectedMonthIndex = today.getMonth();
let selectedYear = today.getFullYear();
const holidays = {};

calendarJumpBtn.addEventListener("click", jumpBtnHandler);
calendarToggleBtn.addEventListener("click", toggleBtnHandler);

fetchHolidays();
changeDate(selectedDay, selectedMonthIndex + 1, selectedYear);

// Calendar functions
function fillCalendarGrid() {
  calendarGrid.innerHTML = "";

  const firstDayIndex = getFirstDayOfMonth(selectedYear, selectedMonthIndex);
  const daysInMonth = getDaysInMonth(selectedYear, selectedMonthIndex);

  let day = 1;
  for (let i = 0; i < 42; i++) {
    const calendarDay = document.createElement("span");
    calendarDay.classList.add("calendar-day", i);

    if (i < firstDayIndex || day > daysInMonth) {
      calendarDay.classList.add("empty");
    } else {
      calendarDay.classList.add(i);
      calendarDay.textContent = day;

      // Check if sunday
      if ([6, 13, 20, 27, 34, 41].includes(i)) {
        calendarDay.classList.add("red");
      }

      // Check if vacation
      if (false) {
        calendarDay.classList.add("border");
      }

      day++;
    }

    calendarGrid.appendChild(calendarDay);
  }
}

function jumpBtnHandler() {
  const value = jumpInput.value;

  const dateFormatRegex =
    /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(000[1-9]|00[1-9]\d|0[1-9]\d{2}|[1-9]\d{3}|[1-9]\d{4})$/;

  if (dateFormatRegex.test(value)) {
    const valueArr = value.split("/");
    const day = parseInt(valueArr[0]);
    const month = parseInt(valueArr[1]);
    const year = parseInt(valueArr[2]);

    if (isValidDate(day, month, year)) {
      changeDate(day, month, year);
    } else {
      alert("Invalid date format");
    }
  } else {
    alert("Invalid date format");
  }
}

function toggleBtnHandler() {
  const day = 1;
  const month = parseInt(monthSelect.value) + 1;
  const year = parseInt(yearInput.value);

  changeDate(day, month, year);
}

function changeDate(day, month, year) {
  selectedDay = day;
  selectedMonthIndex = month - 1;
  selectedYear = year;

  const jumpInputValue = new Date(year, month - 1, day).toLocaleDateString(
    "en-GB",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }
  );

  jumpInput.value = jumpInputValue;
  monthSelect.value = month - 1;
  yearInput.value = year;

  fillCalendarGrid();
}

// Fetch holidays
async function fetchHolidays() {
  try {
    const response = await fetch("holidays.txt");
    const lines = await response.text();

    lines.split(/\r\n|\n/).forEach((line) => {
      const lineArr = line.split(";");
      const date = lineArr[0];
      const repeat = lineArr[1] === "true";

      holidays[date] = { repeat: repeat };
    });

    fillCalendarGrid();
  } catch (error) {
    console.error(error);
  }
}

// Helpers
function isValidDate(day, month, year) {
  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

function getFirstDayOfMonth(year, monthIndex) {
  const firstDayOfMonth = new Date(year, monthIndex, 1);
  let firstDayOfWeek = firstDayOfMonth.getDay();
  firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

  return firstDayOfWeek;
}

function getDaysInMonth(year, monthIndex) {
  return new Date(year, monthIndex + 1, 0).getDate();
}
