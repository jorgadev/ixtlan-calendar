const calendarGrid = document.querySelector(".calendar-grid");

const monthSelect = document.querySelector(".month-select");
const yearInput = document.querySelector(".year-input");
const jumpInput = document.querySelector(".jump-input");

const calendarToggleBtn = document.querySelector(".btn-toggle");
const calendarJumpBtn = document.querySelector(".btn-jump");

// INITIAL STATE & LISTENERS
const today = new Date();
const selectedDate = {
  day: today.getDate(),
  month: today.getMonth() + 1,
  year: today.getFullYear(),
};

calendarJumpBtn.addEventListener("click", jumpBtnHandler);
calendarToggleBtn.addEventListener("click", toggleBtnHandler);

const holidays = {};
fetchHolidays();

changeDate(selectedDate.day, selectedDate.month, selectedDate.year);

// CALENDAR FUNCTIONS
function fillCalendarGrid() {
  calendarGrid.innerHTML = "";

  const firstDayIndex = getFirstDayOfMonth(
    selectedDate.year,
    selectedDate.month
  );
  const daysInMonth = getDaysInMonth(selectedDate.year, selectedDate.month);

  let day = 1;
  for (let i = 0; i < 42; i++) {
    const calendarDay = document.createElement("span");
    calendarDay.classList.add("calendar-day");

    if (i < firstDayIndex || day > daysInMonth) {
      calendarDay.classList.add("empty");
    } else {
      calendarDay.textContent = day;

      // Check if sunday
      if ([6, 13, 20, 27, 34, 41].includes(i)) {
        calendarDay.classList.add("red");
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
  const jumpInputValue = date.toISOString().slice(0, 10);

  jumpInput.value = jumpInputValue;
  monthSelect.value = month - 1;
  yearInput.value = year;

  fillCalendarGrid();
}

function getFirstDayOfMonth(year, month) {
  const firstDayOfMonth = new Date(year, month - 1, 1);
  let firstDayOfWeek = firstDayOfMonth.getDay();
  firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

  return firstDayOfWeek;
}

function getDaysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

// HANDLERS
function jumpBtnHandler() {
  const date = new Date(jumpInput.value);

  // Validate entered date
  if (date instanceof Date && !isNaN(date.valueOf())) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    changeDate(day, month, year);
  } else {
    alert("Invalid Date");
  }
}

function toggleBtnHandler() {
  const day = 1;
  const month = parseInt(monthSelect.value) + 1;
  const year = parseInt(yearInput.value);

  changeDate(day, month, year);
}

// FETCH
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
