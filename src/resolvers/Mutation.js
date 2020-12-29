import uuidv4 from "uuid/v4";

const Mutation = {
    createTodoList(parent, args, {db}, info){
        const titleTaken = db.Todos.some((todo)=>{
            return todo.title === args.data.title;
        });

        if(titleTaken){
            throw new Error(`Title with "${args.data.title}" already exists.`);
        }

        const todo = {
            id: uuidv4(),
            title: args.data.title
        }

        db.Todos.push(todo);

        return todo;
    },
    addTaskTodoList(parent, args, {db}, info){
        // Is Todo List exist with given title of Task Obj
        const todoListExist = db.Todos.some((todo)=>{
            return todo.id === args.data.title;
        });

        if(!todoListExist)
            throw new Error(`Todo List with "${args.data.title}" does not exists.`);
        
        const task = {
            id: uuidv4(),
            task: args.data.tasks,
            title: args.data.title
        };
        
        db.Tasks.push(task);
        return task;
    },
    updateTodoListTitle(parent, args, {db}, info){
        // Is todoList exist in Todo obj
        const todoList = db.Todos.find((todo)=>{
            // Is (Inside Task Obj) args.id: "some id" exists in Todo DB?
            return todo.id === args.data.id;
        });

        if(!todoList)
            throw new Error(`Todo List with "${args.data.title}" does not exists.`);
        
        todoList.title = args.data.title;

        return todoList;
    },

    updateTaskTodoList(parent, args, {db}, info){
        const taskList = db.Tasks.find((task)=>{
            return task.title === args.data.title;
        });

        if(!taskList)
            throw new Error(`Todo List with "${args.data.title}" does not exists.`);

        taskList.task[args.data.taskIndex] = args.data.task;

        return taskList;
    },
    deleteTodoList(parent, args, {db}, info){
        const todoListIndex = db.Todos.findIndex((todo)=>{
            return todo.id === args.id;
        });

        if(todoListIndex === -1){
            throw new Error("Todo list not found");
        }

        const deleteTodoList = Todos.splice(todoListIndex,1);
        // Now delete associated todo list task
        db.Tasks = db.Tasks.filter((task)=>{
                return task.title !== args.id;
        });

        return deleteTodoList[0];
    },
    deleteTask(parent, args, {db}, info){
        const taskList = db.Tasks.find((task)=>{
            return task.id === args.id;
        });

        if(!taskList){
            throw new Error("Task not found");
        }

        taskList.task.splice(args.taskIndex,1);
        
        return taskList;
    }
}


export {Mutation as default};