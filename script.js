const form = document.querySelector("#marks-form");
const result = document.querySelector("#result");
const errorMessage = document.querySelector("#error-message");
const printButton = document.querySelector("#print-button");

const subjects = [
  { id: "maths", name: "Mathematics" },
  { id: "physics", name: "Physics" },
  { id: "chemistry", name: "Chemistry" },
  { id: "programming", name: "Programming" },
  { id: "english", name: "English" }
];

function getGrade(percentage) {
  if (percentage >= 90) return "A+";
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B";
  if (percentage >= 60) return "C";
  if (percentage >= 50) return "D";
  return "F";
}

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.hidden = false;
  result.hidden = true;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  errorMessage.hidden = true;

  const name = document.querySelector("#student-name").value.trim();
  if (!name) {
    showError("Please enter the student's name.");
    return;
  }

  const marks = [];
  for (const subject of subjects) {
    const input = document.getElementById(subject.id);
    const rawValue = input.value.trim();
    const mark = Number(rawValue);

    if (rawValue === "" || !Number.isFinite(mark) || mark < 0 || mark > 100) {
      showError(`Please enter a valid mark from 0 to 100 for ${subject.name}.`);
      input.focus();
      return;
    }
    marks.push({ ...subject, mark });
  }

  const total = marks.reduce((sum, subject) => sum + subject.mark, 0);
  const percentage = total / marks.length;
  const grade = getGrade(percentage);
  const passed = marks.every((subject) => subject.mark >= 35);

  document.querySelector("#result-name").textContent = name;
  document.querySelector("#percentage").textContent = `${percentage.toFixed(2)}%`;
  document.querySelector("#total").textContent = `${Number(total.toFixed(2))} / 500`;
  document.querySelector("#grade").textContent = grade;

  const status = document.querySelector("#result-status");
  status.textContent = passed ? "PASS" : "FAIL";
  status.classList.toggle("fail", !passed);

  const breakdown = document.querySelector("#breakdown");
  breakdown.replaceChildren();
  marks.forEach((subject) => {
    const row = document.createElement("div");
    row.className = "breakdown-row";

    const label = document.createElement("span");
    label.textContent = subject.name;

    const bar = document.createElement("div");
    bar.className = "bar";
    bar.setAttribute("role", "progressbar");
    bar.setAttribute("aria-label", `${subject.name} marks`);
    bar.setAttribute("aria-valuemin", "0");
    bar.setAttribute("aria-valuemax", "100");
    bar.setAttribute("aria-valuenow", String(subject.mark));

    const fill = document.createElement("div");
    fill.className = "bar-fill";
    fill.style.width = `${subject.mark}%`;
    bar.append(fill);

    const value = document.createElement("span");
    value.className = "mark-value";
    value.textContent = String(subject.mark);

    row.append(label, bar, value);
    breakdown.append(row);
  });

  result.hidden = false;
  result.scrollIntoView({ behavior: "smooth", block: "start" });
});

form.addEventListener("reset", () => {
  errorMessage.hidden = true;
  result.hidden = true;
});

printButton.addEventListener("click", () => window.print());
