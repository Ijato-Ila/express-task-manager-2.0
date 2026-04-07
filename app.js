// app.js 
// Improved Task Manager Web App (Module 2)
// Author: Ijato Precious-jane Okpen

const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

// Set EJS as view engine
app.set('view engine', 'ejs');

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Store tasks
let tasks = [];

/**
 * Recursively count completed tasks
 * This satisfies the RECURSION requirement
 */
function countCompleted(tasksArray, index = 0) {
    if (index >= tasksArray.length) return 0;

    return (tasksArray[index].completed ? 1 : 0) + 
           countCompleted(tasksArray, index + 1);
}

/**
 * Load tasks safely from JSON file
 * Demonstrates exception handling
 */
function loadTasks() {
    try {
        if (fs.existsSync('tasks.json')) {
            const data = fs.readFileSync('tasks.json');
            tasks = JSON.parse(data);
        }
    } catch (error) {
        console.error("Error loading tasks:", error.message);
        tasks = [];
    }
}

/**
 * Save tasks to file with error handling
 */
function saveTasks() {
    try {
        fs.writeFileSync('tasks.json', JSON.stringify(tasks, null, 2));
    } catch (error) {
        console.error("Error saving tasks:", error.message);
    }
}

// Load tasks when app starts
loadTasks();

/**
 * Home route
 * Uses ES6 array functions (filter, map)
 */
app.get('/', (req, res) => {
    const totalTasks = tasks.length;

    // ES6 filter
    const completedTasks = tasks.filter(task => task.completed).length;

    // Recursion used here
    const completedByRecursion = countCompleted(tasks);

    res.render('index', {
        tasks,
        totalTasks,
        completedTasks,
        completedByRecursion
    });
});

/**
 * Add new task
 */
app.post('/add', (req, res) => {
    try {
        const { task, dueDate } = req.body;

        if (!task) {
            throw new Error("Task description is required");
        }

        tasks.push({
            description: task,
            completed: false,
            dueDate: dueDate || "No date"
        });

        saveTasks();
    } catch (error) {
        console.error("Error adding task:", error.message);
    }

    res.redirect('/');
});

/**
 * Delete task
 */
app.get('/delete/:index', (req, res) => {
    try {
        const index = parseInt(req.params.index);

        if (index >= 0 && index < tasks.length) {
            tasks.splice(index, 1);
            saveTasks();
        } else {
            throw new Error("Invalid task index");
        }
    } catch (error) {
        console.error("Delete error:", error.message);
    }

    res.redirect('/');
});

/**
 * Mark task as completed
 */
app.get('/complete/:index', (req, res) => {
    try {
        const index = parseInt(req.params.index);

        if (index >= 0 && index < tasks.length) {
            tasks[index].completed = true;
            saveTasks();
        } else {
            throw new Error("Invalid task index");
        }
    } catch (error) {
        console.error("Complete error:", error.message);
    }

    res.redirect('/');
});

/**
 * Edit task
 */
app.post('/edit/:index', (req, res) => {
    try {
        const index = parseInt(req.params.index);

        if (index >= 0 && index < tasks.length) {
            tasks[index].description = req.body.task;
            tasks[index].dueDate = req.body.dueDate;
            saveTasks();
        } else {
            throw new Error("Invalid task index");
        }
    } catch (error) {
        console.error("Edit error:", error.message);
    }

    res.redirect('/');
});

// Start server
app.listen(port, () => {
    console.log(`Task Manager running at http://localhost:${port}`);
});