import {escapeXML} from './core.mjs';
export function scoreSVG(notes,number,labels=true) {
 const width=Math.max(320,80+notes.length*43),bottom=92;
 const positions=notes.map(n=>(n.octave-4)*7+'CDEFGAB'.indexOf(n.step)-2);
 const ys=positions.map(p=>bottom-p*5);
 const min=Math.min(32,...ys.map(y=>y-40));const max=Math.max(125,...ys.map(y=>y+40));
 const height=max-min+12;
 let content='';
 for(let i=0;i<5;i++) content+=`<path d="M10 ${bottom-i*10}H${width-10}" class="staff"/>`;
 content+=`<text x="17" y="${bottom-10}" class="music">&#xE050;</text>`;
 const accidentalState=new Map();
 notes.forEach((n,i)=>{
  const x=70+i*(width-96)/Math.max(1,notes.length-1),y=ys[i],key=n.step+n.octave;
  for(let l=bottom+10;l<=y;l+=10)content+=`<path class="staff" d="M${x-10} ${l}h22"/>`;
  for(let l=bottom-50;l>=y;l-=10)content+=`<path class="staff" d="M${x-10} ${l}h22"/>`;
  const previous=accidentalState.get(key)??0;
  if(n.alter||previous!==n.alter){const symbol=n.alter===1?'E262':n.alter===-1?'E260':'E261';content+=`<text x="${x-19}" y="${y}" class="music">&#x${symbol};</text>`;}
  accidentalState.set(key,n.alter);
  content+=`<text x="${x-5.9}" y="${y}" class="music">&#xE0A4;</text>`;
  const down=positions[i]>=4;
  content+=`<path class="stem" d="M${x+(down?-5.5:5.5)} ${y}v${down?35:-35}"/>`;
  if(labels)content+=`<text class="note-label" text-anchor="middle" x="${x}" y="${max+1}">${escapeXML(n.label)}</text>`;
 });
 content+=`<path class="staff" d="M${width-10} ${bottom}v-40"/>`;
 return `<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Tonfolge ${number}: ${notes.map(n=>escapeXML(n.label)).join(', ')}" viewBox="0 ${min} ${width} ${height+14}">${content}</svg>`;
}
