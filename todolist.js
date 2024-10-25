let todoLists = JSON.parse(localStorage.getItem('todoLists')) || {}; // Charger les listes depuis le Local Storage
let currentList = null; // La liste actuellement sélectionnée

// Fonction pour créer une nouvelle liste
function createTodoList() {
    const listNameInput = document.getElementById('list-name-input');
    const listName = listNameInput.value.trim();

    if (listName !== '' && !todoLists[listName]) {
        todoLists[listName] = []; // Initialiser une liste vide
        saveTodoLists(); // Sauvegarder dans le Local Storage
        renderTodoLists(); // Mettre à jour l'affichage des listes
        listNameInput.value = ''; // Réinitialiser le champ de saisie
    }
}

// Fonction pour sauvegarder les listes dans le Local Storage
function saveTodoLists() {
    localStorage.setItem('todoLists', JSON.stringify(todoLists));
}

// Fonction pour afficher toutes les listes
function renderTodoLists() {
    const todoListsContainer = document.getElementById('todo-lists');
    todoListsContainer.innerHTML = ''; // Effacer l'affichage actuel

    Object.keys(todoLists).forEach(listName => {
        const div = document.createElement('div');
        div.textContent = listName;
        div.onclick = () => selectTodoList(listName); // Sélectionner une liste
        todoListsContainer.appendChild(div);
    });
}

// Fonction pour sélectionner une liste
function selectTodoList(listName) {
    currentList = listName;
    renderTasks(); // Afficher les tâches de la liste sélectionnée
}

// Fonction pour ajouter une tâche à la liste actuellement sélectionnée
function addTask() {
    const taskInput = document.getElementById('task-input');
    const taskText = taskInput.value.trim();

    if (taskText !== '' && currentList) {
        const task = { id: Date.now(), text: taskText, completed: false };
        todoLists[currentList].push(task); // Ajouter la tâche à la liste sélectionnée
        saveTodoLists(); // Sauvegarder les modifications
        renderTasks(); // Mettre à jour l'affichage des tâches
        taskInput.value = ''; // Réinitialiser le champ de texte
    }
}

// Fonction pour afficher les tâches de la liste sélectionnée
function renderTasks() {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = ''; // Effacer la liste

    if (currentList) {
        todoLists[currentList].forEach(task => {
            const li = document.createElement('li');
            li.textContent = task.text + (task.completed ? " (Clôturée)" : "");

            // Bouton "Détails"
            const detailBtn = document.createElement('button');
            detailBtn.textContent = 'Détails';
            detailBtn.onclick = () => showTaskDetail(task.id);

            // Bouton "Modifier"
            const editBtn = document.createElement('button');
            editBtn.textContent = 'Modifier';
            editBtn.onclick = () => editTask(task.id);

            // Bouton "Supprimer"
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Supprimer';
            deleteBtn.onclick = () => deleteTask(task.id);

            li.appendChild(detailBtn);
            li.appendChild(editBtn);
            li.appendChild(deleteBtn);
            taskList.appendChild(li);
        });
    }
}

// Fonction pour supprimer une tâche
function deleteTask(id) {
    if (currentList) {
        todoLists[currentList] = todoLists[currentList].filter(task => task.id !== id); // Filtrer les tâches
        saveTodoLists(); // Sauvegarder les modifications
        renderTasks(); // Mettre à jour l'affichage
    }
}

// Fonction pour modifier une tâche
function editTask(id) {
    if (currentList) {
        const newTaskText = prompt('Modifier la tâche :');
        if (newTaskText) {
            todoLists[currentList] = todoLists[currentList].map(task =>
                task.id === id ? { ...task, text: newTaskText } : task
            );
            saveTodoLists(); // Sauvegarder les modifications
            renderTasks(); // Mettre à jour l'affichage
        }
    }
}

// Fonction pour afficher les détails d'une tâche
function showTaskDetail(id) {
    if (currentList) {
        const task = todoLists[currentList].find(task => task.id === id);
        if (task) {
            document.getElementById('task-text').textContent = "Tâche : " + task.text;
            document.getElementById('task-detail').style.display = 'block';
        }
    }
}

// Fonction pour fermer les détails
function closeTaskDetail() {
    document.getElementById('task-detail').style.display = 'none';
}

// Fonction pour clôturer la liste
function closeTodoList() {
    if (currentList) {
        todoLists[currentList] = todoLists[currentList].map(task => ({ ...task, completed: true }));
        saveTodoLists(); // Sauvegarder les modifications
        renderTasks(); // Mettre à jour l'affichage
    }
}

renderTodoLists(); // Afficher les listes au chargement de la page