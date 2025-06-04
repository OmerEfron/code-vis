const analyzeHoffman = async (req, res) => {
    const { hoffmanCode } = req.body;
    
    res.json(hoffmanCode);
};



module.exports = {analyzeHoffman};