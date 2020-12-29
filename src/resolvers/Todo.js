const Todo = {
    tasks(parent, args, {db}, info){
        return db.Tasks.filter((task)=>{
            return task.title === parent.id;
        });
    }
}

export {Todo as default};