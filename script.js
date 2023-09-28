const calendarGrid = document.querySelector(".calendar-grid");
const errorMsg = document.querySelector(".error-msg");

const monthSelect = document.querySelector(".month-select");
const yearInput = document.querySelector(".year-input");
const jumpInput = document.querySelector(".jump-input");

const calendarShowBtn = document.querySelector(".btn-show");
const calendarJumpBtn = document.querySelector(".btn-jump");

// Constants
const GRID_SIZE = 42;
const ERROR_TIMEOUT = 3000;
const SUNDAY_INDEXES = [6, 13, 20, 27, 34, 41];

// Initial state and event listeners
const today = new Date();
const selectedDate = {
  day: today.getDate(),
  month: today.getMonth() + 1,
  year: today.getFullYear(),
};

calendarJumpBtn.addEventListener("click", jumpBtnHandler);
calendarShowBtn.addEventListener("click", toggleBtnHandler);
jumpInput.addEventListener("input", jumpInputHandler);

const holidays = {};
fetchHolidays();

changeDate(selectedDate.day, selectedDate.month, selectedDate.year);

// Calendar functions
function fillCalendarGrid() {
  calendarGrid.innerHTML = "";

  const firstDayIndex = getFirstDayOfMonth(
    selectedDate.year,
    selectedDate.month
  );
  const daysInMonth = getDaysInMonth(selectedDate.year, selectedDate.month);

  let day = 1;
  for (let i = 0; i < GRID_SIZE; i++) {
    const calendarDay = document.createElement("span");
    calendarDay.classList.add("calendar-day");

    if (i < firstDayIndex || day > daysInMonth) {
      calendarDay.classList.add("empty");
    } else {
      calendarDay.textContent = day;

      // Check if Sunday
      if (SUNDAY_INDEXES.includes(i)) {
        calendarDay.classList.add("grey");
      }

      // Check if holiday
      if (Object.keys(holidays).length) {
        const dateObj = new Date(
          Date.UTC(selectedDate.year, selectedDate.month - 1, day)
        );
        dateObj.setUTCFullYear(selectedDate.year);
        const date = dateObj.toISOString().slice(0, 10);

        if (
          Object.keys(holidays).some(
            (el) =>
              el === date ||
              (el.endsWith(date.slice(-5)) && holidays[el].repeat)
          )
        ) {
          calendarDay.classList.add("border");
        }
      }

      day++;
    }

    calendarGrid.appendChild(calendarDay);
  }
}

function changeDate(day, month, year) {
  selectedDate.day = day;
  selectedDate.month = month;
  selectedDate.year = year;

  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCFullYear(year);

  if (isValidDate(date)) {
    const jumpInputValue = date.toISOString().slice(0, 10);

    jumpInput.value = jumpInputValue;
    monthSelect.value = month - 1;
    yearInput.value = year;

    fillCalendarGrid();
  } else {
    showErrorMsg();
  }
}

// Handlers
function jumpBtnHandler() {
  const date = new Date(jumpInput.value);

  if (isValidDate(date)) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    changeDate(day, month, year);
  } else {
    showErrorMsg();
  }
}

function toggleBtnHandler() {
  const day = 1;
  const month = parseInt(monthSelect.value) + 1;
  const year = parseInt(yearInput.value);

  changeDate(day, month, year);
}

function jumpInputHandler(e) {
  let value = e.target.value;
  value = value.replace(/[^\d-]/g, "");

  if (value.length >= 5 && value.charAt(4) !== "-") {
    value = value.slice(0, 4) + "-" + value.slice(4);
  }

  if (value.length >= 8 && value.charAt(7) !== "-") {
    value = value.slice(0, 7) + "-" + value.slice(7);
  }

  jumpInput.value = value;
}

// Fetch holidays and update grid
async function fetchHolidays() {
  try {
    const response = await fetch("assets/holidays.txt");
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

// Helper functions
function getFirstDayOfMonth(year, month) {
  const firstDayOfMonth = new Date(year, month - 1, 1);
  let firstDayOfWeek = firstDayOfMonth.getDay();
  firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

  return firstDayOfWeek;
}

function getDaysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

function isValidDate(date) {
  return date instanceof Date && !isNaN(date.valueOf());
}

function showErrorMsg() {
  errorMsg.style.display = "block";
  setTimeout(() => {
    errorMsg.style.display = "none";
  }, ERROR_TIMEOUT);
}
