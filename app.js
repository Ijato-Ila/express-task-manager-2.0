// app.js 
// Improved Task Manager Web App (Module 2)
// Author: Ijato Precious-jane Okpen

const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

// Set EJS
app.set('view engine', 'ejs');

// Middleware
app.use(express.urlencoded({ extended: true }));

// Store tasks
let tasks = [];

// Load tasks from file
if (fs.existsSync('tasks.json')) {
    const data = fs.readFileSync('tasks.json');
    tasks = JSON.parse(data);
}

// Save tasks to file
function saveTasks() {
    fs.writeFileSync('tasks.json', JSON.stringify(tasks, null, 2));
}

// Home route
app.get('/', (req, res) => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;

    res.render('index', {
        tasks,
        totalTasks,
        completedTasks
    });
});

// Add new task (with due date)
app.post('/add', (req, res) => {
    const taskDescription = req.body.task;
    const dueDate = req.body.dueDate;

    tasks.push({
        description: taskDescription,
        completed: false,
        dueDate: dueDate
    });

    saveTasks();
    res.redirect('/');
});

// Delete a task
app.get('/delete/:index', (req, res) => {
    const index = req.params.index;

    if (index >= 0 && index < tasks.length) {
        tasks.splice(index, 1);
        saveTasks();
    }

    res.redirect('/');
});

// Mark task as completed
app.get('/complete/:index', (req, res) => {
    const index = req.params.index;

    if (index >= 0 && index < tasks.length) {
        tasks[index].completed = true;
        saveTasks();
    }

    res.redirect('/');
});

// Edit task
app.post('/edit/:index', (req, res) => {
    const index = req.params.index;

    if (index >= 0 && index < tasks.length) {
        tasks[index].description = req.body.task;
        tasks[index].dueDate = req.body.dueDate;
        saveTasks();
    }

    res.redirect('/');
});

// Start server
app.listen(port, () => {
    console.log(`Task Manager running at http://localhost:${port}`);
});