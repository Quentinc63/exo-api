class DragDropTodoList {
    constructor() {
        this.todoList = document.getElementById('todoList');
        this.addTaskBtn = document.getElementById('addTaskBtn');
        this.newTaskInput = document.getElementById('newTaskInput');
        this.draggedElement = null;
        this.taskIdCounter = 6;

        this.init();
    }

    init() {
        this.loadFromStorage();
        this.bindEvents();
        this.updateTasksEvents();
    }

    bindEvents() {
        this.addTaskBtn.addEventListener('click', () => this.addTask());
        this.newTaskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });
    }

    updateTasksEvents() {
        const tasks = this.todoList.querySelectorAll('li');

        tasks.forEach(task => {
            // Nettoyer les anciens event listeners
            task.removeEventListener('dragstart', this.handleDragStart);
            task.removeEventListener('dragover', this.handleDragOver);
            task.removeEventListener('drop', this.handleDrop);
            task.removeEventListener('dragend', this.handleDragEnd);

            // Ajouter les nouveaux
            task.addEventListener('dragstart', (e) => this.handleDragStart(e));
            task.addEventListener('dragover', (e) => this.handleDragOver(e));
            task.addEventListener('drop', (e) => this.handleDrop(e));
            task.addEventListener('dragend', (e) => this.handleDragEnd(e));
        });
    }

    handleDragStart(e) {
        this.draggedElement = e.target;
        e.target.style.opacity = '0.5';
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', e.target.outerHTML);
    }

    handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';

        const afterElement = this.getDragAfterElement(e.clientY);
        if (afterElement == null) {
            this.todoList.appendChild(this.draggedElement);
        } else {
            this.todoList.insertBefore(this.draggedElement, afterElement);
        }
    }

    handleDrop(e) {
        e.preventDefault();
        if (e.target.tagName === 'LI' && e.target !== this.draggedElement) {
            const rect = e.target.getBoundingClientRect();
            const middle = rect.top + rect.height / 2;

            if (e.clientY < middle) {
                this.todoList.insertBefore(this.draggedElement, e.target);
            } else {
                this.todoList.insertBefore(this.draggedElement, e.target.nextSibling);
            }
        }
        this.saveToStorage();
    }

    handleDragEnd(e) {
        e.target.style.opacity = '1';
        this.draggedElement = null;
        this.saveToStorage();
    }

    getDragAfterElement(y) {
        const draggableElements = [...this.todoList.querySelectorAll('li:not(.dragging)')];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;

            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    addTask() {
        const taskText = this.newTaskInput.value.trim();
        if (!taskText) return;

        const newTask = document.createElement('li');
        newTask.draggable = true;
        newTask.dataset.id = this.taskIdCounter++;
        newTask.textContent = taskText;

        this.todoList.appendChild(newTask);
        this.newTaskInput.value = '';

        this.updateTasksEvents();
        this.saveToStorage();
    }

    saveToStorage() {
        const tasks = Array.from(this.todoList.querySelectorAll('li')).map(li => ({
            id: li.dataset.id,
            text: li.textContent
        }));



        console.log('Ordre sauvegardé:', tasks);
    }

    renderTasks(tasks) {
        this.todoList.innerHTML = '';

        tasks.forEach(task => {
            const li = document.createElement('li');
            li.draggable = true;
            li.dataset.id = task.id;
            li.textContent = task.text;
            this.todoList.appendChild(li);
        });

        this.updateTasksEvents();
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    new DragDropTodoList();
});