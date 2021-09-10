import { format, addDays } from "date-fns";

const projectsContainer = document.getElementById('projectsContainer');
const newProjectForm = document.getElementById('newProjectForm');
const newProjectInput = document.getElementById('newProject');
const deleteProjectButton = document.getElementById('delete-project-button')

const LOCAL_STORAGE_PROJECT_KEY = 'project.projectsList';
let projectsList = JSON.parse(localStorage.getItem(LOCAL_STORAGE_PROJECT_KEY)) || [{id: "001", name: "Indox", todos: []}];

// let projectsList = JSON.parse(localStorage.getItem(LOCAL_STORAGE_PROJECT_KEY)) || [{id: "001", name: "Indox", todos: [{id: "1631243612891", title: "Pick up milk", description: "2%", date: "2021-09-09", priority: "high", complete: true},
//                                                                                                                       {id: "1231241612892", title: "Buy dinner", description: "6pc chicken", date: "2021-10-13", priority: "medium", complete: false},
//                                                                                                                       {id: "1631221612893", title: "Gym", description: "Max reps", date: "2021-09-10", priority: "low", complete: false},
//                                                                                                                       {id: "1631221612843", title: "Swim", description: "3 kilometers", date: "2021-09-11", priority: "medium", complete: true}]},
//                                                                                    {id: "002", name: "Groceries", todos: [{id: "1631243612891", title: "Pick up milk", description: "2%", date: "2021-09-09", priority: "high", complete: true},
//                                                                                                                           {id: "1231241612892", title: "Buy dinner", description: "6pc chicken", date: "2021-10-13", priority: "medium", complete: false}]},
//                                                                                    {id: "003", name: "Fitness", todos: [{id: "1631221612893", title: "Gym", description: "Max reps", date: "2021-09-10", priority: "low", complete: false},
//                                                                                                                         {id: "1631221612843", title: "Swim", description: "3 kilometers", date: "2021-09-11", priority: "medium", complete: true}]}];
const LOCAL_STORAGE_SELECTED_PROJECT_ID_KEY = 'project.selectedProjectId';
let selectedProjectId = localStorage.getItem(LOCAL_STORAGE_SELECTED_PROJECT_ID_KEY) || "001";

const createProject = (name) => ({
  id: Date.now().toString(),
  name,
  todos: []
});

newProjectForm.addEventListener('submit', (e) => {
  e.preventDefault();
  let name = newProjectInput.value;
  if (name === null || name === "") return;
  let project = createProject(name);
  selectedProjectId = project.id
  projectsList.push(project);
  saveAndRender();
  newProjectForm.reset();
  render();
})

const renderProjects = () => {
  clearElement(projectsContainer);
  projectsList.forEach(project => {
    const listElement = document.createElement('li');
    listElement.setAttribute('id', project.id)
    listElement.classList.add('project-name', "list-group-item");
    listElement.innerHTML = project.name;
    if (project.id === selectedProjectId) {
      listElement.classList.add('active')
    }
    projectsContainer.appendChild(listElement);
  })
} 
renderProjects();

// LOCAL STORAGE 
function saveToLocalStorage() {
  localStorage.setItem(LOCAL_STORAGE_PROJECT_KEY, JSON.stringify(projectsList));
  localStorage.setItem(LOCAL_STORAGE_SELECTED_PROJECT_ID_KEY, selectedProjectId);
}

function saveAndRender() {
  saveToLocalStorage();
  renderProjects();
}

projectsContainer.addEventListener('click', e => {
  const targetValue = e.target;
  if (targetValue.classList.contains('project-name')) {
    selectedProjectId = targetValue.id
    saveAndRender();
    render();
  }
})

deleteProjectButton.addEventListener('click', (e) => {
  if (selectedProjectId === "001") return;
  projectsList = projectsList.filter(project => project.id !== selectedProjectId)
  selectedProjectId = "001";
  saveAndRender();
})

function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

// TODOS
const container = document.getElementById("todosContainer");
const newTodoForm = document.getElementById('newTodoForm');
const todoTitle = document.getElementById('todoTitle');
const todoDescription = document.getElementById('todoDescription');
const todoDate = document.getElementById('todoDate');
const todoPriority = document.getElementById('todoPriority');
const inbox = projectsList.find(project => project.id === "001");

const addTodo = (todo) => {
  if (selectedProjectId == null) {selectedProjectId = "001"}
  if (selectedProjectId === "001") {
    inbox.todos.push(todo);
  } else {
    let selectedProject = projectsList.find(project => project.id === selectedProjectId);
    selectedProject.todos.push(todo)
    inbox.todos.push(todo);
  }
}

const createTodo = (title, description, date, priority) => ({
  id: Date.now().toString(),
  title,
  description,
  date,
  priority, 
  complete: false
});

newTodoForm.addEventListener('submit', (e) => {
  e.preventDefault();
  let title = todoTitle.value;
  let description = todoDescription.value;
  let date = todoDate.value;
  let priority = todoPriority.value;
  if (priority == "") {
    priority = "low";
  }
  let todo = createTodo(title, description, date, priority);
  addTodo(todo);
  render();
  saveAndRender();
  newTodoForm.reset();
  closeModal();
})

const createTodoCard = (id, title, date, description, priority, complete) => {
  const cardDiv = document.createElement('div');
  const cardHeaderDiv = document.createElement('div');
  cardHeaderDiv.classList.add('card-header')
  const cardBodyDiv = document.createElement('div');
  cardBodyDiv.classList.add('card-body');
  const cardDate = document.createElement('p');
  const trashButton = document.createElement('button');
  const editButton = document.createElement('button');
  const accordianButton = document.createElement('button');
  accordianButton.innerHTML = '+'
  cardBodyDiv.setAttribute('id', `${id}Panel`)
  cardBodyDiv.style.display = "none";
  const completeCheckbox = document.createElement('INPUT');
  completeCheckbox.setAttribute("type", "checkbox");
  completeCheckbox.classList.add('completeCheckbox', "mr-2")
  completeCheckbox.checked = complete;

  //
  const editableTitle = document.createElement('h4');
  let titleText = document.createTextNode(title);
  
  editableTitle.appendChild(titleText);
  editableTitle.setAttribute('id', 'editableTitle');
  editableTitle.classList.add('editable-title', 'card-title', 'd-inline', 'text-uppercase');
  cardDiv.appendChild(editableTitle);
  //
  
  //
  const editableDescription = document.createElement('div');
  
  let value = description;
  let text;
  
  if (value == null || value == '') {
    text = document.createTextNode('Add description');
  } else {
    text = document.createTextNode(value);
  }
  
  editableDescription.appendChild(text);
  editableDescription.setAttribute('id', 'editableDescription');
  editableDescription.classList.add('editable-description', 'card-text', "font-weight-light", 'm-2');
  cardDiv.appendChild(editableDescription);
  //
  
  //
  switch(priority) {
    case "high":
      cardDiv.classList.add('border-danger');
      editButton.innerHTML = "High";
      editButton.classList.add('edit-todo', 'btn', 'btn-outline-danger');
      break;
    case "medium":
      cardDiv.classList.add('border-warning');
      editButton.classList.add('edit-todo', 'btn', 'btn-outline-warning');
      editButton.innerHTML = "Medium";
      break;
    case "low":
      cardDiv.classList.add('border-success');
      editButton.classList.add('edit-todo', 'btn', 'btn-outline-success');
      editButton.innerHTML = "Low";
      break;
    }
      //
      
  cardDiv.setAttribute('id', id)
  cardDiv.classList.add('card', 'my-2')
  let newDate = addDays(new Date(date), 1)
  cardDate.innerHTML = format(new Date(newDate), 'MM/dd/yyyy');
  cardDate.classList.add('card-date', 'd-inline', "mx-3", "font-weight-light")
  const iEle = document.createElement('I')
  iEle.classList.add('bi', 'bi-trash')
  trashButton.appendChild(iEle);
  trashButton.classList.add('delete-todo', 'btn', 'btn-danger', 'd-inline', 'float-right', 'ml-1');
  accordianButton.classList.add('accordian', 'btn', 'btn-secondary', 'float-right');
  if (complete) {
    editableTitle.style.pointerEvents = 'none';
    editableDescription.style.pointerEvents = 'none';
    editButton.style.pointerEvents = 'none';
    cardDate.style.pointerEvents = 'none';
    cardDiv.style.opacity = '.4'
  }
  cardHeaderDiv.appendChild(completeCheckbox);
  cardHeaderDiv.appendChild(editableTitle);
  cardHeaderDiv.appendChild(cardDate);
  cardHeaderDiv.appendChild(trashButton);
  cardHeaderDiv.appendChild(accordianButton);
  cardBodyDiv.appendChild(editableDescription);
  cardBodyDiv.appendChild(editButton);
  cardDiv.appendChild(cardHeaderDiv);
  cardDiv.appendChild(cardBodyDiv);
  return cardDiv
}
      
      function render() {
        clearElement(container);
        let selectedProject = projectsList.find(project => project.id === selectedProjectId);
        selectedProject.todos.forEach(todo => {
    const card = createTodoCard(
      todo.id, 
      todo.title, 
      todo.date, 
      todo.description, 
      todo.priority, 
      todo.complete
    )
    container.appendChild(card);
  })
}
render();

// delete todo
function deleteCheck(itemId, selectedProject) {
  if (selectedProject.id !== "001") {
    selectedProject.todos = selectedProject.todos.filter(todo => todo.id !== itemId);
    inbox.todos = inbox.todos.filter(todo => todo.id !== itemId);
    saveAndRender();
    render();
  } else {
    inbox.todos = inbox.todos.filter(todo => todo.id !== itemId);
    saveAndRender();
    render();
  }
}

const changePriority = (itemId, selectedProject) => {
  const todoToEdit = selectedProject.todos.filter(todo => todo.id === itemId)[0];
    switch (todoToEdit.priority) {
      case 'low':
        todoToEdit.priority = 'medium';
        break;
      case 'medium':
        todoToEdit.priority = 'high';
        break;
      case 'high':
        todoToEdit.priority = 'low';
        break;
    }
    saveAndRender();
    render();
}

const changeDescription = (item, itemId, selectedProject) => {
  let lengthOfTextArea = document.getElementsByClassName('textarea').length;
    if (lengthOfTextArea == 0) {
      let html = item.innerHTML;
      item.innerHTML = `<textarea id=${itemId + "textArea"}>${html}</textarea>`
      let textarea = document.getElementById(itemId + "textArea");
      textarea.addEventListener('blur', () => {
        const messageForDesctiption = 'Add description';
        const todoToEdit = selectedProject.todos.filter(todo => todo.id === itemId)[0];
        if (textarea.value == "") {
          item.innerHTML = messageForDesctiption;
          todoToEdit.description = messageForDesctiption;
        } else {
          item.innerHTML = textarea.value;
          todoToEdit.description = textarea.value;
        }
        saveAndRender();
        render();
      })
    }
}

const changeTitle = (item, itemId, selectedProject) => {
  let lengthOfTextArea = document.getElementsByClassName('textarea').length;
    if (lengthOfTextArea == 0) {
      let html = item.innerHTML;
      const originalHtml = html;
      item.innerHTML = `<textarea id=${itemId + "titleTextArea"}>${html}</textarea>`
      let textarea = document.getElementById(itemId + "titleTextArea");
      textarea.addEventListener('blur', () => {
        const todoToEdit = selectedProject.todos.filter(todo => todo.id === itemId)[0];
        if (textarea.value == "") {
          item.innerHTML = originalHtml;
          todoToEdit.title = originalHtml;
        } else {
          item.innerHTML = textarea.value;
          todoToEdit.title = textarea.value;
        }
        saveAndRender();
        render();
      })
    }
}

container.addEventListener('click', (e) => {
  const item = e.target;
  const itemId = e.target.parentElement.parentElement.id
  let selectedProject = projectsList.find(project => project.id === selectedProjectId);
  if (item.classList.contains('delete-todo')) {
    deleteCheck(itemId, selectedProject);
  } else if (item.classList.contains('bi-trash')) {
    const itemId = e.target.parentElement.parentElement.parentElement.id
    deleteCheck(itemId, selectedProject);
  }  else if (item.classList.contains('edit-todo')) {
    changePriority(itemId, selectedProject);
  } else if (item.classList.contains('editable-description')) {
    changeDescription(item, itemId, selectedProject);
  } else if (item.classList.contains('editable-title')) {
    changeTitle(item, itemId, selectedProject);
  } else if (item.classList.contains('accordian')) {
    item.classList.toggle('active')
    let panel = document.getElementById(`${itemId}Panel`)
    if (panel.style.display === "block") {
      panel.style.display = "none";
    } else if (panel.style.display === "") {
      panel.style.display = "none";
    } else {
      panel.style.display = "block";
    }
  } else if (item.classList.contains('completeCheckbox')) {
    let inboxTodo = inbox.todos.find(todo => todo.id === itemId);
    let todoToEdit = selectedProject.todos.find(todo => todo.id === itemId);
    if (selectedProjectId == "001") {
      let tof = !inboxTodo.complete;
      projectsList.forEach(project => {
        let x = project.todos.find(todo => todo.id === itemId);
        if (x !== undefined) {
          x.complete = tof;
        }
      })
    } else {
      todoToEdit.complete = !todoToEdit.complete;
      inboxTodo.complete = todoToEdit.complete;
    }
    saveAndRender();
    render();
  }
});

/// !!!!!!!!!!!!!!MODAL PUT EVERYTHING ABOVE!!!!!!!!!!!!!!!!!!!!!!!! ////
const newTodoButton = document.getElementById('addTodo');
newTodoButton.addEventListener('click', () => {
   newTodoModal.style.display = "block";
   newTodoModal.classList.add('show');
})

const closeModal = () => {
  newTodoModal.style.display = "none";
  newTodoModal.classList.remove('show');
}

const cancelButtons = document.querySelectorAll('.cancel');
cancelButtons.forEach(button => button.addEventListener('click', closeModal));

