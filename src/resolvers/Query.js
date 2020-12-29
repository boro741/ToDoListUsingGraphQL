const Query = {
    todo(parent, args, {db}, info){
        if(args.title == null) 
            return db.Todos;

        return Todos.filter((todo)=>{
            return todo.title.toLowerCase().includes(args.title.toLowerCase());
        });
    },
    task(parent, args, {db}, info){
        if(args.title == null){
            return db.Tasks;
        }

        return db.Tasks.filter((task) => {
            return db.Todos.find((todo) => todo.id === task.title).title.toLowerCase().includes(args.title.toLowerCase());
        });
    }
}

export {Query as default};