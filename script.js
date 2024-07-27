document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('todo-input');
    const dateInput = document.getElementById('due-date-input');
    const addBtn = document.getElementById('add-btn');
    const todoList = document.getElementById('todo-list');

    // Load tasks from local storage
    loadTasks();

    addBtn.addEventListener('click', addTodo);

    function addTodo() {
        const task = input.value.trim();
        const dueDate = dateInput.value;
        if (task !== '') {
            const listItem = createListItem(task, dueDate);
            todoList.appendChild(listItem);
            input.value = '';
            dateInput.value = '';
            saveTasks();
        }
    }

    todoList.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn')) {
            e.target.closest('li').remove();
            saveTasks();
        } else if (e.target.classList.contains('edit-btn')) {
            editTask(e.target.closest('li'));
        } else if (e.target.classList.contains('complete-btn')) {
            toggleComplete(e.target.closest('li'));
        }
    });

    function createListItem(task, dueDate) {
        const listItem = document.createElement('li');
        listItem.classList.add('todo-item');
        listItem.innerHTML = `
            <span class="task">${task}</span>
            <span class="due-date">${dueDate ? `Due: ${dueDate}` : ''}</span>
            <div class="btn-container">
                <button class="complete-btn">Complete</button>
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;
        return listItem;
    }

    function editTask(listItem) {
        const taskSpan = listItem.querySelector('.task');
        const dueDateSpan = listItem.querySelector('.due-date');
        const newTask = prompt('Edit task', taskSpan.textContent);
        const newDueDate = prompt('Edit due date', dueDateSpan.textContent.replace('Due: ', ''));
        if (newTask !== null && newTask.trim() !== '') {
            taskSpan.textContent = newTask.trim();
            dueDateSpan.textContent = newDueDate ? `Due: ${newDueDate}` : '';
            saveTasks();
        }
    }

    function toggleComplete(listItem) {
        listItem.classList.toggle('completed');
        saveTasks();
    }

    function saveTasks() {
        const tasks = [];
        todoList.querySelectorAll('.todo-item').forEach((listItem) => {
            tasks.push({
                task: listItem.querySelector('.task').textContent,
                dueDate: listItem.querySelector('.due-date').textContent.replace('Due: ', ''),
                completed: listItem.classList.contains('completed')
            });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach((taskObj) => {
            const listItem = createListItem(taskObj.task, taskObj.dueDate);
            if (taskObj.completed) {
                listItem.classList.add('completed');
            }
            todoList.appendChild(listItem);
        });
    }
});
