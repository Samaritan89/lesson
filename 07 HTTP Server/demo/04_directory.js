'use strict';

const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');
const handlebars = require('handlebars');

let server = http.createServer(function(req, res){
    let pathName = url.parse(req.url).pathname,
        realPath = path.join(__dirname, pathName);

    fs.stat(realPath, (err, stats) => {
        if(err){ // file do not exists
            let source = fs.readFileSync('./template/404.tmpl'),
                template = handlebars.compile(source.toString()),
                data = {
                    path: url.parse(req.url).name
                };

            res.end(template(data));
        }else{
            if(stats.isDirectory()){
                let source = fs.readFileSync('./template/directory.tmpl'),
                    template = handlebars.compile(source.toString()),
                    data = {
                        title: url.parse(req.url).name,
                        path: pathName,
                        files: []
                    };

                data.files = fs.readdirSync(realPath);

                res.end(template(data));
            }else{
                fs.createReadStream(realPath).pipe(res);
            }
        }
    });
});

server.listen(process.argv[2] || 9000);