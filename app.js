// ToDoList
class ToDoList {
  constructor() {
    this._list = [];
  }
  getList() {
    return this._list;
  }
  clearList() {
    this._list = [];
  }
  addToList(item) {
    this._list.push(item);
  }
  removeFromList(id) {
    this._list.filter((_, index) => this._list[index]._id == id && this._list.splice(index, 1));
  }
}
// ToDo Item
class ToDoItem {
  constructor() {
    this._id = null;
    this._text = null;
  }
  get itemId() {
    return this._id;
  }
  set itemId(id) {
    this._id = id;
  }
  get itemText() {
    return this._text;
  }
  set itemText(text) {
    this._text = text;
  }
}

const toDoList = new ToDoList();

// launch app when ready
document.addEventListener(
  'readystatechange',
  (e) => e.target.readyState === 'complete' && initApp()
);

// init App
const initApp = () => {
  // form submit
  const $form = document.querySelector('.form');
  $form.addEventListener('submit', (e) => {
    e.preventDefault();
    formSubmit();
  });

  // clear all
  const $clearAllBtn = document.querySelector('.itemList__clearAllBtn');
  $clearAllBtn.addEventListener('click', () => {
    const list = toDoList.getList();
    if (list.length) {
      const confirmed = confirm('You want clear all items from list');
      if (confirmed) {
        toDoList.clearList();
        updateLocalStorage(toDoList.getList());
        refresh();
      }
    }
  });
  // load from local

  loadFromLocal();
  // refresh
  refresh();
};

// load from local
const loadFromLocal = () => {
  const list = localStorage.getItem('ToDoList');
  if (typeof list !== 'string') return;
  const parsedList = JSON.parse(list);
  parsedList.forEach((item) => {
    const newItem = createNewToDoItem(item._id, item._text);
    toDoList.addToList(newItem);
  });
};

// refresh
const refresh = () => {
  clearListDisplay();
  renderList();
  clearFormInput();
  focusFormInput();
};

// clear list elements
const clearListDisplay = () => {
  const $list = document.querySelector('.list');
  removeChildrens($list);
};
const removeChildrens = ($parent) => {
  let child = $parent.lastElementChild;
  while (child) {
    $parent.removeChild(child);
    child = $parent.lastElementChild;
  }
};

// render list
const renderList = () => {
  const list = toDoList.getList();
  list.forEach((i) => buildItem(i));
};
// item build
const buildItem = (i) => {
  const $div = document.createElement('div');
  $div.classList.add('item');
  const $checkbox = document.createElement('input');
  $checkbox.type = 'checkbox';
  $checkbox.id = i.itemId;
  addCheckboxClick($checkbox);
  const $label = document.createElement('label');
  $label.htmlFor = i.itemId;
  $label.textContent = i.itemText;
  $div.append($checkbox, $label);
  const $list = document.querySelector('.list');
  $list.appendChild($div);
};
const addCheckboxClick = ($checkbox) => {
  $checkbox.addEventListener('click', () => {
    toDoList.removeFromList($checkbox.id);
    updateLocalStorage(toDoList.getList());
    setTimeout(() => {
      refresh();
    }, 1000);
  });
};

// clear form input
const clearFormInput = () => (document.querySelector('.form__input').value = '');
// focus form input
const focusFormInput = () => document.querySelector('.form__input').focus();
// get form input value
const formInputValue = () => document.querySelector('.form__input').value.trim();
// update local storage
const updateLocalStorage = (arr) => localStorage.setItem('ToDoList', JSON.stringify(arr));

// form submit
const formSubmit = () => {
  const inputValue = formInputValue();
  if (!inputValue.length) return;
  const nextItemId = getNextItemId();
  const item = createNewToDoItem(nextItemId, inputValue);
  toDoList.addToList(item);
  updateLocalStorage(toDoList.getList());
  refresh();
};

// calc next item id
const getNextItemId = () => {
  let i = 1;
  const list = toDoList.getList();
  if (list.length > 0) {
    i = list[list.length - 1].itemId + 1;
  }
  return i;
};

// create new to do item
const createNewToDoItem = (id, text) => {
  const toDo = new ToDoItem();
  toDo.itemId = id;
  toDo.itemText = text;
  return toDo;
};
