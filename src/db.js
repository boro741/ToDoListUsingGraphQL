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

const db = {
    Todos,
    Tasks
};

export {db as default};