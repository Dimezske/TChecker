class TodoManager {
    constructor(storageKey = "todos") {
        this.storageKey = storageKey;
        this.todos = [];
        this.load();
    }

    load() {
        try {
            const data = localStorage.getItem(this.storageKey);
            this.todos = data ? JSON.parse(data) : [];
        } catch (err) {
            console.warn("Failed to load todos, resetting storage.", err);
            this.todos = [];
        }
    }

    save() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.todos));
    }

    addTodo(title, notes = "", priority = "Medium", commands = "") {
        const todo = {
            id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
            title,
            notes,
            commands,
            priority,
            completed: false,
            created: new Date().toISOString(),
            completedDate: null
        };

        this.todos.push(todo);
        this.save();
    }

    removeTodo(id) {
        this.todos = this.todos.filter(t => t.id !== id);
        this.save();
    }

    toggleComplete(id) {
        const todo = this.todos.find(t => t.id === id);
        if (!todo) return;

        todo.completed = !todo.completed;
        todo.completedDate = todo.completed
            ? new Date().toISOString()
            : null;

        this.save();
    }

    // -------------------------
    // EDIT
    // -------------------------
    updateTodo(id, data) {
        const todo = this.todos.find(t => t.id === id);
        if (!todo) return;

        Object.assign(todo, {
            title: data.title ?? todo.title,
            notes: data.notes ?? todo.notes,
            priority: data.priority ?? todo.priority,
            commands: data.commands ?? todo.commands
        });

        this.save();
    }

    getTodos() {
        return [...this.todos];
    }

    search(query = "") {
        query = query.toLowerCase();

        return this.todos.filter(t =>
            t.title.toLowerCase().includes(query) ||
            t.notes.toLowerCase().includes(query) ||
            (t.commands || "").toLowerCase().includes(query)
        );
    }
}

const todoManager = new TodoManager();