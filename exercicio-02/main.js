// Carregar tarefas do localStorage
function loadTasks() {
    const storedTasks = localStorage.getItem('tasks');
    tasks = storedTasks ? JSON.parse(storedTasks) : [];
    renderTasks();
  }

  // Salvar tarefas no localStorage
  function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  // Array para armazenar as tarefas
  let tasks = [];

  // Função para adicionar uma nova tarefa
  function addTask() {
    const taskDesc = document.getElementById('taskDesc').value.trim();
    if (taskDesc === '') return;

    tasks.push({ description: taskDesc, completed: false });
    document.getElementById('taskDesc').value = '';
    saveTasks();
    renderTasks();
  }

  // Função para renderizar as tarefas na lista
  function renderTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    tasks.forEach((task, index) => {
      const li = document.createElement('li');
      li.classList.add('task-edit');

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = task.completed;
      checkbox.setAttribute('data-index', index);
      checkbox.addEventListener('change', toggleTaskCompleted);

      const label = document.createElement('label');
      label.textContent = task.description;
      label.setAttribute('for', `task${index}`);
      label.classList.add('task-label');

      const inputEdit = document.createElement('input');
      inputEdit.type = 'text';
      inputEdit.value = task.description;
      inputEdit.classList.add('editable', 'hidden');
      inputEdit.setAttribute('data-index', index);
      inputEdit.addEventListener('change', editTask);

      const buttonEdit = document.createElement('button');
      buttonEdit.textContent = 'Editar';
      buttonEdit.setAttribute('data-index', index);
      buttonEdit.addEventListener('click', () => toggleEdit(inputEdit, label, buttonEdit));

      const buttonDelete = document.createElement('button');
      buttonDelete.textContent = 'Apagar';
      buttonDelete.setAttribute('data-index', index);
      buttonDelete.addEventListener('click', deleteTask);

      li.appendChild(checkbox);
      li.appendChild(label);
      li.appendChild(inputEdit);
      li.appendChild(buttonEdit);
      li.appendChild(buttonDelete);
      taskList.appendChild(li);
    });
  }

  // Função para marcar a tarefa como concluída ou não
  function toggleTaskCompleted(event) {
    const index = event.target.getAttribute('data-index');
    tasks[index].completed = event.target.checked;
    saveTasks();
    renderTasks();
  }

  // Função para editar uma tarefa
  function editTask(event) {
    const index = event.target.getAttribute('data-index');
    tasks[index].description = event.target.value.trim();
    saveTasks();
    renderTasks();
  }

  // Função para deletar uma tarefa
  function deleteTask(event) {
    const index = event.target.getAttribute('data-index');
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
  }

  // Função para filtrar as tarefas
  document.getElementById('filter').addEventListener('input', function () {
    const filterValue = this.value.toLowerCase();
    const filteredTasks = tasks.filter(task => task.description.toLowerCase().includes(filterValue));
    renderFilteredTasks(filteredTasks);
  });

  // Função para renderizar as tarefas filtradas
  function renderFilteredTasks(filteredTasks) {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    filteredTasks.forEach((task, index) => {
      const li = document.createElement('li');
      li.classList.add('task-edit');

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = task.completed;
      checkbox.setAttribute('data-index', index);
      checkbox.addEventListener('change', toggleTaskCompleted);

      const label = document.createElement('label');
      label.textContent = task.description;
      label.setAttribute('for', `task${index}`);
      label.classList.add('task-label');

      const inputEdit = document.createElement('input');
      inputEdit.type = 'text';
      inputEdit.value = task.description;
      inputEdit.classList.add('editable', 'hidden');
      inputEdit.setAttribute('data-index', index);
      inputEdit.addEventListener('change', editTask);

      const buttonEdit = document.createElement('button');
      buttonEdit.textContent = 'Editar';
      buttonEdit.setAttribute('data-index', index);
      buttonEdit.addEventListener('click', () => toggleEdit(inputEdit, label, buttonEdit));

      const buttonDelete = document.createElement('button');
      buttonDelete.textContent = 'Apagar';
      buttonDelete.setAttribute('data-index', index);
      buttonDelete.addEventListener('click', deleteTask);

      li.appendChild(checkbox);
      li.appendChild(label);
      li.appendChild(inputEdit);
      li.appendChild(buttonEdit);
      li.appendChild(buttonDelete);
      taskList.appendChild(li);
    });
  }

  // Função para alternar entre visualização e edição
  function toggleEdit(inputEdit, label, buttonEdit) {
    const isEditing = !inputEdit.classList.contains('hidden');

    if (isEditing) {
      label.textContent = inputEdit.value.trim();
      inputEdit.classList.add('hidden');
      label.classList.remove('hidden');
      buttonEdit.textContent = 'Editar';
    } else {
      inputEdit.classList.remove('hidden');
      label.classList.add('hidden');
      buttonEdit.textContent = 'Salvar';
      inputEdit.focus();
    }
  }

  // Adiciona evento de clique ao botão Adicionar
  const buttonAdd = document.getElementById('buttonAdd');
  buttonAdd.addEventListener('click', addTask);

  // Carrega tarefas ao iniciar
  loadTasks();