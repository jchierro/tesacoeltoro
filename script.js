document.addEventListener("DOMContentLoaded", () => {
  const quizForm = document.querySelector("#quiz-form");
  const secretDate = document.querySelector(".secret-date");
  const feedbackBlocks = document.querySelectorAll(".feedback");

  const correctAnswers = {
    q1: "b",
    q2: "c",
    q3: "a",
    q4: "c",
    q5: "b",
  };

  if (quizForm && secretDate && feedbackBlocks.length) {
    quizForm.addEventListener("submit", (event) => {
      event.preventDefault();

      let score = 0;

      Object.entries(correctAnswers).forEach(([name, correctValue], index) => {
        const userAnswer = quizForm.elements[name].value;
        const feedback = feedbackBlocks[index];

        if (!feedback) {
          return;
        }

        if (!userAnswer) {
          feedback.textContent = "Ponle arte, que hay que elegir una respuesta.";
          feedback.classList.remove("correct", "incorrect");
          return;
        }

        if (userAnswer === correctValue) {
          score += 1;
          feedback.textContent = "Ole tú, respuesta de oreja y rabo.";
          feedback.classList.add("correct");
          feedback.classList.remove("incorrect");
        } else {
          feedback.textContent = "Ay, ay, ay... ese toro se te ha escapado.";
          feedback.classList.add("incorrect");
          feedback.classList.remove("correct");
        }
      });

      if (score === Object.keys(correctAnswers).length) {
        secretDate.style.display = "block";
        secretDate.setAttribute(
          "aria-live",
          secretDate.getAttribute("aria-live") || "polite"
        );
        secretDate.textContent =
          "¡Enhorabuena torero! La despedida de Rome es el 1 de noviembre. Ve puliendo el traje de luces.";
      } else {
        secretDate.style.display = "none";
      }
    });
  }

  const yearSpan = document.getElementById("current-year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  const diwoMessages = [
    "yamilet no te vayas",
    "caida de roma",
    "dameApi",
    "15 instalaciones de Emooc",
    "buen curro",
    "nowena",
  ];

  const diwoMessageElement = document.getElementById("diwo-message");

  if (diwoMessageElement) {
    let diwoIndex = 0;

    const rotateMessage = () => {
      diwoMessageElement.textContent = diwoMessages[diwoIndex];
      diwoIndex = (diwoIndex + 1) % diwoMessages.length;
    };

    rotateMessage();
    setInterval(rotateMessage, 5000);
  }
});
