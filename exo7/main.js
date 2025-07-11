
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    let index = 0;

    for (const task of tasks) {
        const currentIndex = index;

        const li = document.createElement('li');

        const taskText = document.createElement('span');
        taskText.textContent = task;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Supprimer';
        deleteButton.addEventListener('click', () => removeTask(currentIndex));
        li.appendChild(taskText);
        li.appendChild(deleteButton);
        taskList.appendChild(li);

        index++;
    }
}


function addTask() {
    const input = document.getElementById('taskInput');
    const task = input.value.trim();

    if (task) {
        const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        input.value = '';
        loadTasks();
    }
}

function removeTask(index) {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    tasks.splice(index, 1);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    loadTasks();
}

document.getElementById('addTaskBtn').addEventListener('click', addTask);

document.getElementById('taskInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        addTask();
    }
});

loadTasks();
