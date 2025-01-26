document.addEventListener('DOMContentLoaded', () => {
    const testList = document.getElementById('test-list');
    const addTestButton = document.getElementById('add-test-button');
    const formModal = document.getElementById('form-modal');
    const addQuestionButton = document.getElementById('add-question-button');
    const removeQuestionButton = document.getElementById('remove-question-button');
    const saveButton = document.getElementById('save-button');
    const questionsForm = document.getElementById('questions-form');
  
    // Загрузка тестов из localStorage или data.json
    const loadTests = () => {
      const savedTests = JSON.parse(localStorage.getItem('tests')) || [];
      if (savedTests.length > 0) {
        return savedTests;
      } else {
        return fetch('data.json')
          .then(response => response.json())
          .then(data => data.tests);
      }
    };
  
    // Отображение тестов
    const renderTests = (tests) => {
      testList.innerHTML = '';
      tests.forEach((test, index) => {
        const testItem = document.createElement('div');
        testItem.innerHTML = `
          <div test-id="list-item-title">${test.title}</div>
          <button test-id="list-item-delete" ${index < 2 ? 'disabled' : ''}>🗑️</button>
        `;
        testItem.querySelector('button').addEventListener('click', () => {
          tests.splice(index, 1);
          localStorage.setItem('tests', JSON.stringify(tests));
          renderTests(tests);
        });
        testList.appendChild(testItem);
      });
    };
  
    // Инициализация
    loadTests().then(tests => {
      renderTests(tests);
    });
  
    // Открытие модального окна
    addTestButton.addEventListener('click', () => {
      formModal.style.display = 'block';
    });
  
    // Добавление вопроса
    addQuestionButton.addEventListener('click', () => {
      const newQuestion = document.createElement('div');
      newQuestion.innerHTML = `
        <input test-id="new-test-question" placeholder="Вопрос">
        <div test-id="new-test-options">
          ${Array.from({ length: 4 }, (_, i) => `
            <label>
              <input type="radio" name="correct-answer" value="${i}">
              Вариант ${i + 1}
            </label>
          `).join('')}
        </div>
      `;
      questionsForm.appendChild(newQuestion);
    });
  
    // Удаление последнего вопроса
    removeQuestionButton.addEventListener('click', () => {
      if (questionsForm.children.length > 1) {
        questionsForm.removeChild(questionsForm.lastChild);
      }
    });
  
    // Сохранение теста
    saveButton.addEventListener('click', () => {
      const testTitle = document.getElementById('new-test-title').value;
      const questions = Array.from(questionsForm.children).map(question => {
        const text = question.querySelector('input').value;
        const options = Array.from(question.querySelectorAll('label')).map(label => label.textContent.trim());
        const correctAnswer = question.querySelector('input[type="radio"]:checked').value;
        return { text, options, correctAnswer };
      });
  
      const newTest = { id: Date.now().toString(), title: testTitle, questions };
      loadTests().then(tests => {
        tests.push(newTest);
        localStorage.setItem('tests', JSON.stringify(tests));
        renderTests(tests);
        formModal.style.display = 'none';
      });
    });
  
    // Переход к тестам
    document.getElementById('go-to-test-page').addEventListener('click', () => {
      window.location.href = 'test.html';
    });
  });