/** Deutsche Notennamen, ein Ton je Tonklasse, maximal zwölf Töne. */
const NATURAL = {C:0,D:2,E:4,F:5,G:7,A:9,H:11};
const ALIASES = {cis:'C#',des:'Db',dis:'D#',es:'Eb',eis:'E#',fes:'Fb',fis:'F#',ges:'Gb',gis:'G#',as:'Ab',ais:'A#',b:'Hb',his:'H#',ces:'Cb'};
export const PRESETS = {pentatonic:'E G A H D',major:'C D E F G A H',chromatic:'C Cis D Dis E F Fis G Gis A Ais H'};
export function parseNotes(text, octave=4) {
 if (![3,4,5].includes(Number(octave))) throw new Error('Bitte eine gültige Ausgangsoktave wählen.');
 const tokens=text.trim().split(/[\s,;]+/).filter(Boolean);
 if (!tokens.length || tokens.length>12) throw new Error('Bitte 1 bis 12 verschiedene Töne eingeben.');
 const notes=tokens.map(token=>{
  let clean=token.replaceAll('♯','#').replaceAll('♭','b');
  clean=ALIASES[clean.toLowerCase()] ?? (clean[0].toUpperCase()+clean.slice(1));
  // B ist im deutschen System H erniedrigt. Bb wird als gleichbedeutend akzeptiert.
  if (clean==='Bb') clean='Hb';
  const match=/^([CDEFGAH])([#b]?)$/.exec(clean);
  if (!match) throw new Error(`„${token}“ ist kein unterstützter Ton. Beispiel: E G A H D oder C Cis D Es.`);
  const step=match[1],alter=match[2]==='#'?1:match[2]==='b'?-1:0;
  const pc=(NATURAL[step]+alter+12)%12;
  const label=step==='H'&&alter===-1?'B':step+(alter===1?'♯':alter===-1?'♭':'');
  return {step:step==='H'?'B':step,alter,pc,label};
 });
 const seen=new Set();
 for (const note of notes) {if(seen.has(note.pc)) throw new Error(`„${note.label}“ kommt doppelt oder enharmonisch gleich vor. Bitte jeden klingenden Ton nur einmal eingeben.`);seen.add(note.pc);}
 const root=notes[0].pc;
 return notes.map(n=>{
  const midi=12*(Number(octave)+1)+n.pc+(n.pc<root?12:0);
  const naturalPc=NATURAL[n.step==='B'?'H':n.step];
  return {...n,midi,octave:(midi-naturalPc-n.alter)/12-1};
 });
}
export function factorial(n) {
 if(!Number.isInteger(n)||n<0||n>12)throw new Error('Die Tonanzahl muss zwischen 0 und 12 liegen.');
 let f=1;for(let i=2;i<=n;i++)f*=i;return f;
}
function validate(notes,fixed) {
 if(!Array.isArray(notes)||notes.length<1||notes.length>12)throw new Error('1 bis 12 Töne erforderlich.');
 if(fixed!==null&&(!Number.isInteger(fixed)||fixed<0||fixed>=notes.length))throw new Error('Ungültiger Anfangston.');
}
export function totalCount(notes,fixed=null) {validate(notes,fixed);return factorial(notes.length-(fixed===null?0:1));}
/** Factoradische Direktadressierung: keine Erzeugung vorhergehender Folgen. */
export function permutationAt(notes,index,fixed=null) {
 const total=totalCount(notes,fixed);
 if(!Number.isInteger(index)||index<0||index>=total)throw new Error(`Folgennummer muss zwischen 1 und ${total} liegen.`);
 const pool=notes.filter((_,i)=>i!==fixed),result=fixed===null?[]:[notes[fixed]];
 while(pool.length){const block=factorial(pool.length-1);const at=Math.floor(index/block);result.push(pool.splice(at,1)[0]);index%=block;}
 return result;
}
export function sequenceRange(notes,first,count,fixed=null) {
 const total=totalCount(notes,fixed);
 if(!Number.isInteger(first)||first<1||first>total)throw new Error(`Startnummer muss zwischen 1 und ${total} liegen.`);
 if(!Number.isInteger(count)||count<1||count>10000)throw new Error('Bitte 1 bis 10.000 Folgen pro Export wählen.');
 return Array.from({length:Math.min(count,total-first+1)},(_,i)=>({number:first+i,notes:permutationAt(notes,first+i-1,fixed)}));
}
export const escapeXML = value=>String(value).replace(/[<>&"']/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&apos;'}[c]));
export function musicXML(rows) {
 if(!rows.length)throw new Error('Keine Folgen für den Export.');
 return `<?xml version="1.0" encoding="UTF-8"?>\n<score-partwise version="4.0"><work><work-title>Tonfolgen ${rows[0].number}–${rows.at(-1).number}</work-title></work><part-list><score-part id="P1"><part-name>Violinschlüssel</part-name></score-part></part-list><part id="P1">${rows.map((row,i)=>`<measure number="${row.number}">${i===0?`<attributes><divisions>1</divisions><key><fifths>0</fifths></key><time><beats>${row.notes.length}</beats><beat-type>4</beat-type></time><clef><sign>G</sign><line>2</line></clef></attributes>`:''}<direction><direction-type><words>Nr. ${row.number}</words></direction-type></direction>${row.notes.map(n=>`<note><pitch><step>${n.step}</step>${n.alter?`<alter>${n.alter}</alter>`:''}<octave>${n.octave}</octave></pitch><duration>1</duration><type>quarter</type></note>`).join('')}</measure>`).join('')}</part></score-partwise>`;
}
export function csv(rows) {return '\uFEFFNummer;Tonfolge\r\n'+rows.map(r=>`${r.number};${r.notes.map(n=>n.label+n.octave).join(' ')}`).join('\r\n');}
