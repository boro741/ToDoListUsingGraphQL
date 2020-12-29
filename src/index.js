import {GraphQLServer} from 'graphql-yoga';
import uuidv4 from "uuid/v4";
// DB
let Todos = [{
    id: '1',
    title: "Learn DS",
},
{
    id: '2',
    title: "Prepare resume",
},
{
    id: '3',
    title: "Learn Science",
},
];

let Tasks = [
{
    id: '1',
    task:[
        "1. Arrays",
        "2. Trees",
        "3. Dynamic Programming"
    ],
    title: '1'
},
{
    id: '2',
    task:[
        "1. Prepare resume for Amazon",
        "2. Prepare resume for Flipkart"
    ],
    title: '2'
},
{
    id: '3',
    task:[
        "1. Learn Thermodynamics",
        "2. Learn Electrostatics"
    ],
    title: '3'
}
];

// Having difficulty in writing mutation in schema when there are association between object properties
const typeDefs = `
    type Query{
        todo(title: String): [Todo!]!
        task(title: String): [Task!]!
    }

    type Mutation {
        createTodoList(data: createTodoListInput!): Todo!
        addTaskTodoList(data: addTaskTodoListInput!): Task!
        updateTodoListTitle(data: updateTodoListTitleInput!): Todo!
        updateTaskTodoList(data: updateTaskTodoListInput!): Task!
        deleteTodoList(id: ID!): Todo!
    }

    input createTodoListInput{
        title: String!
    }

    input addTaskTodoListInput{
        title: String! 
        tasks: [String!]!
    }

    input updateTodoListTitleInput{
        id: ID!
        title: String!
    }

    input updateTaskTodoListInput{
        title: String!
        taskIndex: Int!
        task: String!
    }

    type Todo {
        id: ID!
        title: String!
        tasks: [Task!]!
    }

    type Task {
        id: ID!
        task: [String!]!
        title: Todo!
    }
`;


const resolvers  = {
    Query: {
        todo(parent, args, ctx, info){
            if(args.title == null) 
                return Todos;

            return Todos.filter((todo)=>{
                return todo.title.toLowerCase().includes(args.title.toLowerCase());
            });
        },
        task(parent, args, ctx, info){
            if(args.title == null){
                return Tasks;
            }

            return Tasks.filter((task) => {
                return Todos.find((todo) => todo.id === task.title).title.toLowerCase().includes(args.title.toLowerCase());
            });
        }
    },
    Mutation: {
        createTodoList(parent, args, ctx, info){
            const titleTaken = Todos.some((todo)=>{
                return todo.title === args.data.title;
            });

            if(titleTaken){
                throw new Error(`Title with "${args.data.title}" already exists.`);
            }

            const todo = {
                id: uuidv4(),
                title: args.data.title
            }

            Todos.push(todo);

            return todo;
        },
        addTaskTodoList(parent, args, ctx, info){
            // Is Todo List exist with given title of Task Obj
            const todoListExist = Todos.some((todo)=>{
                return todo.id === args.data.title;
            });

            if(!todoListExist)
                throw new Error(`Todo List with "${args.data.title}" does not exists.`);
            
            const task = {
                id: uuidv4(),
                task: args.data.tasks,
                title: args.data.title
            };
            
            Tasks.push(task);
            return task;
        },
        updateTodoListTitle(parent, args, ctx, info){
            // Is todoList exist in Todo obj
            const todoList = Todos.find((todo)=>{
                // Is (Inside Task Obj) args.id: "some id" exists in Todo DB?
                return todo.id === args.data.id;
            });

            if(!todoList)
                throw new Error(`Todo List with "${args.data.title}" does not exists.`);
            
            todoList.title = args.data.title;

            return todoList;
        },

        updateTaskTodoList(parent, args, ctx, info){
            const taskList = Tasks.find((task)=>{
                return task.title === args.data.title;
            });

            if(!taskList)
                throw new Error(`Todo List with "${args.data.title}" does not exists.`);

            taskList.task[args.data.taskIndex] = args.data.task;

            return taskList;
        },
        deleteTodoList(parent, args, ctx, info){
            const todoListIndex = Todos.findIndex((todo)=>{
                return todo.id === args.id;
            });

            if(todoListIndex === -1){
                throw new Error("Todo list not found");
            }

            const deleteTodoList = Todos.splice(todoListIndex,1);

            // Now delete associated todo list task
            Tasks = Tasks.filter((task)=>{
                    return task.title !== args.id;
            });

            console.log(deleteTodoList);
            return deleteTodoList[0];
        }
    },

    Task: {
        title(parent, args, ctx, info) {
            // Here parent is Task Object
            return Todos.find((todo) => {
                return todo.id === parent.title;
            });
        }
        
    },

    Todo: {
        tasks(parent, args, ctx, info){
            return Tasks.filter((task)=>{
                return task.title === parent.id;
            });
        }
    }
};


const server = new GraphQLServer({
    typeDefs,
    resolvers
});


server.start(()=>{
    console.log("The server is up");
});