import {parseNotes,PRESETS,totalCount,sequenceRange,musicXML,csv} from './core.mjs';
import {scoreSVG} from './score.mjs';
const $=id=>document.getElementById(id),fmt=n=>n.toLocaleString('de-DE');
let state={notes:[],fixed:null,first:1,size:24},rendered=[];
function refreshStart(){
 const previous=$('fixed').value;
 try{const notes=parseNotes($('notes').value,Number($('octave').value));$('fixed').replaceChildren(new Option('Alle Anfangstöne','all'),...notes.map((n,i)=>new Option(n.label,String(i))));if([...$('fixed').options].some(o=>o.value===previous))$('fixed').value=previous;}catch{$('fixed').replaceChildren(new Option('Alle Anfangstöne','all'));}
}
function render(){
 const total=totalCount(state.notes,state.fixed);
 rendered=sequenceRange(state.notes,state.first,state.size,state.fixed);
 $('total').textContent=fmt(total);$('formula').textContent=`${state.notes.length-(state.fixed===null?0:1)}! Reihenfolgen · ${state.notes.length} ${state.notes.length===1?'Ton':'Töne'}${state.fixed!==null?' · Anfangston '+state.notes[state.fixed].label:''}`;
 $('selection').replaceChildren(...state.notes.map(n=>{const el=document.createElement('span');el.className='chip';el.textContent=n.label;return el;}));
 $('range').textContent=`Folgen ${fmt(state.first)}–${fmt(rendered.at(-1).number)} von ${fmt(total)}`;
 $('first').value=state.first;$('first').max=total;$('prev').disabled=state.first===1;$('next').disabled=state.first+state.size>total;
 $('score').classList.toggle('long',state.notes.length>7);
 $('score').innerHTML=rendered.map(row=>`<article class="score-card"><div class="score-number">${fmt(row.number).padStart(2,'0')}</div>${scoreSVG(row.notes,row.number,$('labels').checked)}</article>`).join('');
 $('view-error').textContent='';$('export-status').textContent='';
}
$('preset').addEventListener('change',()=>{if(PRESETS[$('preset').value]){$('notes').value=PRESETS[$('preset').value];$('fixed').value='all';refreshStart();apply();}});
$('notes').addEventListener('input',()=>{$('preset').value='custom';refreshStart();});
function apply(){try{const notes=parseNotes($('notes').value,Number($('octave').value));const fixed=$('fixed').value==='all'?null:Number($('fixed').value);totalCount(notes,fixed);state={...state,notes,fixed,first:1};$('error').textContent='';render();}catch(e){$('error').textContent=e.message;}}
$('settings').addEventListener('submit',e=>{e.preventDefault();apply();});
$('jump-form').addEventListener('submit',e=>{e.preventDefault();try{const first=Number($('first').value);sequenceRange(state.notes,first,1,state.fixed);state.first=first;render();}catch(err){$('view-error').textContent=err.message;}});
$('size').addEventListener('change',()=>{state.size=Number($('size').value);$('export-count').value=state.size;render();});
$('labels').addEventListener('change',render);
$('prev').addEventListener('click',()=>{state.first=Math.max(1,state.first-state.size);render();});
$('next').addEventListener('click',()=>{state.first=Math.min(totalCount(state.notes,state.fixed),state.first+state.size);render();});
function download(format){try{const rows=sequenceRange(state.notes,state.first,Number($('export-count').value),state.fixed);const data=format==='musicxml'?musicXML(rows):csv(rows);const blob=new Blob([data],{type:format==='musicxml'?'application/vnd.recordare.musicxml+xml;charset=utf-8':'text/csv;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`tonfolgen-${rows[0].number}-${rows.at(-1).number}.${format}`;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);$('export-status').textContent=`${fmt(rows.length)} Folgen als ${format==='musicxml'?'MusicXML':'CSV'} exportiert.`;}catch(e){$('export-status').textContent=e.message;}}
$('xml').addEventListener('click',()=>download('musicxml'));$('csv').addEventListener('click',()=>download('csv'));
$('print').addEventListener('click',async()=>{try{await document.fonts.load('40px Bravura');window.print();}catch{$('export-status').textContent='Notenschrift konnte nicht geladen werden. Bitte Seite neu laden.';}});
refreshStart();apply();
