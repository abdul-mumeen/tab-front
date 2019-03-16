const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(path.resolve(__dirname, './dist/ext')));

app.use('*', (req, res) => {
    return res.sendFile(path.resolve(__dirname, './dist/ext/index.html'));
});

app.listen(4300, () => {
    console.log('Server Started');
});
