const quizApp = document.querySelector("#quiz-app");
const yearSpan = document.getElementById("current-year");
const navToggle = document.querySelector(".nav-toggle");
const primaryNav = document.getElementById("primary-nav");
const contactForm = document.querySelector("#contacto form");

document.addEventListener("contextmenu", (event) => {
  event.preventDefault();
  alert("chumbazo");
});

if (contactForm) {
  contactForm.addEventListener("click", (event) => {
    if (event.target.matches("input, textarea, button")) {
      alert("dameFormulario");
    }
  });

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    alert("dameFormulario");
  });
}

if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

if (navToggle && primaryNav) {
  const closeMenu = () => {
    navToggle.setAttribute("aria-expanded", "false");
    primaryNav.classList.remove("primary-nav--open");
    document.body.classList.remove("no-scroll");
  };

  const openMenu = () => {
    navToggle.setAttribute("aria-expanded", "true");
    primaryNav.classList.add("primary-nav--open");
    document.body.classList.add("no-scroll");
  };

  navToggle.addEventListener("click", () => {
    const isExpanded = navToggle.getAttribute("aria-expanded") === "true";
    if (isExpanded) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  primaryNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      if (navToggle.getAttribute("aria-expanded") === "true") {
        closeMenu();
      }
    });
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navToggle.getAttribute("aria-expanded") === "true") {
      closeMenu();
      navToggle.focus();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) {
      navToggle.setAttribute("aria-expanded", "false");
      primaryNav.classList.remove("primary-nav--open");
      document.body.classList.remove("no-scroll");
    }
  });
}

const diwoMessagesList = document.getElementById("diwo-messages");
const diwoChatBody = document.querySelector("#diwo-chatbot .diwo-chatbot__body");
const diwoChatForm = document.getElementById("diwo-chat-form");
const diwoChatInput = document.getElementById("diwo-chat-input");

const appendDiwoMessage = (text, author = "bot") => {
  if (!diwoMessagesList) {
    return;
  }

  const messageItem = document.createElement("li");
  messageItem.classList.add("diwo-chatbot__message");
  messageItem.classList.add(
    author === "user" ? "diwo-chatbot__message--user" : "diwo-chatbot__message--bot"
  );

  const messageText = document.createElement("span");
  messageText.textContent = text;

  messageItem.appendChild(messageText);
  diwoMessagesList.appendChild(messageItem);

  const scrollTarget = diwoChatBody ?? diwoMessagesList;
  scrollTarget.scrollTop = scrollTarget.scrollHeight;
};

if (diwoMessagesList) {
  const diwoMessages = [
    "yamilet no te vayas",
    "caida de roma",
    "dameApi",
    "15 instalaciones de Emooc",
    "buen curro",
    "nowena",
  ];

  let currentMessageIndex = 0;

  const renderDiwoMessage = () => {
    appendDiwoMessage(diwoMessages[currentMessageIndex]);
    currentMessageIndex = (currentMessageIndex + 1) % diwoMessages.length;
  };

  renderDiwoMessage();
  setInterval(renderDiwoMessage, 5000);
}

if (diwoChatForm && diwoChatInput) {
  diwoChatForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const userMessage = diwoChatInput.value.trim();
    if (!userMessage) {
      return;
    }

    appendDiwoMessage(userMessage, "user");
    diwoChatInput.value = "";
    diwoChatInput.focus();

    setTimeout(() => {
      appendDiwoMessage("no se puede orinar en el AVE");
    }, 500);
  });
}

if (quizApp) {
  const questions = [
    {
      question:
        "¿Cómo se llama el capote de lujo que en la tradición taurina se reserva para la faena de muleta final?",
      options: [
        { value: "a", label: "El capote de paseo, bordado con oro y seda" },
        { value: "b", label: "El capote campero, perfecto para los tentaderos" },
        { value: "c", label: "El capote de tienta, heredado de los picadores" },
      ],
      answer: "a",
      hint: "Piensa en el capote que luce el torero al hacer el paseíllo antes de torear.",
    },
    {
      question:
        "Cuando el toro repite con bravura cada embestida, ¿qué grita el público en señal de entrega?",
      options: [
        { value: "a", label: "¡Venga ese quite!" },
        { value: "b", label: "¡Oleeee!" },
        { value: "c", label: "¡A la barrera!" },
      ],
      answer: "b",
      hint: "Es el mismo grito que anima a un buen pase cuando el capote acaricia los pitones.",
    },
    {
      question:
        "¿Cómo se llama la suerte en la que el torero cita al toro rodilla en tierra para templar su embestida?",
      options: [
        { value: "a", label: "La chicuelina" },
        { value: "b", label: "La verónica de rodillas" },
        { value: "c", label: "El pase del desprecio" },
      ],
      answer: "b",
      hint: "Se trata de una variante de la verónica, pero con un guiño de valor extra desde el suelo.",
    },
    {
      question:
        "En una corrida tradicional, ¿quién se encarga de poner banderillas al toro antes de la faena final?",
      options: [
        { value: "a", label: "Los banderilleros de la cuadrilla" },
        { value: "b", label: "El presidente de la plaza" },
        { value: "c", label: "El propio picador" },
      ],
      answer: "a",
      hint: "Son los mismos que acompañan al matador con sus capotes de brega durante toda la lidia.",
    },
    {
      question:
        "Si se conceden dos orejas y rabo, ¿qué significa para el torero?",
      options: [
        { value: "a", label: "Que podrá elegir el toro de la próxima corrida" },
        { value: "b", label: "Que ha logrado un triunfo máximo y saldrá en hombros" },
        { value: "c", label: "Que debe repetir la faena con otro toro" },
      ],
      answer: "b",
      hint: "Es el premio que abre la Puerta Grande y convierte la tarde en una fiesta mayor.",
    },
  ];

  const questionNumber = document.getElementById("question-number");
  const totalQuestions = document.getElementById("total-questions");
  const questionText = document.getElementById("question-text");
  const quizForm = document.getElementById("quiz-form");
  const optionsContainer = document.getElementById("options-container");
  const feedback = document.getElementById("feedback");
  const hintButton = document.getElementById("hint-button");
  const hintText = document.getElementById("hint-text");
  const nextButton = document.getElementById("next-button");
  const errorLog = document.getElementById("error-log");
  const secretDate = document.getElementById("secret-date");

  const totalQuestionCount = questions.length;
  totalQuestions.textContent = totalQuestionCount;

  let currentQuestionIndex = 0;
  const errorDetails = [];
  let hintVisible = false;

  const clearFeedback = () => {
    feedback.textContent = "";
    feedback.classList.remove("correct", "incorrect");
  };

  const resetHint = () => {
    hintButton.hidden = true;
    hintButton.disabled = false;
    hintButton.textContent = "Necesito una pista";
    hintText.hidden = true;
    hintText.textContent = "";
    hintVisible = false;
  };

  const updateErrorLog = () => {
    errorLog.innerHTML = "";

    if (!errorDetails.length) {
      const cleanRun = document.createElement("p");
      cleanRun.textContent = "Sin cornadas hasta ahora. Mantén el temple.";
      errorLog.appendChild(cleanRun);
      return;
    }

    const intro = document.createElement("p");
    intro.textContent = `Banderillas fallidas: ${errorDetails.length}`;
    errorLog.appendChild(intro);

    const list = document.createElement("ul");
    errorDetails.forEach(({ question, answer }) => {
      const item = document.createElement("li");
      item.textContent = `${question}: marcaste "${answer}"`;
      list.appendChild(item);
    });
    errorLog.appendChild(list);
  };

  const renderQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex];

    questionNumber.textContent = currentQuestionIndex + 1;
    questionText.textContent = currentQuestion.question;

    optionsContainer.innerHTML = "";
    currentQuestion.options.forEach((option, index) => {
      const optionId = `question-${currentQuestionIndex}-option-${index}`;
      const label = document.createElement("label");
      label.classList.add("quiz-option");

      const input = document.createElement("input");
      input.type = "radio";
      input.name = "quiz-option";
      input.value = option.value;
      input.id = optionId;

      input.addEventListener("change", () => {
        nextButton.disabled = false;
        clearFeedback();
      });

      const optionTextNode = document.createElement("span");
      optionTextNode.textContent = option.label;

      label.setAttribute("for", optionId);
      label.appendChild(input);
      label.appendChild(optionTextNode);

      optionsContainer.appendChild(label);
    });

    nextButton.disabled = true;
    nextButton.textContent =
      currentQuestionIndex === totalQuestionCount - 1
        ? "Comprobar y celebrar"
        : "Comprobar pase";

    clearFeedback();
    resetHint();
  };

  const finishQuiz = () => {
    quizForm.classList.add("quiz-completed");
    quizForm.setAttribute("aria-hidden", "true");
    quizForm.querySelectorAll("input").forEach((input) => {
      input.disabled = true;
    });
    nextButton.disabled = true;
    hintButton.disabled = true;

    secretDate.hidden = false;
    secretDate.classList.add("secret-date--visible");
    document.body.classList.add("celebration-mode");
    secretDate.setAttribute("tabindex", "-1");
    secretDate.innerHTML = `
      <div class="secret-date__content">
        <div aria-hidden="true" class="confetti">🎉🎺✨</div>
        <p class="secret-date__headline">¡Triunfo rotundo!</p>
        <p class="secret-date__details">
          La despedida de Rome se celebra el <strong>1 de noviembre</strong>.
        </p>
        <p class="secret-date__details">Tendras preparado un traje de luces.</p>
        <div aria-hidden="true" class="confetti confetti--reverse">✨🎺🎉</div>
      </div>
    `;
    secretDate.focus();
  };

  const handleNext = () => {
    const selectedOption = optionsContainer.querySelector(
      'input[name="quiz-option"]:checked'
    );

    if (!selectedOption) {
      feedback.textContent = "Antes de avanzar, elige tu pase maestro.";
      feedback.classList.add("incorrect");
      return;
    }

    const currentQuestion = questions[currentQuestionIndex];
    const selectedLabel = selectedOption.parentElement.querySelector("span");
    const selectedText = selectedLabel ? selectedLabel.textContent : "";

    if (selectedOption.value !== currentQuestion.answer) {
      feedback.textContent = "Ay, ay... ese toro te ha dado un revolcón. Prueba otro pase.";
      feedback.classList.add("incorrect");
      nextButton.disabled = true;
      selectedOption.checked = false;

      errorDetails.push({
        question: `Pregunta ${currentQuestionIndex + 1}`,
        answer: selectedText,
      });
      updateErrorLog();

      if (!hintVisible) {
        hintButton.hidden = false;
      }

      return;
    }

    feedback.textContent = "¡Ole! Pase de oreja y rabo.";
    feedback.classList.remove("incorrect");
    feedback.classList.add("correct");

    if (currentQuestionIndex === totalQuestionCount - 1) {
      finishQuiz();
      return;
    }

    currentQuestionIndex += 1;
    setTimeout(() => {
      renderQuestion();
    }, 800);
  };

  const showHint = () => {
    const currentQuestion = questions[currentQuestionIndex];
    hintVisible = true;
    hintText.textContent = currentQuestion.hint;
    hintText.hidden = false;
    hintButton.disabled = true;
    hintButton.textContent = "Pista revelada";
  };

  hintButton.addEventListener("click", showHint);
  nextButton.addEventListener("click", handleNext);

  renderQuestion();
  updateErrorLog();
}
