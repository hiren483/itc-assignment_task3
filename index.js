const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();


const app = express()
const port = process.env.PORT || 3000;

app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(()=> console.log("connected"))
    .catch((err)=>console.error('not connected',err));

    const notesSchema = new mongoose.Schema(
        {
            title : String,
            content : String, 
        },{timestamps : true}
    );

    const note = mongoose.model('notes',notesSchema)


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/notes', async (req, res) => {

    const notes = await note.find();
    res.json(notes);

});

app.post('/notes',async(req,res)=>{
    const newnote = new note(req.body);
    await newnote.save();
    res.status(201).json(newnote);
});


app.patch('/notes/:id',async(req,res)=>{
    const id = req.params.id;
    const updatednote = await note.findByIdAndUpdate(id,req.body,{new:true});
    res.json(updatednote);
})


app.delete('/notes/:id',async(req,res)=>{
    const id = req.params.id;
    await note.findByIdAndDelete(req.params.id);
    res.json({message :'note deleted'});
})

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})