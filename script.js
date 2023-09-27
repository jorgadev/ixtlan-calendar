const calendarContainer = document.querySelector(".calendar-container");
const calendarGrid = document.querySelector(".calendar-grid");
const calendarMonth = document.querySelector(".calendar-month");
const calendarYear = document.querySelector(".calendar-year");

const calendarJumpBtn = document.querySelector(".btn-jump");
const calendarToggleBtn = document.querySelector(".btn-toggle");
const calendarPrevBtn = document.querySelector(".btn-prev");
const calendarNextBtn = document.querySelector(".btn-next");

// STATE
let selectedDate = new Date();
let selectedYear = selectedDate.getFullYear();
let selectedMonthIndex = selectedDate.getMonth();
let calendarShown = false;

// INITIAL SETUP & LISTENERS
calendarToggleBtn.addEventListener("click", () => {
  calendarShown = !calendarShown;
  setCalendar();
});

calendarPrevBtn.addEventListener("click", () => {
  selectedMonthIndex = selectedMonthIndex === 0 ? 11 : selectedMonthIndex - 1;
  selectedYear = selectedMonthIndex === 0 ? selectedYear - 1 : selectedYear;
  setCalendar();
});

calendarNextBtn.addEventListener("click", () => {
  selectedMonthIndex = selectedMonthIndex === 11 ? 0 : selectedMonthIndex + 1;
  selectedYear = selectedMonthIndex === 0 ? selectedYear + 1 : selectedYear;
  setCalendar();
});

setCalendar();

// FUNCTIONS
function setCalendar() {
  calendarMonth.textContent = MONTHS[selectedMonthIndex];
  calendarYear.textContent = selectedYear;
  calendarToggleBtn.textContent = calendarShown ? "Close" : "Open";
  calendarContainer.style.display = calendarShown ? "block" : "none";

  if (calendarShown) {
    fillCalendarGrid();
  }
}

function selectDate(e) {
  const el = e.target;
  const activeBefore = document.querySelector(".active");

  if (activeBefore) {
    activeBefore.classList.remove("active");
  }

  el.classList.add("active");
}

function getFirstDayIndex(year, month) {
  return new Date(year, month, 0).getDay();
}

function getDaysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

// 1: FILL THE CALENDAR GRID
function fillCalendarGrid() {
  calendarGrid.innerHTML = "";

  const firstDayIndex = getFirstDayIndex(selectedYear, selectedMonthIndex);
  const daysInMonth = getDaysInMonth(selectedYear, selectedMonthIndex + 1);

  let day = 1;
  for (let i = 0; i < 42; i++) {
    const calendarDay = document.createElement("span");
    calendarDay.classList.add("calendar-day", i);

    if (i < firstDayIndex || day > daysInMonth) {
      calendarDay.classList.add("empty");
    } else {
      calendarDay.classList.add(i);
      calendarDay.textContent = day;
      calendarDay.addEventListener("click", selectDate);

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
