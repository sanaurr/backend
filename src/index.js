const express = require('express');
const cors = require('cors');
const fs = require('fs');
 

const app = express();
const port = 3002;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

const ROOT_DIR = "C:\\Users\\user\\Desktop\\react-note\\backend\\database\\"
//signup
app.get('/user/signup/:username/:password', (req, res) =>{
    const username = req.params.username;
    const password = req.params.password;

    var users = [];
    try {
        const jsonData = fs.readFileSync(ROOT_DIR+"users.json", 'utf-8');
        users = JSON.parse(jsonData);
    } catch (error) {
        console.error('Error reading or parsing JSON file:',error);
    }

    for (var i =0; i <users.length; i++) {
        if (users[i].username === username) {
            res.status(402).json({message: 'User already exists'});
            return;
        }
    }
    users = [ ...users, {username, password} ];
    try{
        fs.writeFileSync(ROOT_DIR+"users.json", JSON.stringify(users), {flag: 'w'});
        res.status(200).json({message: "User is created successful!"});
        return;
    } catch (error) {
        console.log(`Error on writing file: ${error}!`)
    }
    res.status(501).json({error: `Can't create new user!`});

   
});

//login
app.get('/user/login/:username/:password', (req, res) => {
    const username = req.params.username;
    const password = req.params.password;
    var users = [];
    try {
        const jsonData = fs.readFileSync(ROOT_DIR+"users.json", 'utf-8');
        users = JSON.parse(jsonData);
    } catch (error) {
        console.error('error reading or parsing JSON file')
    }

    for(var i = 0; i<users.length; i++){
        if(users[i].username === username){
            if(users[i].password === password){
                res.status(200).json({message: "login successfully"});
            } else{
                res.status(401).json({error:`password didn't match`});
            }
            return;
        }
    }
    res.status(403).json({error:`user '${username}' not found`});
});
// create note
app.get('/note/send/:username/:data',(req, res) => {
    const username = req.params.username;
    const data = req.params.data;

    const jsonData = fs.readFileSync(ROOT_DIR+`note.json`, 'utf-8');
    let note = JSON.parse(jsonData);
    note = [...note,{sender: username, data, id:Date.now()}];
    try {
        fs.writeFileSync(
            ROOT_DIR+`note.json`,
            JSON.stringify(note),
            {flag: 'w'}
        );
    } catch(error){
        console.error('erroe reading or parsing json file',error);
    }
    res.status(200).json({message:"note created successfully"});
});
//show note
app.get('/note/get/:username/',(req, res) => {
    const username = req.params.username;

    const jsonData = fs.readFileSync(ROOT_DIR+`note.json`, 'utf-8');
    let note = JSON.parse(jsonData);
    
    note = note.filter((n)=>n.sender == username)
    res.status(200).json(note);
})

//delete note
app.get('/note/delete/:id', (req, res) =>{
       const id = req.params.id;
       const jsonData = fs.readFileSync(ROOT_DIR+`note.json`, 'utf-8' );
       let note = JSON.parse(jsonData);
       note = note.filter((d)=>d.id != id);
       try {
        fs.writeFileSync(
            ROOT_DIR+`note.json`,
            JSON.stringify(note) ,
            {flag:'w'}
        )
       } catch (error) {
        console.error("error deleting json file",error)
       }
       res.status(200).json({message:"note deleted successfully"});
})


app.listen(port, ()=> {
    console.log(`http://localhost:${port}`)
})