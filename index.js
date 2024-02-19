const taskArray = [];

document.getElementById('new-task-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const taskName = document.getElementById('task-input').value;
    makeNewTask(taskName);
});

function makeNewTask(name) {
    const task = {
        id: generateUniqueId(),
        name: name,
        done: false
    };
    taskArray.push(task);
    saveToLocalStorage();
    filterAndSortList();
}

function filterAndSortList() {
    const listToShow = taskArray.filter(task => !task.done);
    showList(listToShow, 'task-list');
    const completedTasks = taskArray.filter(task => task.done);
    showList(completedTasks, 'completed-tasks');
}

function showList(tasks, elementId) {
    const listElement = document.getElementById(elementId);
    listElement.innerHTML = '';
    tasks.forEach(task => {
        const clone = document.getElementById('task-template').content.cloneNode(true);
        clone.querySelector('.task-name').textContent = task.name;
        const doneButton = clone.querySelector('.done-button');
        doneButton.textContent = task.done ? 'Gendan' : 'Færdig';
        doneButton.addEventListener('click', () => toggleDone(task.id));
        clone.querySelector('.delete-button').addEventListener('click', () => deleteTask(task.id));
        listElement.appendChild(clone);
    });
}

function toggleDone(id) {
    const task = taskArray.find(task => task.id === id);
    if (task) {
        task.done = !task.done;
        saveToLocalStorage();
        filterAndSortList();
    }
}

function deleteTask(id) {
    const index = taskArray.findIndex(task => task.id === id);
    if (index !== -1) {
        taskArray.splice(index, 1);
        saveToLocalStorage();
        filterAndSortList();
    }
}

function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(taskArray));
}

// localStorage 
document.addEventListener('DOMContentLoaded', () => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (savedTasks) {
        taskArray.push(...savedTasks);
        filterAndSortList();
    }
});
