class TaskManager {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.taskInput = document.getElementById('taskInput');
        this.taskList = document.getElementById('taskList');
        this.addTaskButton = document.getElementById('addTask');
        this.saveTasksButton = document.getElementById('saveTasks');
        this.loadTasksButton = document.getElementById('loadTasks');

        this.initialize();
    }

    initialize() {
        this.renderTasks();
        this.addEventListeners();
        this.checkDeviceType();
    }

    checkDeviceType() {
        const userAgent = navigator.userAgent.toLowerCase();
        if (userAgent.includes('mobile')) {
            alert('Estás usando un navegador móvil');
        } else {
            alert('Estás usando un navegador de PC');
        }
    }

    addEventListeners() {
        this.addTaskButton.addEventListener('click', () => this.addTask());
        this.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });
        this.saveTasksButton.addEventListener('click', () => this.saveTasksToFile());
        this.loadTasksButton.addEventListener('click', () => this.loadTasksFromFile());
    }

    addTask(parentId = null) {
        const taskText = this.taskInput.value.trim();
        if (taskText === '') return;

        const task = {
            id: Date.now(),
            text: taskText,
            completed: false,
            subtasks: [],
            parentId: parentId,
        };

        if (parentId) {
            const parentTask = this.findTaskById(parentId);
            if (parentTask) {
                parentTask.subtasks.push(task);
            }
        } else {
            this.tasks.push(task);
        }

        this.saveTasks();
        this.renderTasks();
        this.taskInput.value = '';
    }

    addSubtask(parentId) {
        const subtaskText = prompt('Ingrese el texto de la subtarea:').trim();
        if (subtaskText === '') return;

        const subtask = {
            id: Date.now(),
            text: subtaskText,
            completed: false,
            subtasks: [],
            parentId: parentId,
        };

        const parentTask = this.findTaskById(parentId);
        if (parentTask) {
            parentTask.subtasks.push(subtask);
        }

        this.saveTasks();
        this.renderTasks();
    }

    toggleTask(taskId) {
        const task = this.findTaskById(taskId);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.renderTasks();
        }
    }

    deleteTask(taskId, parentId = null) {
        if (parentId) {
            const parentTask = this.findTaskById(parentId);
            if (parentTask) {
                parentTask.subtasks = parentTask.subtasks.filter((t) => t.id !== taskId);
            }
        } else {
            this.tasks = this.tasks.filter((t) => t.id !== taskId);
        }

        this.saveTasks();
        this.renderTasks();
    }

    findTaskById(taskId, tasks = this.tasks) {
        for (const task of tasks) {
            if (task.id === taskId) return task;
            const subtask = this.findTaskById(taskId, task.subtasks);
            if (subtask) return subtask;
        }
        return null;
    }

    renderTask(task, parentElement) {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.innerHTML = `
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
            <span class="task-text">${task.text}</span>
            <button class="delete-task">🗑️</button>
            <button class="add-subtask">➕</button>
        `;
        li.querySelector('.task-checkbox').addEventListener('change', () => this.toggleTask(task.id));
        li.querySelector('.delete-task').addEventListener('click', () => this.deleteTask(task.id, task.parentId));
        li.querySelector('.add-subtask').addEventListener('click', () => this.addSubtask(task.id));
        parentElement.appendChild(li);

        if (task.subtasks.length > 0) {
            const subtaskList = document.createElement('ul');
            subtaskList.classList.add('subtask-list');
            task.subtasks.forEach((subtask) => this.renderTask(subtask, subtaskList));
            parentElement.appendChild(subtaskList);
        }
    }

    renderTasks() {
        this.taskList.innerHTML = '';
        this.tasks.forEach((task) => this.renderTask(task, this.taskList));
    }

    saveTasksToFile() {
        this.saveTasks();
        alert('Tareas guardadas');
    }

 loadTasksFromFile() {
    const tasks = localStorage.getItem('tasks');
    if (tasks) {
        this.tasks = JSON.parse(tasks);
        this.renderTasks();
        alert('Tareas cargadas exitosamente');
    } else {
        alert('No hay tareas guardadas');
    }
}


    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }
}






document.addEventListener('DOMContentLoaded', () => new TaskManager());
