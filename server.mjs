import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.resolve(fileURLToPath(new URL('./dist/',import.meta.url)));
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.woff':'font/woff','.txt':'text/plain; charset=utf-8'};
http.createServer(async(req,res)=>{try{const name=decodeURIComponent(new URL(req.url,'http://localhost').pathname);const file=path.resolve(root,'.'+(name==='/'?'/index.html':name));if(!file.startsWith(root+path.sep)&&file!==path.join(root,'index.html')){res.writeHead(403);return res.end();}const body=await readFile(file);res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','X-Content-Type-Options':'nosniff'});res.end(body);}catch{res.writeHead(404);res.end('Nicht gefunden');}}).listen(Number(process.env.PORT||4173),'127.0.0.1',()=>console.log('Tonfolgen: http://localhost:'+String(process.env.PORT||4173)));
