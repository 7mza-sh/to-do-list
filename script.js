// الحصول على العناصر من صفحة HTML
let taskTitleInput = document.getElementById('task-title-input');
let taskContentInput = document.getElementById('task-content-input');
let taskSubmitButton = document.getElementById('task-submit-button');
let getAllTasks = document.getElementById('get-all-tasks');
let getDoneTasks = document.getElementById('get-done-tasks');
let getUndoneTasks = document.getElementById('get-undone-tasks');
let tasksCounter = document.getElementById('tasks-counter');
let tasksBox = document.getElementById('tasks-box');

// جميع المتغيرات العامة في المشروع
let tasks = [];
let storageData = [];
let editingTaskIndex = 0;
let submitType = 'create';
let tasksCounterVariable = 0;
let taskIndexVariable = 0;

// دالة إنشاء عنصر جديد
function createNewTaskObject () {
  
  // إنشاء العناصر
  let taskContainerElement = document.createElement('div');
  let taskTitleBoxElement = document.createElement('div');
  let taskTitleElement = document.createElement('h3');
  let taskIndexElement = document.createElement('span');
  let taskTitleTextBoxElement = document.createElement('div');
  let iconsBoxElement = document.createElement('div');
  let doneOrUnDoneElement = document.createElement('i');
  let deleteTaskElement = document.createElement('i');
  let editTaskElement = document.createElement('i');
  let taskContentElement = document.createElement('p');
  
  // إعطاء العناصر الكلاسات المطلوبة
  taskContainerElement.classList.add('task-container');
  taskTitleBoxElement.classList.add('task-title-box');
  taskTitleTextBoxElement.classList.add('task-titl-rext-box-element')
  iconsBoxElement.classList.add('icons-box');
  doneOrUnDoneElement.classList.add('bi', 'bi-check-circle');
  deleteTaskElement.classList.add('bi', 'bi-trash');
  editTaskElement.classList.add('bi', 'bi-pen');
  
  // إضافة العناصر لبعضها البعض
  iconsBoxElement.appendChild(doneOrUnDoneElement);
  iconsBoxElement.appendChild(deleteTaskElement);
  iconsBoxElement.appendChild(editTaskElement);
  taskTitleElement.appendChild(taskIndexElement);
  taskTitleElement.appendChild(taskTitleTextBoxElement);
  taskTitleBoxElement.appendChild(taskTitleElement);
  taskTitleBoxElement.appendChild(iconsBoxElement);
  taskContainerElement.appendChild(taskTitleBoxElement);
  taskContainerElement.appendChild(taskContentElement);
  
  // إنشاء كائن يحتوي على المهمة
  let taskObject = {
    index: taskIndexVariable,
    taskContainer: {
      element: taskContainerElement,
    },
    taskTitleBox: {
      element: taskTitleBoxElement,
    },
    taskTitle: {
      element: taskTitleElement,
      content: '',
    },
    taskIndex: {
      element: taskIndexElement,
      content: `Task ${taskIndexVariable + 1}: `,
    },
    taskTitleTextBox: {
      element: taskTitleTextBoxElement,
    },
    iconsBox: {
      element: iconsBoxElement,
    },
    doneOrUnDone: {
      element: doneOrUnDoneElement,
      type: 'undone',
      ability: true,
    },
    deleteTask: {
      element: deleteTaskElement,
      ability: true,
    },
    editTask: {
      element: editTaskElement,
      ability: true,
    },
    taskContent: {
      element: taskContentElement,
      content: '',
    },
  }
  tasksCounterVariable++;
  taskIndexVariable++;
  events(taskObject);
  
  // إرجاع قيمة المتغير
  return taskObject;
}

// دالة وضع البيانات داخل المهمة، ووضعها في المصفوفة
function addTaskToTasksJSON (task, type, index) {
  if ((taskTitleInput.value !== '' && taskContentInput.value !== '') || (type === 'storage')) {
    
    // أولًا: تعبئة البيانات في الكائن
    task.taskTitle.content = taskTitleInput.value;
    task.taskContent.content = taskContentInput.value;
    
    // (التعبئة من الخزين)
    if (type === 'storage') {
      task.taskTitle.content = JSON.parse(localStorage.tasks)[index].title;
      task.taskContent.content = JSON.parse(localStorage.tasks)[index].content;
      if (JSON.parse(localStorage.tasks)[index].done) {
        task.doneOrUnDone.type = 'done';
      }
      else {
        task.doneOrUnDone.type = 'undone';
      }
    }
    
    // ثانيًا: تعبئة البيانات داخل العنصر نفسه
    task.taskTitleTextBox.element.textContent = task.taskTitle.content;
    task.taskIndex.element.textContent = task.taskIndex.content;
    task.taskContent.element.textContent = task.taskContent.content;
    
    // ثالثًا: إضاقة الكائن للمصفوفة
    tasks.push(task);
    
    // رابعًا: تحديث البيانات
    updateSeenData();
  }
  else {
    alert('Please Fill The Requied Inputs');
  }
}

// دالة تحديث البيانات المعروضة أو المرئية
function updateSeenData () {
  tasksBox.innerHTML = '';
  cssSet(tasks.length === 0);
  for (let i = 0; i < tasks.length; i++) {
    tasksBox.appendChild(tasks[i].taskContainer.element);
  }
  tasksCounter.textContent = tasksCounterVariable;
  taskTitleInput.value = '';
  taskContentInput.value = '';
  localStorageDataSet();
}

// دالة إتمام المهمة أو إلغاء إتمامها
function doneOrUnDone (task) {
  if (task.doneOrUnDone.ability) {
    if (task.doneOrUnDone.type === 'done') {
      task.doneOrUnDone.type = 'undone';
    }
    else {
      task.doneOrUnDone.type = 'done';
    }
    updateSeenData();
  }
}

// حذف مهمة
function deleteTask (index) {
  if (tasks[index].deleteTask.ability) {
    tasks.splice(index, 1);
    for (let i = 0; i < tasks.length; i++) {
      tasks[i].index = i;
      tasks[i].taskIndex.content = `Task ${i + 1}: `;
      tasks[i].taskIndex.element.textContent = tasks[i].taskIndex.content;
      tasks[i].taskContent.element.textContent = tasks[i].taskContent.content;
    }
    tasksCounterVariable = tasks.length;
    taskIndexVariable = tasks.length;
    updateSeenData();
  }
}

// دالة تعديل مهمة ما (تهيئة)
function editTask (index) {
  if (tasks[index].editTask.ability) {
    
    // تغيير نوع العملية
    submitType = 'edit';
    
    // تجميد قابلية تعديل أي مهمة
    for (let task of tasks) {
      task.doneOrUnDone.ability = false;
      task.deleteTask.ability = false;
      task.editTask.ability = false;
    }
    
    // إرجاع المحتوى لحقول الإدخال
    taskTitleInput.value = tasks[index].taskTitle.content;
    taskContentInput.value = tasks[index].taskContent.content;
    
    // عرض المهمة فقط للمستخدم
    tasksBox.innerHTML = '';
    tasksBox.appendChild(tasks[index].taskContainer.element);
  }
  else {
    
    // تغيير نوع العملية
    submitType = 'create';
    
    // تفعيل قابلية تعديل أي مهمة
    for (let task of tasks) {
      task.doneOrUnDone.ability = true;
      task.deleteTask.ability = true;
      task.editTask.ability = true;
    }
    
    // تفريغ حقول الإدخال
    taskTitleInput.value = '';
    taskContentInput.value = '';
    
    // عرض جميع المهمات للمستخدم
    updateSeenData();
  }
  editingTaskIndex = index;
}

// إرسال التعديل للمصفوفة
function submitEditTask (index) {
  if (taskTitleInput.value !== '' && taskContentInput.value !== '') {
    tasks[index].taskTitle.content = taskTitleInput.value
    tasks[index].taskContent.content = taskContentInput.value;
    tasks[index].taskTitleTextBox.element.textContent = tasks[index].taskTitle.content;
    tasks[index].taskContent.element.textContent = tasks[index].taskContent.content;
    editTask(index);
  }
  else {
    alert('Please Fill The Requied Inputs')
  }
}

// دالة زر الإرسال
function submit () {
  if (submitType === 'create') {
    addTaskToTasksJSON(createNewTaskObject());
  }
  else {
    submitEditTask(editingTaskIndex);
  }
  localStorageDataSet();
}

// البحث عن المهمات
function searchTasks (type) {
  let doneTasks = [];
  let undoneTasks = [];
  for (let task of tasks) {
    if (task.doneOrUnDone.type === 'done') {
      doneTasks.push(task);
    }
    else {
      undoneTasks.push(task);
    }
  }
  if (type === 'done') {
    tasksBox.innerHTML = '';
    cssSet (doneTasks.length === 0);
    for (let doneTask of doneTasks) {
      tasksBox.appendChild(doneTask.taskContainer.element);
    }
    tasksCounter.textContent = doneTasks.length;
  }
  else {
    tasksBox.innerHTML = '';
    cssSet (undoneTasks.length === 0);
    for (let undoneTask of undoneTasks) {
      tasksBox.appendChild(undoneTask.taskContainer.element);
    }
    tasksCounter.textContent = undoneTasks.length;
  }
}

// دالة التنسيق
function cssSet (check) {
  if (check) {
    document.getElementById('tasks').style.borderRadius = '0';
    document.getElementById('tasks').style.borderBottom = 'none';
  }
  else {
    document.getElementById('tasks').style.borderRadius = '0 0 35px 35px';
    document.getElementById('tasks').style.borderBottom = '2px solid black';
  }
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].doneOrUnDone.type === 'done') {
      tasks[i].taskTitleBox.element.classList.add('done-task-title-box');
      tasks[i].taskContent.element.classList.add('done-task-content');
      tasks[i].doneOrUnDone.element.classList.add('bi-x-circle');
      tasks[i].doneOrUnDone.element.classList.remove('bi-check-circle');
    }
    else {
      tasks[i].taskTitleBox.element.classList.remove('done-task-title-box');
      tasks[i].taskContent.element.classList.remove('done-task-content');
      tasks[i].doneOrUnDone.element.classList.remove('bi-x-circle');
      tasks[i].doneOrUnDone.element.classList.add('bi-check-circle')
    }
  }
}

// دالة تخزين البيانات في المتصفح
function localStorageDataSet() {
  storageData = [];
  for (let task of tasks) {
    storageData.push({
      title: task.taskTitle.content,
      content: task.taskContent.content,
      done: task.doneOrUnDone.type==='done'
    });
  }
  localStorage.tasks = JSON.stringify(storageData);
}

// دالة إرجاع البيانات من تخزين المتصفح
function localStorageDataGet () {
  if (localStorage.tasks !== undefined && localStorage.tasks.length > 4) {
    storageData = JSON.parse(localStorage.tasks);
    for (let i = 0; i < storageData.length; i++) {
      addTaskToTasksJSON(createNewTaskObject(), 'storage', i);
    }
  }
}

// دالة الأحداث المراد تجديدها
function events (task) {
  task.doneOrUnDone.element.addEventListener('click', _ => doneOrUnDone(task));
  task.deleteTask.element.addEventListener('click', _ => deleteTask(task.index));
  task.editTask.element.addEventListener('click', _ => editTask(task.index));
}

// الأحداث الدائمة
function constantEvents () {
  taskSubmitButton.addEventListener('click', _ => submit());
  getAllTasks.addEventListener('click', _ => updateSeenData());
  getDoneTasks.addEventListener('click', _ => searchTasks('done'));
  getUndoneTasks.addEventListener('click', _ => searchTasks('undone'));
  window.addEventListener('load', _ => {
    localStorageDataGet();
    cssSet(tasks.length === 0);
  });
}
constantEvents();