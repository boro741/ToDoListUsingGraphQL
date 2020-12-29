import {GraphQLServer} from 'graphql-yoga';
import db from './db';
import Query from './resolvers/Query';
import Mutation from './resolvers/Mutation';
import Task from './resolvers/Task';
import Todo from './resolvers/Todo';


const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers:{
        Query,
        Mutation,
        Task,
        Todo
    },
    context: {
        db
    }
});


server.start(()=>{
    console.log("The server is up");
});