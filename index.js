const taskArray = [];
const lightTheme = document.querySelector('.light-theme');
const darkerTheme = document.querySelector('.darker-theme');

document.getElementById('form').addEventListener('submit', function (event) {
    event.preventDefault();
    const taskName = document.getElementById('task-input').value;
    makeNewTask(taskName);
});


lightTheme.addEventListener('click', () => changeTheme('light'));
darkerTheme.addEventListener('click', () => changeTheme('darker'));

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

function changeTheme(theme) {
    document.body.className = theme;

    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {

        input.classList.remove('light-input', 'darker-input');
        input.classList.add(`${theme}-input`);
    });


    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {

        button.classList.remove('light-button', 'darker-button');
        button.classList.add(`${theme}-button`);


    });


    localStorage.setItem('currentTheme', theme);
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
        doneButton.addEventListener('click', () => toggleDone(task.id));
        clone.querySelector('.delete-button').addEventListener('click', () => deleteTask(task.id));

        if (elementId === 'completed-tasks') {
            clone.querySelector('.task').classList.add('completed');
        }

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

document.addEventListener('DOMContentLoaded', () => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (savedTasks) {
        taskArray.push(...savedTasks);
        filterAndSortList();
    }

    const savedTheme = localStorage.getItem('currentTheme') || 'light';
    changeTheme(savedTheme);
});
