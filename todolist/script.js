
        // DOM Elements
        const taskForm = document.getElementById("task-form");
        const taskInput = document.getElementById("task-input");
        const taskCategory = document.getElementById("task-category");
        const taskDue = document.getElementById("task-due");
        const taskPriority = document.getElementById("task-priority");
        const taskList = document.getElementById("task-list");
        const filterButtons = document.querySelectorAll(".filter-btn");

        // Initialize SortableJS for drag-and-drop
        const sortable = new Sortable(taskList, {
            animation: 150,
            handle: ".drag-handle",
            ghostClass: "sortable-ghost",
            chosenClass: "sortable-chosen",
            onEnd: updateTaskOrder
        });

        // Current filter
        let currentFilter = "all";

        // Load tasks from localStorage
        document.addEventListener("DOMContentLoaded", () => {
            const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
            tasks.forEach(task => addTaskToDOM(task));
            applyFilter(currentFilter);
        });

        // Add new task
        taskForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const taskText = taskInput.value.trim();
            if (taskText) {
                const task = {
                    id: Date.now(),
                    text: taskText,
                    category: taskCategory.value,
                    due: taskDue.value,
                    priority: taskPriority.value,
                    completed: false,
                    createdAt: new Date().toISOString()
                };
                addTaskToDOM(task);
                saveTaskToLocalStorage(task);
                resetForm();
            }
        });

        // Reset form after submission
        function resetForm() {
            taskInput.value = "";
            taskDue.value = "";
            taskPriority.value = "medium";
            taskInput.focus();
        }

        // Add task to DOM
        function addTaskToDOM(task) {
            const taskItem = document.createElement("li");
            taskItem.className = `task-item ${task.completed ? "completed" : ""}`;
            taskItem.setAttribute("data-id", task.id);
            taskItem.setAttribute("data-category", task.category);
            taskItem.setAttribute("data-priority", task.priority);
            
            const dueDate = task.due ? new Date(task.due).toLocaleDateString() : "No deadline";
            
            taskItem.innerHTML = `
                <span class="category-badge">${getCategoryName(task.category)}</span>
                <i class="fas fa-grip-lines drag-handle"></i>
                <div class="task-content">
                    <div class="task-text">${task.text}</div>
                    <div class="task-due">
                        <i class="far fa-calendar-alt"></i>
                        ${dueDate}
                    </div>
                </div>
                <div class="task-actions">
                    <button class="complete-btn"><i class="fas fa-check"></i></button>
                    <button class="edit-btn"><i class="fas fa-edit"></i></button>
                    <button class="delete-btn"><i class="fas fa-trash"></i></button>
                </div>
            `;
            
            taskList.appendChild(taskItem);

            // Add event listeners
            taskItem.querySelector(".complete-btn").addEventListener("click", toggleTask);
            taskItem.querySelector(".edit-btn").addEventListener("click", editTask);
            taskItem.querySelector(".delete-btn").addEventListener("click", deleteTask);
        }

        // Get category display name
        function getCategoryName(category) {
            const names = {
                work: "💼 Work",
                personal: "👨‍💻 Personal",
                health: "🏥 Health",
                shopping: "🛒 Shopping"
            };
            return names[category] || category;
        }

        // Toggle task completion
        function toggleTask(e) {
            const taskItem = e.target.closest(".task-item");
            taskItem.classList.toggle("completed");
            const taskId = parseInt(taskItem.getAttribute("data-id"));
            
            // Update localStorage
            const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
            const taskIndex = tasks.findIndex(t => t.id === taskId);
            if (taskIndex > -1) {
                tasks[taskIndex].completed = taskItem.classList.contains("completed");
                localStorage.setItem("tasks", JSON.stringify(tasks));
            }
        }

        // Edit task
        function editTask(e) {
            const taskItem = e.target.closest(".task-item");
            const taskId = parseInt(taskItem.getAttribute("data-id"));
            const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
            const task = tasks.find(t => t.id === taskId);
            
            if (task) {
                const newText = prompt("Edit task:", task.text);
                if (newText && newText.trim()) {
                    task.text = newText.trim();
                    localStorage.setItem("tasks", JSON.stringify(tasks));
                    taskItem.querySelector(".task-text").textContent = newText.trim();
                }
            }
        }

        // Delete task
        function deleteTask(e) {
            if (confirm("Delete this task permanently?")) {
                const taskItem = e.target.closest(".task-item");
                const taskId = parseInt(taskItem.getAttribute("data-id"));
                taskItem.classList.add("fade-out");
                setTimeout(() => {
                    taskItem.remove();
                    removeTaskFromLocalStorage(taskId);
                }, 300);
            }
        }

        // Filter tasks
        filterButtons.forEach(button => {
            button.addEventListener("click", () => {
                filterButtons.forEach(btn => btn.classList.remove("active"));
                button.classList.add("active");
                currentFilter = button.getAttribute("data-filter");
                applyFilter(currentFilter);
            });
        });

        // Apply filter
        function applyFilter(filter) {
            const tasks = document.querySelectorAll(".task-item");
            tasks.forEach(task => {
                if (filter === "all" || task.getAttribute("data-category") === filter) {
                    task.style.display = "flex";
                } else {
                    task.style.display = "none";
                }
            });
        }

        // Update task order after drag-and-drop
        function updateTaskOrder() {
            const tasks = [];
            document.querySelectorAll(".task-item").forEach(item => {
                const taskId = parseInt(item.getAttribute("data-id"));
                const taskText = item.querySelector(".task-text").textContent;
                const completed = item.classList.contains("completed");
                const category = item.getAttribute("data-category");
                const priority = item.getAttribute("data-priority");
                const due = item.querySelector(".task-due").textContent.replace("No deadline", "").trim();
                
                tasks.push({ 
                    id: taskId, 
                    text: taskText, 
                    completed, 
                    category, 
                    priority, 
                    due 
                });
            });
            localStorage.setItem("tasks", JSON.stringify(tasks));
        }

        // LocalStorage Functions
        function saveTaskToLocalStorage(task) {
            const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
            tasks.push(task);
            localStorage.setItem("tasks", JSON.stringify(tasks));
        }

        function removeTaskFromLocalStorage(taskId) {
            let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
            tasks = tasks.filter(task => task.id !== taskId);
            localStorage.setItem("tasks", JSON.stringify(tasks));
        }