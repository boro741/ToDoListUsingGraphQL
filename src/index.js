import {GraphQLServer} from 'graphql-yoga';
import uuidv4 from "uuid/v4";
// DB
const Todos = [{
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

const Tasks = [
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
        createTodoList(title: String!): Todo!
        addTaskTodoList(title: String! ,tasks: [String!]!): Task!
    }

    type Todo {
        id: ID!
        title: String!
        tasks: [Task]
    }

    type Task {
        id: ID!
        task: [String!]!
        title: Todo
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
                return todo.title === args.title;
            });

            if(titleTaken){
                throw new Error(`Title with "${args.title}" already exists.`);
            }

            const todo = {
                id: uuidv4(),
                title: args.title
            }

            Todos.push(todo);

            return todo;
        },
        addTaskTodoList(parent, args, ctx, info){
            const todoListExist = Todos.some((todo)=>{
                return todo.id === args.title;
            });

            if(!todoListExist)
                throw new Error(`Todo List with "${args.title}" does not exists.`);
            
            const task = {
                id: uuidv4(),
                task: args.tasks,
                title: args.title
            };
            
            Tasks.push(task);
            return task;
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