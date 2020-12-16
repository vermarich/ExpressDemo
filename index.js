const express = require('express')
const bodyParser = require('body-parser')
const Joi = require('joi')

const app = express()
app.use(bodyParser.json());

const courses = [
    { id: 1, name: 'course1'},
    { id: 2, name: 'course2'},
    { id: 3, name: 'course3'}
];

console.log("courses ", courses);

app.get('/',(req,res) => {
    res.send('Hello World');
})

app.get('/api/courses', (req,res) => {
    res.send(courses)
} )

app.get('/api/courses/:id', (req,res) => {
    let course =  courses.find(c => c.id === parseInt(req.params.id));
    if(!course) res.status(404).send("Course with the given id was not found") //404 
    res.status(200).send(course);
})

app.post('/api/courses', (req,res) => {
    const { error } = validateCourse(req.body);

    if(error){
        res.status(400).send(error.details[0].message)
        return;
    }
    console.log("name of the course is ", req.body)
    let course = {
        id: courses.length + 1,
        name: req.body.name
    }
    courses.push(course);
    console.log("Course array ", courses)
    res.status(200).send(course);
})

app.put('/api/courses/:id', (req,res) => {
    let course = courses.find((ele) => ele.id === parseInt(req.params.id))
    if(!course){
        res.status(400).send("Course not found")
        return
    }
    
    const { error } = validateCourse(req.body);

    if(error){
        res.status(400).send(error.details[0].message)
        return;
    }
    course.name = req.body.name;
    res.send(course);

})

app.delete('/api/courses/:id', (req,res) => {
    let course = courses.find((ele) => ele.id === parseInt(req.params.id))
    if(!course){
        res.status(400).send("Course not found")
        return
    }

    var index = courses.indexOf(course);
    courses.splice(index,1);

    res.send(courses);
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port} `)
})

function validateCourse(course) {

    const schema = {
        name: Joi.string().min(3).required()
    }
    
    return Joi.validate(course, schema);

}