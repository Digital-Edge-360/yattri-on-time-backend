const path = require('path');
const fs = require('fs/promises');

const SendVoice = async (req, res) => {
    try {        
        const voiceFile= req.params.id;
        const fPath= path.join(process.cwd(),'data','voices',voiceFile);
        const fContent= await fs.readFile(fPath, 'utf8');
        await fs.unlink(fPath);
        res.status(200).header({'Content-Type': 'text/xml'}).send(fContent);
    } catch (error) {
       res.status(500).header({'Content-Type': 'text/xml'}).send(error.message); 
    }
};

module.exports ={SendVoice}