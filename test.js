document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const testId = urlParams.get('testId');
    const questionsContainer = document.getElementById('questions-container');
    const prevButton = document.getElementById('prev-question');
    const nextButton = document.getElementById('next-question');
    const finishButton = document.getElementById('finish-button');
    const backButton = document.getElementById('back-to-test-list-page');
    const testListSidebar = document.getElementById('test-list-sidebar');
  
    let currentQuestionIndex = 0;
    let userAnswers = JSON.parse(localStorage.getItem(`test-${testId}-answers`)) || [];
  
    // Загрузка тестов
    const loadTests = () => {
      const savedTests = JSON.parse(localStorage.getItem('tests')) || [];
      return fetch('data.json')
        .then(response => response.json())
        .then(data => {
          return [...data.tests, ...savedTests];
        });
    };
  
    // Отображение списка тестов в боковой панели
    const renderTestList = () => {
      loadTests().then(tests => {
        testListSidebar.innerHTML = '';
        tests.forEach(test => {
          const button = document.createElement('button');
          button.textContent = test.title;
          button.addEventListener('click', () => {
            window.location.href = `test.html?testId=${test.id}`;
          });
          testListSidebar.appendChild(button);
        });
      });
    };
  
    // Отображение вопроса
    const renderQuestion = (index) => {
      loadTests().then(tests => {
        const test = tests.find(t => t.id === testId);
        if (!test) return;
  
        const question = test.questions[index];
        questionsContainer.innerHTML = `
          <div test-id="question">${question.text}</div>
          <div test-id="question-options">
            ${question.options.map((option, i) => `
              <label>
                <input type="radio" name="question-${index}" value="${i}" ${userAnswers[index] === i ? 'checked' : ''}>
                ${option}
              </label>
            `).join('')}
          </div>
        `;
  
        // Навигация
        prevButton.disabled = index === 0;
        nextButton.disabled = index === test.questions.length - 1;
      });
    };
  
    // Инициализация
    renderTestList();
    renderQuestion(currentQuestionIndex);
  });