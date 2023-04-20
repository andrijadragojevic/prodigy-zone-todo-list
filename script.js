var tasks = [];
var filteredTasks = [];
var taskId = 0;
const today = new Date();
const todayString = `${today.getFullYear()}-${today.getMonth()+1<10 ? '0'+(today.getMonth()+1) : today.getMonth()+1}-${today.getDate()}`;

resetForm();

function saveTask(){
    let taskName = document.getElementById('taskName').value;
    let taskDeadline = document.getElementById('taskDeadline').value;
    let taskPriority = document.getElementById('taskPriority').value;

    tasks.push({
        id : taskId,
        name: taskName,
        deadline: taskDeadline,
        priority: taskPriority,
        isDone: false
    });
    taskId ++;
    resetForm();
    displayTable();
}

function resetForm(){
    let taskInputs = document.querySelectorAll('.task-input');
    taskInputs.forEach(function(input){
        input.value = '';
    });
    filteredTasks = [];
    document.getElementById("taskDeadline").value = todayString;
}

function markTask(index){
    tasks.find(task => task.id == index).isDone = !tasks.find(task => task.id == index).isDone;

    filteredTasks.length == 0 ? displayTable() : displayFilteredTasks();
}

function attachListeners(){
    document.querySelectorAll('.finish-chk').forEach(function(chk){
        chk.addEventListener('change', function(e){
            markTask(e.target.value);
        });
    });
}

function displayTable(){
    let tableRows = "";
    tasks.forEach( (task) => {
        let checkedAttr = '';
        let finishedClass = '';
        if(task.isDone){
            checkedAttr = 'checked';
            finishedClass = 'finished-task';
        };

        let newRow = '<tr id="task'+task.id+'" class="'+finishedClass+'" >'
                        + '<td> <input type="checkbox" '+checkedAttr+' class="finish-chk" value="'+task.id+'"> </td>'
                        + '<td>'+ task.name + '</td>'
                        + '<td>'+ task.deadline +'</td>'
                        + '<td>'+ task.priority +'</td>'
                + '</tr>';
        tableRows += newRow;
    });
    document.getElementById("tasksTableBody").innerHTML = tableRows;
    attachListeners();
}

document.getElementById('saveBtn').addEventListener('click', (e) => {
    saveTask();
});

function displayFilteredTasks() {
    let tableRows = "";
    filteredTasks.forEach( (filteredTask, index) => {
        let checkedAttr = '';
        let finishedClass = '';
        if(filteredTask.isDone){
            checkedAttr = 'checked';
            finishedClass = 'finished-task';
        };

        let newRow = '<tr id="task'+filteredTask.id+'" class="'+finishedClass+'" >'
                        + '<td> <input type="checkbox" '+checkedAttr+' class="finish-chk" value="'+filteredTask.id+'"> </td>'
                        + '<td>'+ filteredTask.name + '</td>'
                        + '<td>'+ filteredTask.deadline +'</td>'
                        + '<td>'+ filteredTask.priority +'</td>'
                + '</tr>';
        tableRows += newRow;
    });
    document.getElementById("tasksTableBody").innerHTML = tableRows;
    attachListeners();
}


document.getElementById("filter-input").addEventListener('input', () => {
    filteredTasks = [];
    
    let filter_name = document.getElementById("filter-taskName").value;
    let filter_date_from = document.getElementById("filter-taskDeadline-from").value;
    let filter_date_to = document.getElementById("filter-taskDeadline-to").value;

    if(filter_name != '' && filter_date_from != '' && filter_date_to != '') {
        filterByName(tasks);
        filterByDate(filteredTasks);
        displayFilteredTasks()
    }
    else if(filter_name != '' && filter_date_from == '' && filter_date_to == '') {
        filterByName(tasks);
        displayFilteredTasks()
    }
    else if(filter_name == '' && filter_date_from != '' && filter_date_to != '') {
        filterByDate(tasks);
        displayFilteredTasks()
    }
    else if(filter_name == '' && filter_date_from == '' && filter_date_to == ''){
        displayTable();
    }

})


function filterByName(list) {
    list.forEach(task => {
        let indexOfSubstring = task.name.indexOf(document.getElementById("filter-taskName").value);
        if(indexOfSubstring != -1) {
            !filteredTasks.includes(task) ? filteredTasks.push(task) : null;
        }
    })
}

function filterByDate(list) {
    let date_from = document.getElementById("filter-taskDeadline-from").value;
    date_from = date_from.split("-");
    date_from = new Date(date_from[0], date_from[1]-1, date_from[2]);

    let date_to = document.getElementById("filter-taskDeadline-to").value;
    date_to = date_to.split("-");
    date_to = new Date(date_to[0], date_to[1]-1, date_to[2]);

    list.forEach(task => {
        let taskDate = task.deadline;
        taskDate = taskDate.split("-");
        taskDate = new Date(taskDate[0], taskDate[1]-1, taskDate[2]);

        if(taskDate >= date_from && taskDate <= date_to) {
            !filteredTasks.includes(task) ? filteredTasks.push(task) : null;
        } else {
            filteredTasks.includes(task) ? filteredTasks.splice(filteredTasks.indexOf(task)) : null;
        }
    })
}

document.getElementById("btn-reset-date").addEventListener('click', () => {
    document.getElementById("filter-taskDeadline-from").value = '';
    document.getElementById("filter-taskDeadline-to").value = '';
    filteredTasks = [];
    filterByName();
    filteredTasks.length == 0 ? displayTable() : displayFilteredTasks()
})