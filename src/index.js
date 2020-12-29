import {GraphQLServer} from 'graphql-yoga';

// Having difficulty in implementing schema and resolvers
// 1. Is for every schema I need to implement resolver? YES
// 2. What to define inside Query in schema?            things you want to query
// 3. What to implement inside Query in resolver?       things you've declared inside query schema   
// 4. What to define outside Query in schema?           custom object types 
// 5. What to implement outside Query in resolver?      Associating a relationships between objects
// 6. How to associate One object with another?         using a property of parent object and define outside Query in resolvers  

// DB
const Todos = [{
    id: 1,
    title: "Learn DS",
},
{
    id: 2,
    title: "Prepare resume",
},
{
    id: 3,
    title: "Learn Science",
},
];

const Tasks = [
{
    id: 1,
    task:[
        "1. Arrays",
        "2. Trees",
        "3. Dynamic Programming"
    ],
    title: 1
},
{
    id: 2,
    task:[
        "1. Prepare resume for Amazon",
        "2. Prepare resume for Flipkart"
    ],
    title: 2
},
{
    id: 3,
    task:[
        "1. Learn Thermodynamics",
        "2. Learn Electrostatics"
    ],
    title: 3
}
];


const typeDefs = `
    type Query{
        todo: [Todo!]!
        task(title: String): [Task!]!
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
        todo(){
            return Todos;
        },
        task(parent, args, ctx, info){
            if(args.title == null){
                return Tasks;
            }

            // Had difficulty in retrieving property of another object using foreign key
            return Tasks.filter((task) => {
                return Todos.find((todo) => todo.id === task.title).title.toLowerCase().includes(args.title.toLowerCase());
            });
        }
    },

    // Associating between Task title with Parent Object (Todo) title   
    Task: {
        title(parent, args, ctx, info) {
            return Todos.find((todo) => {
                return todo.id == parent.id;
            });
        }
        
    },

    // Associating between Task task property with Parent Object (Task) task prpoerty
    Todo: {
        tasks(parent, args, ctx, info){
            return Tasks.filter((task)=>{
                return task.title == parent.id;
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