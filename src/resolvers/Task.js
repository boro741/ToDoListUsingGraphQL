const Task = {
    title(parent, args, {db}, info) {
        // Here parent is Task Object
        return db.Todos.find((todo) => {
            return todo.id === parent.title;
        });
    }
    
}

export {Task as default};