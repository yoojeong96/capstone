var express = require('express');
var fs = require('fs');
var app = express();
var bodyParser = require('body-parser');
var formidable = require('formidable');
var sha256 = require('sha256');
var PythonShell = require('python-shell');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static('public'));

app.listen(3000, "localhost", function () {
    console.log('Server Start');
});

app.get('/', function (req, res) {
    fs.readFile('main.html', function (error, data) {
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });
        res.end(data, function (error) {
            console.log(error);
        });
    });
});

app.get('/logo', function (req, res) {
    fs.readFile('logo.png', function (error, data) {
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });
        res.end(data);
    })
})

app.get('/imgs', function (req, res) {
    fs.readFile('download.png', function (error, data) {
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });
        res.end(data);
    })
})

app.post('/upload', function (req, res) {

    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {

        var oldpath = files['files[]'].path;
        var filename = files['files[]'].name;
        var filename = filename.split('.');
        var extention = filename[filename.length - 1];
        filename.pop();
        var filename = filename.join(".");
        var newpath = 'C:/Users/KimYoungHo/Desktop/fileup/' + sha256(filename + new Date()) + "." + extention;
       
        fs.rename(oldpath, newpath, function (err) {
            if (err) throw err;
            res.writeHead(200, {
                'Content-Type': 'application/json'
            });
            res.end(JSON.stringify('{"success":true,"error":"","filemeta":'+JSON.stringify(files)+'}'));
            
        });
        
        var options = {
            mode: 'text',
            pythonPath: '',
            pythonOptions: ['-u'],
            scriptPath: '',
            args: [newpath]
        };

        PythonShell.run('sha1.py', options, function (err, results) {

            if (err) throw err;
            
            return results;
            
            /*
            var jsonData = '{"datas":[{"sha1":'+results+'}]}';
            
            var jsonObj = JSON.parse(jsonData);
            console.log(jsonObj);
            */
            
            /*
            fs.readFile('jsondata.json', 'utf-8', function(err, data){
                if (err) throw err;
                
                var jsonsha1 = JSON.parse(data);
                
                console.log(data);
                
                jsonsha1.jsondata.push({
                    sha1: 'results'
                })
                
                            fs.writeFile('jsondata.json', JSON.stringify(jsonsha1), 'utf-8', function (err) {
                                if (err) throw err;
                                console.log('Done!');
                            })
            })
            */
            
        });
        

    });


});


app.get('/result/json', function (req, res) {
    fs.readFile('fileHash.json', function (error, data) {
        res.writeHead(200, {
            'Content-Type': 'application/json'
        });
        res.end(data, function (error) {
            console.log(error);
        });
    });
});



app.get('/result', function (req, res) {
    fs.readFile('result.html', function (error, data) {
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });
        res.end(data, function (error) {
            console.log(error);
        });
    });
});

