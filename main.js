const listContainer = document.querySelector('[data-listed]');
const clearTasksButton = document.querySelector('[data-clear-task]');
const cardContainer = document.querySelector('[data-todo-tasklist]');
const taskListTitle = document.querySelector('[data-todo-task-title]');
const taskListCount = document.querySelector('[data-todo-task-count]');
const newListForm = document.querySelector('[data-newlist-form]');
const newListInput = document.querySelector('[data-newlist-input]');
const deleteListButton = document.querySelector('[data-delete-list]');
const newCardForm = document.querySelector('[data-newcard-form]')
const cardTemplate = document.getElementById('task-template');
const cardTitle = document.querySelector('[data-card-title]');
const LOCAL_STORAGE_LIST_KEY = 'task.lists';
const LOCAL_STORAGE_SELECTED_LIST_KEY = 'task.selectedListId';
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_KEY);



listContainer.addEventListener("click", listEl => {
    if (listEl.target.tagName.toLowerCase() === "li") {
        selectedListId = listEl.target.dataset.listId;
        saveRender();
    }


cardContainer.addEventListener("change", e => {
    if (e.target.tagName.toLowerCase() === "input") {
        const selectedList = lists.find(list => list.id === selectedListId);
        const selectedTask = selectedList.cards.find(card => card.id === e.target.id);
        selectedTask.completed = e.target.checked;
        save();
        renderTaskCount(selectedList);
    }
})
clearTasksButton.addEventListener('click', e => {
    const selectedList = lists.find(list => list.id === selectedListId);
    selectedList.cards = selectedList.cards.filter(card => !card.completed);
    saveRender();
})
deleteListButton.addEventListener('click', e => {
    lists = lists.filter(list => list.id !== selectedListId);
    selectedListId = lists[0].id;
    saveRender()
})
newListForm.addEventListener("click", e => {
    e.preventDefault();
    const listName = newListInput.value;
    if (listName.trim()) {
        const list = createList(listName);
        lists.push(list);
        newListInput.value = "";
        saveRender();
    }
});
newCardForm.addEventListener('submit', e => {
    e.preventDefault();
    const cardName = cardTitle.value;
    if (cardName.trim()) {
        const card = createCard(cardName);
        const selectedListCard = lists.find(list => list.id === selectedListId);
        selectedListCard.cards.push(card);
        saveRender();
    }

})

function createCard(name) {
    return {
        id: Date.now().toString().concat(name),
        name: name,
        completed: false,
    };
}

function createList(name) {
    return {
        id: Date.now().toString().concat(name),
        name: name,
        cards: []
    }
}

function render() {
    if (selectedListId === null) {
        selectedListId = lists[0].id;
    }
    clearEls(listContainer);
    clearTasks(cardContainer);
    renderLists();
    const selectedList = lists.find(list => list.id === selectedListId);
    taskListTitle.innerText = selectedList.name;
    renderTaskCount(selectedList);
    renderTasks(selectedList);
}

function renderTasks(selectedList) {
    selectedList.cards.forEach(card => {
        const cardEl = document.importNode(cardTemplate.content, true);
        const checkBox = cardEl.querySelector('input[type=checkbox]');
        const label = cardEl.querySelector('label');
        checkBox.checked = card.completed;
        label.htmlFor = card.id;
        checkBox.id = card.id;
        label.innerText = card.name;
        cardContainer.append(cardEl);
    });
}

function renderTaskCount(selectedList) {
    const completeCount = selectedList.cards.filter(card => card.completed).length;
    const cardLength = selectedList.cards.length;
    const compString = completeCount - cardLength === 1 ? "task" : "tasks";
    taskListCount.innerHTML = `<b>${completeCount}</b> / ${cardLength} ${compString} Remaining`;
}

function renderLists() {
    lists.forEach(list => {
        const listEl = document.createElement("li");
        listEl.dataset.listId = list.id;
        listEl.classList.add("list-name");
        listEl.innerText = list.name;
        if (list.id === selectedListId) {
            listEl.classList.add("selected-list");
        }
        listContainer.append(listEl);
    });
}

function save() {
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists));
    localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_KEY, selectedListId);
}

function clearEls(lists) {
    while (lists.firstChild) {
        lists.removeChild(lists.firstChild);
    }
}

function clearTasks(cardContainer) {
    while (cardContainer.firstChild) {
        cardContainer.removeChild(cardContainer.firstChild);
    }
}

function saveRender() {
    save();
    render();
}
render();