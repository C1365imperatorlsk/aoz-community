'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const dir=path.join(__dirname,'..'),html=fs.readFileSync(path.join(dir,'index.html'),'utf8'),scripts=[];
for(const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)){const src=m[1].match(/src="([^"]+)"/)?.[1];if(src?.startsWith('https:'))continue;scripts.push(src?fs.readFileSync(path.join(dir,src.split('?')[0]),'utf8'):m[2]);}
new vm.Script(scripts.join('\n;\n')); console.log('Combined scripts syntax: OK');
