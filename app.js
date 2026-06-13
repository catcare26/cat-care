const {useState,useEffect,createElement:h}=React;

const C={
  mint:"#00C896",mintBg:"rgba(0,200,150,0.12)",
  dark:"#0D1B2A",card:"#132338",cardL:"#1A2F47",
  border:"rgba(0,200,150,0.18)",text:"#E8F4F0",muted:"#7A9BAD",
  amber:"#F5A623",amberBg:"rgba(245,166,35,0.12)",
  red:"#FF5C5C",redBg:"rgba(255,92,92,0.12)",
  blue:"#4B9EFF",purple:"#A78BFA"
};

const CATS_INIT=[
  {id:1,name:"Mochi",breed:"Scottish Fold",sex:"F",dob:"2021-03-15",weight:3.8,color:"Gri cu alb",chip:"941000023847102",steri:true,vet:"Dr. Ionescu Maria",notes:"Ii plac jucăriile cu pene",ico:"🐱",bg:"#1D9E75",
   vax:[{id:1,name:"Tricat Trio",date:"2025-01-15",vet:"Dr. Ionescu",next:"2026-01-15",lot:"A2024B"},{id:2,name:"Antirabic",date:"2025-05-10",vet:"Dr. Ionescu",next:"2026-05-10",lot:"R2025X"}],
   dewI:[{id:1,prod:"Milbemax",qty:"1 comprimat",date:"2025-02-01",mo:3}],
   dewE:[{id:1,prod:"Frontline Spot-On",qty:"1 pipeta",date:"2025-04-15",mo:1}],
   treat:[{id:1,drug:"Amoxicilin",dose:"62.5mg",freq:"2x/zi",start:"2025-03-10",end:"2025-03-17",instr:"Cu mâncare"}],
   cons:[{id:1,reason:"Control anual",diag:"Sanatoasa",recs:"Continuat schema vaccinare",cost:150}],
   surg:[],anal:[],
   wts:[{date:"2024-01-01",v:3.2},{date:"2024-06-01",v:3.5},{date:"2025-01-01",v:3.7},{date:"2025-06-01",v:3.8}]},
  {id:2,name:"Simba",breed:"Maine Coon",sex:"M",dob:"2020-07-22",weight:6.2,color:"Tabby portocaliu",chip:"",steri:true,vet:"Dr. Popescu Alexandru",notes:"Foarte vocal",ico:"🦁",bg:"#BA7517",
   vax:[{id:1,name:"Tricat Trio",date:"2024-12-01",vet:"Dr. Popescu",next:"2025-12-01",lot:"B2024C"}],
   dewI:[{id:1,prod:"Drontal",qty:"1 comprimat",date:"2025-01-10",mo:3}],
   dewE:[{id:1,prod:"Advantage",qty:"1 pipeta",date:"2025-03-20",mo:1}],
   treat:[],
   cons:[{id:1,reason:"Tuse cronica",diag:"Astm felin usor",recs:"Inhalator Aerokat",cost:280}],
   surg:[{id:1,name:"Castrare",date:"2021-02-14",clinic:"VetClinic Iasi",dr:"Dr. Popescu",notes:"Recuperare rapida"}],
   anal:[{id:1,type:"Hemograma",result:"Valori normale",date:"2025-01-05"}],
   wts:[{date:"2024-01-01",v:5.8},{date:"2024-06-01",v:6.0},{date:"2025-01-01",v:6.1},{date:"2025-06-01",v:6.2}]}
];

const MEDS_INIT=[
  {id:1,name:"Milbemax",qty:4,unit:"comprimate",exp:"2026-03-01"},
  {id:2,name:"Frontline",qty:2,unit:"pipete",exp:"2025-08-15"},
  {id:3,name:"Amoxicilin",qty:1,unit:"cutii",exp:"2025-07-01"}
];

const EVT_TYPES=[
  {id:"vaccin",l:"Vaccin",ico:"💉",col:C.mint},
  {id:"deparazitare",l:"Deparazitare",ico:"🪱",col:C.blue},
  {id:"tratament",l:"Tratament",ico:"💊",col:C.purple},
  {id:"consultatie",l:"Consultatie",ico:"🩺",col:"#4B9EFF"},
  {id:"analiza",l:"Analiza",ico:"🔬",col:C.amber},
  {id:"interventie",l:"Interventie",ico:"🏥",col:C.red},
  {id:"altele",l:"Altele",ico:"📌",col:C.muted}
];

const NOTIF_OPTS=[
  {v:"0",l:"In ziua evenimentului"},
  {v:"1",l:"Cu 1 zi inainte"},
  {v:"3",l:"Cu 3 zile inainte"},
  {v:"7",l:"Cu 7 zile inainte"},
  {v:"14",l:"Cu 14 zile inainte"}
];

const NAV=[
  {id:"dash",l:"Dashboard",i:"🏠"},
  {id:"cats",l:"Pisici",i:"🐱"},
  {id:"cal",l:"Calendar",i:"📅"},
  {id:"hist",l:"Istoric",i:"📋"},
  {id:"meds",l:"Medic.",i:"💊"}
];

function fmtDate(d){if(!d)return"-";return new Date(d).toLocaleDateString("ro-RO");}
function calcAge(dob){
  const b=new Date(dob),n=new Date();
  let y=n.getFullYear()-b.getFullYear(),m=n.getMonth()-b.getMonth();
  if(m<0){y--;m+=12;}
  return y===0?`${m} luni`:m===0?`${y} ani`:`${y}a ${m}l`;
}
function daysUntil(ds){
  const d=Math.ceil((new Date(ds)-new Date())/86400000);
  if(d<0)return`${Math.abs(d)}z trecut`;
  if(d===0)return"Azi";
  if(d===1)return"Maine";
  return`${d} zile`;
}
function nextAct(cat){
  const it=[];
  cat.vax.forEach(v=>{if(v.next)it.push({date:v.next,label:`Vaccin ${v.name}`,col:C.mint});});
  cat.dewI.forEach(d=>{const nd=new Date(d.date);nd.setMonth(nd.getMonth()+d.mo);it.push({date:nd.toISOString().slice(0,10),label:`Dep. ${d.prod}`,col:C.blue});});
  cat.dewE.forEach(d=>{const nd=new Date(d.date);nd.setMonth(nd.getMonth()+d.mo);it.push({date:nd.toISOString().slice(0,10),label:`Ext. ${d.prod}`,col:C.amber});});
  it.sort((a,b)=>new Date(a.date)-new Date(b.date));
  return it[0]||null;
}
function load(key,fb){try{const s=localStorage.getItem(key);return s?JSON.parse(s):fb;}catch(e){return fb;}}
function save(key,val){try{localStorage.setItem(key,JSON.stringify(val));}catch(e){}}

// STYLES helpers
const card=(extra={})=>({background:C.card,border:`1px solid ${C.border}`,borderRadius:16,...extra});
const row=(extra={})=>({display:"flex",alignItems:"center",...extra});

function Badge({children,col=C.mint,small}){
  return h("span",{style:{background:`${col}22`,color:col,fontSize:small?9:10,padding:small?"1px 6px":"2px 8px",borderRadius:20,fontWeight:700,whiteSpace:"nowrap"}},children);
}

function Pill({children,active,col=C.mint,onClick}){
  return h("button",{onClick,style:{background:active?col:C.cardL,color:active?C.dark:C.muted,border:`1px solid ${active?col:C.border}`,borderRadius:20,padding:"6px 14px",fontSize:12,fontWeight:active?700:400,cursor:"pointer",whiteSpace:"nowrap",WebkitTapHighlightColor:"transparent"}},children);
}

function IosInput({label,value,onChange,type="text",placeholder=""}){
  return h("div",{style:{marginBottom:0}},
    h("div",{style:{padding:"12px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:`1px solid ${C.border}`}},
      h("span",{style:{fontSize:14,color:C.text,fontWeight:500,minWidth:90}},label),
      h("input",{type,value,onChange:e=>onChange(e.target.value),placeholder,
        style:{flex:1,background:"none",border:"none",color:C.mint,fontSize:14,fontWeight:500,outline:"none",textAlign:"right",width:"100%"}
      })
    )
  );
}

function MiniChart({data}){
  if(!data||data.length<2)return null;
  const W=260,H=60,p=10;
  const vs=data.map(d=>d.v),mn=Math.min(...vs),mx=Math.max(...vs),rng=mx-mn||1;
  const pts=data.map((d,i)=>({x:p+(i/(data.length-1))*(W-p*2),y:H-p-((d.v-mn)/rng)*(H-p*2)}));
  const line=pts.map((pt,i)=>`${i===0?"M":"L"}${pt.x},${pt.y}`).join(" ");
  const area=line+` L${pts[pts.length-1].x},${H} L${pts[0].x},${H} Z`;
  return h("svg",{width:"100%",viewBox:`0 0 ${W} ${H}`,style:{display:"block"}},
    h("path",{d:area,fill:`${C.mint}22`}),
    h("path",{d:line,fill:"none",stroke:C.mint,strokeWidth:2.5,strokeLinecap:"round",strokeLinejoin:"round"}),
    pts.map((pt,i)=>h("circle",{key:i,cx:pt.x,cy:pt.y,r:4,fill:C.mint}))
  );
}

// BOTTOM SHEET MODAL (iOS style)
function Sheet({title,onClose,children}){
  return h("div",{
    style:{position:"fixed",inset:0,zIndex:1000,display:"flex",flexDirection:"column",justifyContent:"flex-end"},
    onClick:onClose
  },
    h("div",{style:{position:"absolute",inset:0,background:"rgba(0,0,0,0.6)"}}),
    h("div",{
      style:{position:"relative",background:C.card,borderRadius:"20px 20px 0 0",maxHeight:"90vh",display:"flex",flexDirection:"column",paddingBottom:"env(safe-area-inset-bottom)"},
      onClick:e=>e.stopPropagation()
    },
      h("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 20px",borderBottom:`1px solid ${C.border}`,flexShrink:0}},
        h("button",{onClick:onClose,style:{background:"none",border:"none",color:C.muted,fontSize:15,cursor:"pointer",padding:"4px 8px",WebkitTapHighlightColor:"transparent"}},"Anuleaza"),
        h("span",{style:{fontSize:15,fontWeight:700,color:C.text}},title),
        h("div",{style:{width:70}})
      ),
      h("div",{style:{overflowY:"auto",flex:1,padding:"16px 20px"}},children)
    )
  );
}

// PDF GENERATOR
function generatePDF(cat,customEvents){
  const {jsPDF}=window.jspdf;
  const doc=new jsPDF({orientation:"portrait",unit:"mm",format:"a4"});
  const W=210,M=18;let y=M;
  function fc(hex){const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);doc.setFillColor(r,g,b);}
  function tc(hex){const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);doc.setTextColor(r,g,b);}
  fc("#0D1B2A");doc.rect(0,0,W,44,"F");
  fc("#00C896");doc.roundedRect(M,8,28,28,4,4,"F");
  tc("#0D1B2A");doc.setFontSize(20);doc.text("🐾",M+5,25);
  tc("#E8F4F0");doc.setFontSize(22);doc.setFont("helvetica","bold");doc.text("CatCare",M+34,20);
  tc("#7A9BAD");doc.setFontSize(9);doc.setFont("helvetica","normal");
  doc.text("Raport Medical Digital",M+34,27);
  doc.text(`Generat: ${new Date().toLocaleDateString("ro-RO")}`,M+34,34);
  y=54;
  fc("#132338");doc.roundedRect(M,y,W-M*2,36,4,4,"F");
  tc("#00C896");doc.setFontSize(18);doc.setFont("helvetica","bold");doc.text(cat.name,M+14,y+13);
  tc("#7A9BAD");doc.setFontSize(9);doc.setFont("helvetica","normal");
  doc.text(`${cat.breed} · ${calcAge(cat.dob)} · ${cat.sex==="F"?"Femela":"Mascul"} · ${cat.weight}kg`,M+14,y+20);
  doc.text(`Veterinar: ${cat.vet}`,M+14,y+27);
  if(cat.chip)doc.text(`Microcip: ${cat.chip}`,M+14,y+33);
  y+=44;
  function section(title,items,cols){
    if(!items||!items.length)return;
    if(y>255){doc.addPage();y=M;}
    tc("#00C896");doc.setFontSize(11);doc.setFont("helvetica","bold");doc.text(title,M,y);
    fc("#00C896");doc.rect(M,y+2,W-M*2,0.5,"F");y+=8;
    items.forEach((item,idx)=>{
      if(y>265){doc.addPage();y=M;}
      fc(idx%2===0?"#132338":"#0D1B2A");doc.rect(M,y-1,W-M*2,6,"F");
      cols.forEach(c=>{
        tc(c.color||"#E8F4F0");doc.setFontSize(8);doc.setFont("helvetica",c.bold?"bold":"normal");
        const txt=String(item[c.key]||"—");
        doc.text(txt.length>c.max?txt.slice(0,c.max)+"…":txt,M+c.x,y+3.5);
      });
      y+=6;
    });
    y+=6;
  }
  section("💉 Vaccinuri",cat.vax,[{key:"name",x:0,max:28,bold:true},{key:"date",x:58,max:14,color:"#7A9BAD"},{key:"vet",x:88,max:24,color:"#7A9BAD"},{key:"next",x:138,max:14,color:"#00C896"}]);
  section("🪱 Deparazitari interne",cat.dewI,[{key:"prod",x:0,max:28,bold:true},{key:"qty",x:58,max:18,color:"#7A9BAD"},{key:"date",x:98,max:14,color:"#7A9BAD"}]);
  section("🐛 Deparazitari externe",cat.dewE,[{key:"prod",x:0,max:28,bold:true},{key:"qty",x:58,max:18,color:"#7A9BAD"},{key:"date",x:98,max:14,color:"#7A9BAD"}]);
  section("💊 Tratamente",cat.treat,[{key:"drug",x:0,max:24,bold:true},{key:"dose",x:52,max:12,color:"#7A9BAD"},{key:"freq",x:76,max:14,color:"#7A9BAD"},{key:"start",x:108,max:12,color:"#7A9BAD"},{key:"end",x:134,max:12,color:"#A78BFA"}]);
  section("🩺 Consultatii",cat.cons,[{key:"reason",x:0,max:28,bold:true},{key:"diag",x:68,max:28,color:"#7A9BAD"},{key:"cost",x:146,max:10,color:"#00C896"}]);
  section("🏥 Interventii",cat.surg,[{key:"name",x:0,max:28,bold:true},{key:"date",x:62,max:14,color:"#7A9BAD"},{key:"clinic",x:92,max:28,color:"#7A9BAD"}]);
  section("🔬 Analize",cat.anal,[{key:"type",x:0,max:28,bold:true},{key:"date",x:68,max:14,color:"#7A9BAD"},{key:"result",x:98,max:38,color:"#00C896"}]);
  if(cat.wts&&cat.wts.length){
    if(y>230){doc.addPage();y=M;}
    tc("#00C896");doc.setFontSize(11);doc.setFont("helvetica","bold");doc.text("📊 Evolutie greutate",M,y);
    fc("#00C896");doc.rect(M,y+2,W-M*2,0.5,"F");y+=8;
    const bw=18,gap=6,bh=24,vals=cat.wts.map(w=>w.v),mx=Math.max(...vals)*1.1;
    cat.wts.forEach((w,i)=>{
      const bx=M+i*(bw+gap),bH=(w.v/mx)*bh;
      fc("#1A2F47");doc.rect(bx,y,bw,bh,"F");
      fc("#00C896");doc.rect(bx,y+bh-bH,bw,bH,"F");
      tc("#E8F4F0");doc.setFontSize(7);doc.setFont("helvetica","bold");doc.text(`${w.v}kg`,bx+1,y+bh-bH-2);
      tc("#7A9BAD");doc.setFontSize(6);doc.setFont("helvetica","normal");doc.text(fmtDate(w.date).slice(0,7),bx,y+bh+5);
    });
    y+=bh+14;
  }
  const pages=doc.getNumberOfPages();
  for(let i=1;i<=pages;i++){
    doc.setPage(i);fc("#132338");doc.rect(0,287,W,10,"F");
    tc("#7A9BAD");doc.setFontSize(7);doc.setFont("helvetica","normal");
    doc.text("CatCare — Carnet Medical Digital",M,293);
    doc.text(`Pagina ${i}/${pages}`,W-M-12,293);
  }
  return doc;
}

// SHARE SHEET
function ShareSheet({cat,customEvents,onClose}){
  const [msg,setMsg]=useState("");
  function dl(){const doc=generatePDF(cat,customEvents);doc.save(`CatCare_${cat.name}.pdf`);setMsg("✅ PDF descarcat!");}
  function email(){dl();setTimeout(()=>{const s=encodeURIComponent(`Raport CatCare — ${cat.name}`);const b=encodeURIComponent(`Buna,\n\nAtasez raportul medical pentru ${cat.name}.\n\nCatCare`);window.open(`mailto:?subject=${s}&body=${b}`);},500);}
  function wa(){dl();setTimeout(()=>{const m=encodeURIComponent(`Raport medical CatCare pentru ${cat.name} 🐱\nRasa: ${cat.breed} · Varsta: ${calcAge(cat.dob)}`);window.open(`https://wa.me/?text=${m}`);},500);}
  function print(){const doc=generatePDF(cat,customEvents);window.open(doc.output("bloburl"));}
  const btns=[
    {l:"Descarca PDF",i:"📥",fn:dl,col:C.mint},
    {l:"Email",i:"📧",fn:email,col:C.blue},
    {l:"WhatsApp",i:"💬",fn:wa,col:"#25D366"},
    {l:"Printeaza",i:"🖨️",fn:print,col:C.amber}
  ];
  return h(Sheet,{title:`Raport ${cat.name}`,onClose},
    h("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}},
      btns.map((b,i)=>h("button",{key:i,onClick:b.fn,style:{background:`${b.col}18`,border:`1px solid ${b.col}44`,borderRadius:14,padding:"18px 10px",cursor:"pointer",textAlign:"center",WebkitTapHighlightColor:"transparent"}},
        h("div",{style:{fontSize:28,marginBottom:6}},b.i),
        h("div",{style:{fontSize:12,fontWeight:700,color:b.col}},b.l)))),
    msg&&h("div",{style:{padding:"12px 16px",background:`${C.mint}18`,borderRadius:12,fontSize:13,color:C.mint,textAlign:"center"}},msg)
  );
}

// ADD EVENT SHEET
function AddEventSheet({cats,initialDate,onClose,onSave}){
  const today=new Date().toISOString().slice(0,10);
  const [f,setF]=useState({title:"",type:"vaccin",catId:String(cats[0]?.id||""),date:initialDate||today,time:"09:00",notif:"1",note:"",repeat:"none"});
  const t=EVT_TYPES.find(e=>e.id===f.type)||EVT_TYPES[0];
  function save(){if(!f.title||!f.date)return;onSave({...f,id:Date.now(),catId:parseInt(f.catId)});onClose();}
  return h(Sheet,{title:"Eveniment nou",onClose},
    // Title input
    h("div",{style:{background:C.cardL,borderRadius:14,padding:"14px",marginBottom:14,border:`1px solid ${t.col}44`}},
      h("div",{style:{display:"flex",alignItems:"center",gap:10,marginBottom:10}},
        h("div",{style:{width:38,height:38,borderRadius:10,background:`${t.col}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}},t.ico),
        h("input",{value:f.title,onChange:e=>setF(p=>({...p,title:e.target.value})),placeholder:"Titlu eveniment",
          style:{flex:1,background:"none",border:"none",color:C.text,fontSize:17,fontWeight:600,outline:"none"}})),
      h("input",{value:f.note,onChange:e=>setF(p=>({...p,note:e.target.value})),placeholder:"Note, doza, detalii...",
        style:{width:"100%",background:"none",border:"none",borderTop:`1px solid ${C.border}`,paddingTop:8,color:C.muted,fontSize:14,outline:"none"}})),
    // Type chips
    h("div",{style:{marginBottom:14}},
      h("div",{style:{fontSize:11,color:C.muted,marginBottom:8,fontWeight:700,textTransform:"uppercase",letterSpacing:.8}},"Tip"),
      h("div",{style:{display:"flex",gap:7,flexWrap:"wrap"}},
        EVT_TYPES.map(tp=>h("button",{key:tp.id,onClick:()=>setF(p=>({...p,type:tp.id})),
          style:{background:f.type===tp.id?`${tp.col}33`:`${tp.col}11`,border:`1px solid ${f.type===tp.id?tp.col:tp.col+"33"}`,borderRadius:20,padding:"6px 12px",fontSize:12,fontWeight:f.type===tp.id?700:400,cursor:"pointer",color:tp.col,WebkitTapHighlightColor:"transparent"}},
          tp.ico+" "+tp.l)))),
    // iOS grouped fields
    h("div",{style:{background:C.cardL,borderRadius:14,overflow:"hidden",marginBottom:14}},
      h("div",{style:{padding:"12px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:`1px solid ${C.border}`}},
        h("span",{style:{fontSize:14,color:C.text}},"Pisica"),
        h("select",{value:f.catId,onChange:e=>setF(p=>({...p,catId:e.target.value})),
          style:{background:"none",border:"none",color:C.mint,fontSize:14,fontWeight:600,cursor:"pointer",outline:"none"}},
          cats.map(c=>h("option",{key:c.id,value:c.id},`${c.ico} ${c.name}`)))),
      h("div",{style:{padding:"12px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:`1px solid ${C.border}`}},
        h("span",{style:{fontSize:14,color:C.text}},"Data"),
        h("input",{type:"date",value:f.date,onChange:e=>setF(p=>({...p,date:e.target.value})),
          style:{background:"none",border:"none",color:C.mint,fontSize:14,fontWeight:600,cursor:"pointer",outline:"none"}})),
      h("div",{style:{padding:"12px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:`1px solid ${C.border}`}},
        h("span",{style:{fontSize:14,color:C.text}},"Ora"),
        h("input",{type:"time",value:f.time,onChange:e=>setF(p=>({...p,time:e.target.value})),
          style:{background:"none",border:"none",color:C.mint,fontSize:14,fontWeight:600,cursor:"pointer",outline:"none"}})),
      h("div",{style:{padding:"12px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:`1px solid ${C.border}`}},
        h("span",{style:{fontSize:14,color:C.text}},"Repetare"),
        h("select",{value:f.repeat,onChange:e=>setF(p=>({...p,repeat:e.target.value})),
          style:{background:"none",border:"none",color:C.mint,fontSize:14,fontWeight:600,cursor:"pointer",outline:"none"}},
          [{v:"none",l:"Niciodata"},{v:"weekly",l:"Saptamanal"},{v:"monthly",l:"Lunar"},{v:"yearly",l:"Anual"}].map(o=>h("option",{key:o.v,value:o.v},o.l)))),
      h("div",{style:{padding:"12px 16px",display:"flex",alignItems:"center",justifyContent:"space-between"}},
        h("span",{style:{fontSize:14,color:C.text}},"🔔 Reminder"),
        h("select",{value:f.notif,onChange:e=>setF(p=>({...p,notif:e.target.value})),
          style:{background:"none",border:"none",color:C.mint,fontSize:14,fontWeight:600,cursor:"pointer",outline:"none"}},
          NOTIF_OPTS.map(o=>h("option",{key:o.v,value:o.v},o.l))))),
    h("button",{onClick:save,style:{width:"100%",background:C.mint,color:C.dark,border:"none",borderRadius:14,padding:"16px",fontSize:16,fontWeight:800,cursor:"pointer",WebkitTapHighlightColor:"transparent"}},"✓  Adauga eveniment")
  );
}

// ADD CAT SHEET
function AddCatSheet({onClose,onSave}){
  const [f,setF]=useState({name:"",breed:"",sex:"F",dob:"",weight:"",color:"",chip:"",steri:"false",vet:"",notes:"",ico:"🐱",bg:"#1D9E75"});
  const emos=["🐱","🐈","🦁","🐯","😸","😺","🐾","🦝"];
  const bgs=["#1D9E75","#BA7517","#185FA5","#993556","#3B6D11","#A32D2D"];
  function save(){if(!f.name)return;onSave({...f,id:Date.now(),steri:f.steri==="true",vax:[],dewI:[],dewE:[],treat:[],cons:[],surg:[],anal:[],wts:f.weight?[{date:new Date().toISOString().slice(0,10),v:parseFloat(f.weight)}]:[]});onClose();}
  return h(Sheet,{title:"Adauga pisica",onClose},
    h("div",{style:{marginBottom:16}},
      h("div",{style:{fontSize:11,color:C.muted,marginBottom:8,fontWeight:700,textTransform:"uppercase",letterSpacing:.8}},"Emoji"),
      h("div",{style:{display:"flex",gap:8,flexWrap:"wrap",marginBottom:10}},
        emos.map(e=>h("button",{key:e,onClick:()=>setF(p=>({...p,ico:e})),style:{fontSize:24,background:f.ico===e?`${C.mint}33`:"none",border:`1.5px solid ${f.ico===e?C.mint:C.border}`,borderRadius:10,padding:"6px 8px",cursor:"pointer",WebkitTapHighlightColor:"transparent"}},e))),
      h("div",{style:{display:"flex",gap:8}},
        bgs.map(c=>h("button",{key:c,onClick:()=>setF(p=>({...p,bg:c})),style:{width:28,height:28,borderRadius:"50%",background:c,cursor:"pointer",border:`3px solid ${f.bg===c?"#fff":"transparent"}`,WebkitTapHighlightColor:"transparent"}})))),
    h("div",{style:{background:C.cardL,borderRadius:14,overflow:"hidden",marginBottom:14}},
      [
        {l:"Nume *",k:"name",type:"text"},
        {l:"Rasa",k:"breed",type:"text"},
        {l:"Data nasterii",k:"dob",type:"date"},
        {l:"Greutate (kg)",k:"weight",type:"number"},
        {l:"Culoare",k:"color",type:"text"},
        {l:"Microcip",k:"chip",type:"text"},
        {l:"Veterinar",k:"vet",type:"text"}
      ].map((field,i,arr)=>h("div",{key:field.k,style:{padding:"12px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:i<arr.length-1?`1px solid ${C.border}`:"none"}},
        h("span",{style:{fontSize:14,color:C.text,minWidth:120}},field.l),
        h("input",{type:field.type,value:f[field.k],onChange:e=>setF(p=>({...p,[field.k]:e.target.value})),
          style:{flex:1,background:"none",border:"none",color:C.mint,fontSize:14,fontWeight:500,outline:"none",textAlign:"right"}})
      ))),
    h("div",{style:{background:C.cardL,borderRadius:14,overflow:"hidden",marginBottom:14}},
      h("div",{style:{padding:"12px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:`1px solid ${C.border}`}},
        h("span",{style:{fontSize:14,color:C.text}},"Sex"),
        h("select",{value:f.sex,onChange:e=>setF(p=>({...p,sex:e.target.value})),style:{background:"none",border:"none",color:C.mint,fontSize:14,fontWeight:600,outline:"none",cursor:"pointer"}},
          h("option",{value:"F"},"Femela"),h("option",{value:"M"},"Mascul"))),
      h("div",{style:{padding:"12px 16px",display:"flex",alignItems:"center",justifyContent:"space-between"}},
        h("span",{style:{fontSize:14,color:C.text}},"Sterilizata"),
        h("select",{value:f.steri,onChange:e=>setF(p=>({...p,steri:e.target.value})),style:{background:"none",border:"none",color:C.mint,fontSize:14,fontWeight:600,outline:"none",cursor:"pointer"}},
          h("option",{value:"false"},"Nu"),h("option",{value:"true"},"Da")))),
    h("div",{style:{background:C.cardL,borderRadius:14,padding:"12px 16px",marginBottom:16}},
      h("div",{style:{fontSize:11,color:C.muted,marginBottom:6,fontWeight:700}},"Observatii"),
      h("textarea",{value:f.notes,onChange:e=>setF(p=>({...p,notes:e.target.value})),rows:3,placeholder:"Observatii...",
        style:{width:"100%",background:"none",border:"none",color:C.text,fontSize:14,outline:"none",resize:"none"}})),
    h("button",{onClick:save,style:{width:"100%",background:C.mint,color:C.dark,border:"none",borderRadius:14,padding:"16px",fontSize:16,fontWeight:800,cursor:"pointer",WebkitTapHighlightColor:"transparent"}},"Salveaza")
  );
}

// DASHBOARD
function Dashboard({cats,meds,onGo}){
  const allNext=cats.flatMap(cat=>{const n=nextAct(cat);return n?[{...n,cn:cat.name,ci:cat.ico,cid:cat.id}]:[];}).sort((a,b)=>new Date(a.date)-new Date(b.date));
  const expM=meds.filter(m=>new Date(m.exp)<new Date());
  const lowM=meds.filter(m=>m.qty<=2&&new Date(m.exp)>=new Date());
  return h("div",{style:{padding:"0 0 16px"}},
    // Stats row
    h("div",{style:{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:16}},
      [{l:"Pisici",v:cats.length,i:"🐱",c:C.mint},{l:"Actiuni",v:allNext.length,i:"📅",c:C.blue},
       {l:"Vax",v:cats.flatMap(c=>c.vax).filter(v=>v.next&&!daysUntil(v.next).includes("trecut")&&parseInt(daysUntil(v.next))<30).length,i:"💉",c:C.amber},
       {l:"Stoc",v:expM.length+lowM.length,i:"⚠️",c:C.red}]
      .map((s,i)=>h("div",{key:i,style:{...card(),padding:"12px 8px",textAlign:"center"}},
        h("div",{style:{fontSize:20,marginBottom:4}},s.i),
        h("div",{style:{fontSize:22,fontWeight:800,color:s.c}},s.v),
        h("div",{style:{fontSize:10,color:C.muted}},s.l)))),
    // Urmatoarele actiuni
    h("div",{style:{...card(),padding:0,marginBottom:12,overflow:"hidden"}},
      h("div",{style:{padding:"12px 16px",borderBottom:`1px solid ${C.border}`}},
        h("span",{style:{fontSize:12,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:.8}},"Urmatoarele actiuni")),
      allNext.length===0
        ?h("div",{style:{padding:"16px",color:C.muted,fontSize:14,textAlign:"center"}},"Nicio actiune programata 🎉")
        :allNext.slice(0,4).map((n,i)=>h("div",{key:i,style:{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",borderBottom:i<Math.min(allNext.length,4)-1?`1px solid ${C.border}`:"none"}},
          h("span",{style:{fontSize:22}},n.ci),
          h("div",{style:{flex:1,minWidth:0}},
            h("div",{style:{fontSize:13,color:C.text,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}},n.label),
            h("div",{style:{fontSize:11,color:C.muted}},n.cn)),
          h(Badge,{col:n.col},daysUntil(n.date))))),
    // Pisici rapide
    h("div",{style:{...card(),padding:0,overflow:"hidden"}},
      h("div",{style:{padding:"12px 16px",borderBottom:`1px solid ${C.border}`}},
        h("span",{style:{fontSize:12,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:.8}},"Pisicile mele")),
      cats.map((cat,i)=>h("div",{key:cat.id,onClick:()=>onGo("cats",cat),style:{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",borderBottom:i<cats.length-1?`1px solid ${C.border}`:"none",cursor:"pointer",WebkitTapHighlightColor:"transparent"}},
        h("div",{style:{width:44,height:44,borderRadius:"50%",background:`${cat.bg}33`,border:`2px solid ${cat.bg}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}},cat.ico),
        h("div",{style:{flex:1}},
          h("div",{style:{fontSize:14,fontWeight:700,color:C.text}},cat.name),
          h("div",{style:{fontSize:12,color:C.muted}},`${cat.breed} · ${calcAge(cat.dob)}`)),
        h("div",{style:{color:C.muted,fontSize:18}},"›"))))
  );
}

// CATS LIST
function CatsList({cats,onSel,onAdd,onShare}){
  return h("div",null,
    h("div",{style:{display:"flex",flexDirection:"column",gap:10}},
      cats.map(cat=>{
        const na=nextAct(cat);
        return h("div",{key:cat.id,style:{...card(),overflow:"hidden"}},
          h("div",{onClick:()=>onSel(cat),style:{padding:"14px 16px",display:"flex",alignItems:"center",gap:14,cursor:"pointer",WebkitTapHighlightColor:"transparent"}},
            h("div",{style:{width:56,height:56,borderRadius:"50%",background:`${cat.bg}33`,border:`2.5px solid ${cat.bg}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,flexShrink:0}},cat.ico),
            h("div",{style:{flex:1,minWidth:0}},
              h("div",{style:{fontSize:16,fontWeight:800,color:C.text,marginBottom:2}},cat.name),
              h("div",{style:{fontSize:12,color:C.muted,marginBottom:6}},cat.breed),
              h("div",{style:{display:"flex",gap:6,flexWrap:"wrap"}},
                h(Badge,{col:C.blue},calcAge(cat.dob)),
                h(Badge,{col:C.mint},`${cat.weight}kg`),
                h(Badge,{col:cat.steri?C.mint:C.amber},cat.steri?"steril.":"nesterol."))),
            h("div",{style:{color:C.muted,fontSize:18,flexShrink:0}},"›")),
          na&&h("div",{style:{padding:"10px 16px",background:`${na.col}0D`,borderTop:`1px solid ${na.col}33`,display:"flex",alignItems:"center",justifyContent:"space-between"}},
            h("span",{style:{fontSize:12,color:na.col,fontWeight:600}},na.label),
            h(Badge,{col:na.col},daysUntil(na.date))),
          h("div",{style:{padding:"10px 16px",borderTop:`1px solid ${C.border}`,display:"flex",justifyContent:"flex-end"}},
            h("button",{onClick:()=>onShare(cat),style:{background:`${C.mint}18`,border:`1px solid ${C.mint}33`,borderRadius:10,padding:"6px 14px",color:C.mint,fontSize:12,fontWeight:700,cursor:"pointer",WebkitTapHighlightColor:"transparent"}},"📄 Raport PDF")));
      })),
    h("button",{onClick:onAdd,style:{width:"100%",marginTop:14,background:C.mint,color:C.dark,border:"none",borderRadius:14,padding:"16px",fontSize:16,fontWeight:800,cursor:"pointer",WebkitTapHighlightColor:"transparent"}},"+ Adauga pisica")
  );
}

// CAT PROFILE
function CatProfile({cat,onBack,customEvents,onShare}){
  const [tab,setTab]=useState("general");
  const tabs=[{id:"general",l:"Info"},{id:"vax",l:"Vaccinuri"},{id:"dew",l:"Depar."},{id:"treat",l:"Tratam."},{id:"cons",l:"Consult."},{id:"surg",l:"Interv."},{id:"anal",l:"Analize"},{id:"wt",l:"Greutate"}];
  return h("div",null,
    // Cat header
    h("div",{style:{...card(),padding:"16px",marginBottom:12}},
      h("div",{style:{display:"flex",alignItems:"center",gap:14,marginBottom:12}},
        h("div",{style:{width:72,height:72,borderRadius:"50%",background:`${cat.bg}33`,border:`3px solid ${cat.bg}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:36,flexShrink:0}},cat.ico),
        h("div",{style:{flex:1}},
          h("div",{style:{fontSize:20,fontWeight:800,color:C.text,marginBottom:3}},cat.name),
          h("div",{style:{fontSize:13,color:C.muted,marginBottom:8}},`${cat.breed} · ${calcAge(cat.dob)}`),
          h("div",{style:{display:"flex",gap:6,flexWrap:"wrap"}},
            h(Badge,{col:cat.sex==="F"?C.purple:C.blue},cat.sex==="F"?"femela":"mascul"),
            h(Badge,{col:C.mint},`${cat.weight}kg`),
            h(Badge,{col:cat.steri?C.mint:C.amber},cat.steri?"sterilizata":"nesterilizata")))),
      h("button",{onClick:onShare,style:{width:"100%",background:`${C.mint}18`,border:`1px solid ${C.mint}44`,borderRadius:12,padding:"11px",color:C.mint,fontSize:14,fontWeight:700,cursor:"pointer",WebkitTapHighlightColor:"transparent"}},"📄 Genereaza Raport PDF / Share")),
    // Tabs scroll
    h("div",{style:{overflowX:"auto",display:"flex",gap:8,marginBottom:12,paddingBottom:4,WebkitOverflowScrolling:"touch",scrollbarWidth:"none"}},
      tabs.map(t=>h(Pill,{key:t.id,active:tab===t.id,onClick:()=>setTab(t.id)},t.l))),
    // Tab content
    h("div",{style:{...card(),padding:0,overflow:"hidden"}},
      tab==="general"&&h("div",null,
        [["Nume",cat.name],["Rasa",cat.breed],["Data nasterii",fmtDate(cat.dob)],["Varsta",calcAge(cat.dob)],["Sex",cat.sex==="F"?"Femela":"Mascul"],["Greutate",`${cat.weight} kg`],["Culoare",cat.color],["Microcip",cat.chip||"—"],["Sterilizata",cat.steri?"Da":"Nu"],["Veterinar",cat.vet]]
          .map(([k,v],i,a)=>h("div",{key:k,style:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"13px 16px",borderBottom:i<a.length-1?`1px solid ${C.border}`:"none"}},
            h("span",{style:{fontSize:14,color:C.muted}},k),
            h("span",{style:{fontSize:14,color:C.text,fontWeight:600,textAlign:"right",maxWidth:"55%"}},v)))),
      tab==="vax"&&h("div",null,
        cat.vax.length===0?h("div",{style:{padding:"20px",color:C.muted,textAlign:"center"}},"Niciun vaccin."):
        cat.vax.map((v,i)=>h("div",{key:v.id,style:{padding:"14px 16px",borderBottom:i<cat.vax.length-1?`1px solid ${C.border}`:"none"}},
          h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}},
            h("span",{style:{fontSize:14,fontWeight:700,color:C.text}},"💉 "+v.name),
            h(Badge,{col:C.mint},fmtDate(v.next))),
          h("div",{style:{fontSize:12,color:C.muted}},`${fmtDate(v.date)} · ${v.vet} · Lot: ${v.lot||"—"}`)))),
      tab==="dew"&&h("div",null,
        h("div",{style:{padding:"12px 16px",background:C.cardL,borderBottom:`1px solid ${C.border}`}},h("span",{style:{fontSize:12,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:.8}},"Interne")),
        cat.dewI.length===0?h("div",{style:{padding:"16px",color:C.muted,textAlign:"center",fontSize:13}},"Nicio deparazitare interna."):
        cat.dewI.map((d,i)=>{const nd=new Date(d.date);nd.setMonth(nd.getMonth()+d.mo);return h("div",{key:d.id,style:{padding:"14px 16px",borderBottom:`1px solid ${C.border}`}},
          h("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:4}},h("span",{style:{fontWeight:700,color:C.text}},d.prod),h(Badge,{col:C.blue},daysUntil(nd.toISOString().slice(0,10)))),
          h("div",{style:{fontSize:12,color:C.muted}},`${d.qty} · ${fmtDate(d.date)} · la ${d.mo} luni`));}),
        h("div",{style:{padding:"12px 16px",background:C.cardL,borderBottom:`1px solid ${C.border}`}},h("span",{style:{fontSize:12,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:.8}},"Externe")),
        cat.dewE.length===0?h("div",{style:{padding:"16px",color:C.muted,textAlign:"center",fontSize:13}},"Nicio deparazitare externa."):
        cat.dewE.map((d,i)=>{const nd=new Date(d.date);nd.setMonth(nd.getMonth()+d.mo);return h("div",{key:d.id,style:{padding:"14px 16px",borderBottom:i<cat.dewE.length-1?`1px solid ${C.border}`:"none"}},
          h("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:4}},h("span",{style:{fontWeight:700,color:C.text}},d.prod),h(Badge,{col:C.amber},daysUntil(nd.toISOString().slice(0,10)))),
          h("div",{style:{fontSize:12,color:C.muted}},`${d.qty} · ${fmtDate(d.date)} · la ${d.mo} luni`));})),
      tab==="treat"&&h("div",null,
        cat.treat.length===0?h("div",{style:{padding:"20px",color:C.muted,textAlign:"center"}},"Niciun tratament."):
        cat.treat.map((t,i)=>h("div",{key:t.id,style:{padding:"14px 16px",borderBottom:i<cat.treat.length-1?`1px solid ${C.border}`:"none"}},
          h("div",{style:{fontSize:14,fontWeight:700,color:C.text,marginBottom:6}},"💊 "+t.drug),
          h("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:4,fontSize:12,color:C.muted}},
            h("div",null,"Doza: ",h("span",{style:{color:C.text}},t.dose)),
            h("div",null,"Frecv: ",h("span",{style:{color:C.text}},t.freq)),
            h("div",null,"Inceput: ",h("span",{style:{color:C.text}},fmtDate(t.start))),
            h("div",null,"Final: ",h("span",{style:{color:C.text}},fmtDate(t.end))))))),
      tab==="cons"&&h("div",null,
        cat.cons.length===0?h("div",{style:{padding:"20px",color:C.muted,textAlign:"center"}},"Nicio consultatie."):
        cat.cons.map((c,i)=>h("div",{key:c.id,style:{padding:"14px 16px",borderBottom:i<cat.cons.length-1?`1px solid ${C.border}`:"none"}},
          h("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:6}},
            h("span",{style:{fontSize:14,fontWeight:700,color:C.text}},"🩺 "+c.reason),
            h(Badge,{col:C.mint},c.cost+" RON")),
          h("div",{style:{fontSize:12,color:C.muted}},c.diag),
          h("div",{style:{fontSize:12,color:C.muted}},c.recs)))),
      tab==="surg"&&h("div",null,
        cat.surg.length===0?h("div",{style:{padding:"20px",color:C.muted,textAlign:"center"}},"Nicio interventie."):
        cat.surg.map((s,i)=>h("div",{key:s.id,style:{padding:"14px 16px",borderBottom:i<cat.surg.length-1?`1px solid ${C.border}`:"none"}},
          h("div",{style:{fontSize:14,fontWeight:700,color:C.text,marginBottom:4}},"🏥 "+s.name),
          h("div",{style:{fontSize:12,color:C.muted}},`${fmtDate(s.date)} · ${s.clinic} · ${s.dr}`)))),
      tab==="anal"&&h("div",null,
        cat.anal.length===0?h("div",{style:{padding:"20px",color:C.muted,textAlign:"center"}},"Nicio analiza."):
        cat.anal.map((a,i)=>h("div",{key:a.id,style:{padding:"14px 16px",borderBottom:i<cat.anal.length-1?`1px solid ${C.border}`:"none"}},
          h("div",{style:{fontSize:14,fontWeight:700,color:C.text,marginBottom:4}},"🔬 "+a.type),
          h("div",{style:{fontSize:12,color:C.muted}},fmtDate(a.date)+" · ",h("span",{style:{color:C.mint}},a.result))))),
      tab==="wt"&&h("div",{style:{padding:"16px"}},
        h("div",{style:{fontSize:12,color:C.muted,marginBottom:12}},"Evolutie greutate"),
        h(MiniChart,{data:cat.wts}),
        h("div",{style:{display:"flex",gap:8,flexWrap:"wrap",marginTop:16}},
          cat.wts.map((w,i)=>h("div",{key:i,style:{background:C.cardL,border:`1px solid ${C.border}`,borderRadius:10,padding:"8px 12px",textAlign:"center"}},
            h("div",{style:{fontSize:10,color:C.muted}},fmtDate(w.date)),
            h("div",{style:{fontSize:15,fontWeight:700,color:C.mint}},w.v+" kg")))))
    )
  );
}

// CALENDAR
function CalendarPage({cats,customEvents,setCustomEvents}){
  const today=new Date();
  const [yr,setYr]=useState(today.getFullYear());
  const [mo,setMo]=useState(today.getMonth());
  const [sel,setSel]=useState(null);
  const [addModal,setAddModal]=useState(false);
  const [addDate,setAddDate]=useState(null);
  const dim=new Date(yr,mo+1,0).getDate();
  const fd=new Date(yr,mo,1).getDay(),off=fd===0?6:fd-1;
  const MN=["Ianuarie","Februarie","Martie","Aprilie","Mai","Iunie","Iulie","August","Septembrie","Octombrie","Noiembrie","Decembrie"];

  function getEvs(day){
    const ds=`${yr}-${String(mo+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
    const evs=[];
    cats.forEach(cat=>{
      cat.vax.forEach(v=>{if(v.next===ds)evs.push({cat:cat.name,catId:cat.id,label:`Vaccin ${v.name}`,col:C.mint,ico:"💉"});});
      cat.dewI.forEach(d=>{const nd=new Date(d.date);nd.setMonth(nd.getMonth()+d.mo);if(nd.toISOString().slice(0,10)===ds)evs.push({cat:cat.name,label:`Dep.int. ${d.prod}`,col:C.blue,ico:"🪱"});});
      cat.dewE.forEach(d=>{const nd=new Date(d.date);nd.setMonth(nd.getMonth()+d.mo);if(nd.toISOString().slice(0,10)===ds)evs.push({cat:cat.name,label:`Dep.ext. ${d.prod}`,col:C.amber,ico:"🐛"});});
      cat.treat.forEach(t=>{if(t.start===ds)evs.push({cat:cat.name,label:`${t.drug}`,col:C.purple,ico:"💊"});});
    });
    customEvents.filter(e=>e.date===ds).forEach(e=>{
      const et=EVT_TYPES.find(t=>t.id===e.type)||EVT_TYPES[0];
      const cn=cats.find(c=>c.id===e.catId);
      evs.push({cat:cn?.name||"",label:e.title,col:et.col,ico:et.ico,time:e.time,note:e.note,custom:true,id:e.id});
    });
    return evs;
  }

  const selEvs=sel?getEvs(sel):[];

  return h("div",null,
    // Month nav
    h("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}},
      h("button",{onClick:()=>{if(mo===0){setMo(11);setYr(y=>y-1);}else setMo(m=>m-1);},style:{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,width:40,height:40,fontSize:20,color:C.text,cursor:"pointer",WebkitTapHighlightColor:"transparent"}},"‹"),
      h("span",{style:{fontSize:16,fontWeight:700,color:C.text}},`${MN[mo]} ${yr}`),
      h("button",{onClick:()=>{if(mo===11){setMo(0);setYr(y=>y+1);}else setMo(m=>m+1);},style:{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,width:40,height:40,fontSize:20,color:C.text,cursor:"pointer",WebkitTapHighlightColor:"transparent"}},"›")),
    // Calendar grid
    h("div",{style:{...card(),overflow:"hidden",marginBottom:12}},
      h("div",{style:{display:"grid",gridTemplateColumns:"repeat(7,1fr)",background:C.cardL,borderBottom:`1px solid ${C.border}`}},
        ["L","M","M","J","V","S","D"].map((d,i)=>h("div",{key:i,style:{padding:"8px 0",textAlign:"center",fontSize:11,fontWeight:700,color:C.muted}},d))),
      h("div",{style:{display:"grid",gridTemplateColumns:"repeat(7,1fr)"}},
        Array(off).fill(null).map((_,i)=>h("div",{key:`e${i}`,style:{minHeight:46}})),
        Array(dim).fill(null).map((_,i)=>{
          const day=i+1,evs=getEvs(day);
          const isT=today.getFullYear()===yr&&today.getMonth()===mo&&today.getDate()===day;
          const isSel=sel===day;
          return h("div",{key:day,onClick:()=>setSel(isSel?null:day),
            style:{minHeight:46,padding:"4px 2px",border:`0.5px solid ${C.border}`,cursor:"pointer",background:isSel?`${C.mint}22`:"transparent",WebkitTapHighlightColor:"transparent"}},
            h("div",{style:{width:26,height:26,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",background:isT?C.mint:"transparent",color:isT?C.dark:C.text,fontSize:13,fontWeight:isT?800:400,margin:"0 auto 2px"}},day),
            evs.length>0&&h("div",{style:{display:"flex",justifyContent:"center",gap:2}},
              evs.slice(0,3).map((ev,ei)=>h("div",{key:ei,style:{width:5,height:5,borderRadius:"50%",background:ev.col}})))
          );
        })
      )),
    // Add button
    h("button",{onClick:()=>{setAddDate(sel?`${yr}-${String(mo+1).padStart(2,"0")}-${String(sel).padStart(2,"0")}`:null);setAddModal(true);},
      style:{width:"100%",background:C.mint,color:C.dark,border:"none",borderRadius:14,padding:"14px",fontSize:15,fontWeight:800,cursor:"pointer",marginBottom:12,WebkitTapHighlightColor:"transparent"}},
      `+ Adauga eveniment${sel?` (${sel} ${MN[mo]})`:" nou"}`),
    // Selected day events
    sel&&h("div",{style:{...card(),overflow:"hidden"}},
      h("div",{style:{padding:"12px 16px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}},
        h("span",{style:{fontSize:13,fontWeight:700,color:C.text}},`${sel} ${MN[mo]} ${yr}`),
        h("span",{style:{fontSize:12,color:C.muted}},`${selEvs.length} evenimente`)),
      selEvs.length===0?h("div",{style:{padding:"20px",color:C.muted,fontSize:13,textAlign:"center"}},"Niciun eveniment in aceasta zi."):
      selEvs.map((ev,i)=>h("div",{key:i,style:{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",borderBottom:i<selEvs.length-1?`1px solid ${C.border}`:"none"}},
        h("div",{style:{width:38,height:38,borderRadius:10,background:`${ev.col}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}},ev.ico),
        h("div",{style:{flex:1}},
          h("div",{style:{fontSize:13,fontWeight:700,color:C.text}},ev.label),
          h("div",{style:{fontSize:11,color:C.muted,marginTop:2}},
            ev.cat,ev.time?" · 🕐 "+ev.time:"",ev.note?" · "+ev.note:"")),
        ev.custom&&h("button",{onClick:()=>setCustomEvents(p=>p.filter(e=>e.id!==ev.id)),style:{background:"none",border:"none",color:C.muted,fontSize:20,cursor:"pointer",padding:"4px",WebkitTapHighlightColor:"transparent"}},"×")))),
    addModal&&h(AddEventSheet,{cats,initialDate:addDate,onClose:()=>setAddModal(false),onSave:ev=>{const ne=[...customEvents,ev];setCustomEvents(ne);save("events",ne);setAddModal(false);}})
  );
}

// HISTORY
function HistPage({cats,customEvents}){
  const [filter,setFilter]=useState("all");
  const all=[];
  cats.forEach(cat=>{
    cat.vax.forEach(v=>all.push({date:v.date,type:"vax",label:`Vaccin ${v.name}`,cat:cat.name,ico:"💉",col:C.mint}));
    cat.dewI.forEach(d=>all.push({date:d.date,type:"dew",label:`Dep.int. ${d.prod}`,cat:cat.name,ico:"🪱",col:C.blue}));
    cat.dewE.forEach(d=>all.push({date:d.date,type:"dew",label:`Dep.ext. ${d.prod}`,cat:cat.name,ico:"🐛",col:C.amber}));
    cat.treat.forEach(t=>all.push({date:t.start,type:"treat",label:`Tratament ${t.drug}`,cat:cat.name,ico:"💊",col:C.purple}));
    cat.cons.forEach(c=>all.push({date:"2025-04-20",type:"cons",label:`Consultatie: ${c.reason}`,cat:cat.name,ico:"🩺",col:C.blue}));
    cat.surg.forEach(s=>all.push({date:s.date,type:"surg",label:`Interventie: ${s.name}`,cat:cat.name,ico:"🏥",col:C.red}));
    cat.anal.forEach(a=>all.push({date:a.date,type:"anal",label:`Analiza: ${a.type}`,cat:cat.name,ico:"🔬",col:C.mint}));
  });
  (customEvents||[]).forEach(e=>{
    const et=EVT_TYPES.find(t=>t.id===e.type)||EVT_TYPES[0];
    const cn=cats.find(c=>c.id===e.catId);
    all.push({date:e.date,type:e.type,label:e.title,cat:cn?.name||"",ico:et.ico,col:et.col});
  });
  const filters=[{id:"all",l:"Toate"},{id:"vax",l:"Vaccinuri"},{id:"treat",l:"Tratamente"},{id:"cons",l:"Consult."}];
  const shown=all.filter(e=>filter==="all"||e.type===filter).sort((a,b)=>new Date(b.date)-new Date(a.date));
  return h("div",null,
    h("div",{style:{overflowX:"auto",display:"flex",gap:8,marginBottom:14,paddingBottom:4,WebkitOverflowScrolling:"touch",scrollbarWidth:"none"}},
      filters.map(f=>h(Pill,{key:f.id,active:filter===f.id,onClick:()=>setFilter(f.id)},f.l))),
    h("div",{style:{...card(),overflow:"hidden"}},
      shown.length===0?h("div",{style:{padding:"24px",color:C.muted,textAlign:"center"}},"Niciun eveniment."):
      shown.map((ev,i)=>h("div",{key:i,style:{display:"flex",alignItems:"center",gap:12,padding:"13px 16px",borderBottom:i<shown.length-1?`1px solid ${C.border}`:"none"}},
        h("div",{style:{width:36,height:36,borderRadius:10,background:`${ev.col}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}},ev.ico),
        h("div",{style:{flex:1}},
          h("div",{style:{fontSize:13,fontWeight:700,color:C.text}},ev.label),
          h("div",{style:{fontSize:11,color:C.muted,marginTop:2}},ev.cat)),
        h("div",{style:{fontSize:11,color:C.muted,flexShrink:0}},fmtDate(ev.date)))))
  );
}

// MEDS
function MedsPage({meds,setMeds}){
  const [adding,setAdding]=useState(false);
  const [form,setForm]=useState({name:"",qty:"",unit:"comprimate",exp:""});
  function add(){
    if(!form.name||!form.qty)return;
    const nm=[...meds,{id:Date.now(),...form,qty:parseInt(form.qty)}];
    setMeds(nm);save("meds",nm);
    setForm({name:"",qty:"",unit:"comprimate",exp:""});setAdding(false);
  }
  return h("div",null,
    h("button",{onClick:()=>setAdding(true),style:{width:"100%",background:C.mint,color:C.dark,border:"none",borderRadius:14,padding:"14px",fontSize:15,fontWeight:800,cursor:"pointer",marginBottom:14,WebkitTapHighlightColor:"transparent"}},"+ Adauga medicament"),
    h("div",{style:{...card(),overflow:"hidden"}},
      meds.length===0?h("div",{style:{padding:"24px",color:C.muted,textAlign:"center"}},"Niciun medicament adaugat."):
      meds.map((m,i)=>{
        const exp=new Date(m.exp)<new Date(),low=m.qty<=2,dl=Math.ceil((new Date(m.exp)-new Date())/86400000);
        return h("div",{key:m.id,style:{padding:"14px 16px",borderBottom:i<meds.length-1?`1px solid ${C.border}`:"none"}},
          h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}},
            h("span",{style:{fontSize:15,fontWeight:700,color:C.text}},"💊 "+m.name),
            h(Badge,{col:low||exp?C.red:C.mint},`${m.qty} ${m.unit}`)),
          h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"}},
            h("span",{style:{fontSize:12,color:C.muted}},"Expira: "+fmtDate(m.exp)),
            h(Badge,{col:exp?C.red:dl<30?C.amber:C.mint},exp?"expirat":dl<30?`${dl} zile`:"OK")),
          (exp||low)&&h("div",{style:{marginTop:8,padding:"6px 10px",background:exp?C.redBg:C.amberBg,borderRadius:8,fontSize:11,color:exp?C.red:C.amber,fontWeight:700}},
            exp?"⚠️ Medicament expirat!":"⚠️ Stoc redus — recomanda mai mult"));
      })),
    adding&&h(Sheet,{title:"Adauga medicament",onClose:()=>setAdding(false)},
      h("div",{style:{background:C.cardL,borderRadius:14,overflow:"hidden",marginBottom:14}},
        h("div",{style:{padding:"12px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:`1px solid ${C.border}`}},
          h("span",{style:{fontSize:14,color:C.text}},"Denumire"),
          h("input",{value:form.name,onChange:e=>setForm(p=>({...p,name:e.target.value})),placeholder:"ex: Milbemax",style:{flex:1,background:"none",border:"none",color:C.mint,fontSize:14,fontWeight:500,outline:"none",textAlign:"right"}})),
        h("div",{style:{padding:"12px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:`1px solid ${C.border}`}},
          h("span",{style:{fontSize:14,color:C.text}},"Cantitate"),
          h("input",{type:"number",value:form.qty,onChange:e=>setForm(p=>({...p,qty:e.target.value})),placeholder:"ex: 4",style:{flex:1,background:"none",border:"none",color:C.mint,fontSize:14,fontWeight:500,outline:"none",textAlign:"right"}})),
        h("div",{style:{padding:"12px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:`1px solid ${C.border}`}},
          h("span",{style:{fontSize:14,color:C.text}},"Unitate"),
          h("select",{value:form.unit,onChange:e=>setForm(p=>({...p,unit:e.target.value})),style:{background:"none",border:"none",color:C.mint,fontSize:14,fontWeight:600,outline:"none",cursor:"pointer"}},
            ["comprimate","pipete","flacoane","cutii","fiole"].map(u=>h("option",{key:u,value:u},u)))),
        h("div",{style:{padding:"12px 16px",display:"flex",alignItems:"center",justifyContent:"space-between"}},
          h("span",{style:{fontSize:14,color:C.text}},"Data expirare"),
          h("input",{type:"date",value:form.exp,onChange:e=>setForm(p=>({...p,exp:e.target.value})),style:{background:"none",border:"none",color:C.mint,fontSize:14,fontWeight:500,outline:"none",textAlign:"right"}}))),
      h("button",{onClick:add,style:{width:"100%",background:C.mint,color:C.dark,border:"none",borderRadius:14,padding:"16px",fontSize:16,fontWeight:800,cursor:"pointer",WebkitTapHighlightColor:"transparent"}},"Salveaza"))
  );
}

// MAIN APP
function App(){
  const [cats,setCats]=useState(()=>load("cats",CATS_INIT));
  const [meds,setMeds]=useState(()=>load("meds",MEDS_INIT));
  const [customEvents,setCustomEvents]=useState(()=>load("events",[]));
  const [page,setPage]=useState("dash");
  const [selCat,setSelCat]=useState(null);
  const [addCat,setAddCat]=useState(false);
  const [shareCat,setShareCat]=useState(null);

  useEffect(()=>save("cats",cats),[cats]);

  function go(pageId,cat=null){setPage(pageId);setSelCat(cat);}

  // Topbar title
  const topTitle=selCat?selCat.name:NAV.find(n=>n.id===page)?.l||"CatCare";

  return h("div",{style:{display:"flex",flexDirection:"column",height:"100vh",height:"100dvh",background:C.dark,overflow:"hidden"}},
    // TOP BAR
    h("div",{style:{background:C.card,borderBottom:`1px solid ${C.border}`,paddingTop:"env(safe-area-inset-top)",flexShrink:0,zIndex:20}},
      h("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 16px"}},
        h("div",{style:{display:"flex",alignItems:"center",gap:10}},
          selCat
            ?h("button",{onClick:()=>setSelCat(null),style:{background:"none",border:"none",color:C.mint,fontSize:15,cursor:"pointer",padding:"4px 0",WebkitTapHighlightColor:"transparent"}},"← Inapoi")
            :h("div",{style:{display:"flex",alignItems:"center",gap:8}},
              h("div",{style:{width:30,height:30,borderRadius:8,background:C.mintBg,border:`1px solid ${C.mint}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}},"🐾"),
              h("span",{style:{fontSize:16,fontWeight:800,color:C.text}},"CatCare"))),
        h("span",{style:{fontSize:16,fontWeight:700,color:C.text,flex:1,textAlign:"center"}},selCat?selCat.name:""),
        selCat
          ?h("button",{onClick:()=>setShareCat(selCat),style:{background:`${C.mint}18`,border:`1px solid ${C.mint}44`,borderRadius:10,padding:"6px 10px",color:C.mint,fontSize:12,fontWeight:700,cursor:"pointer",WebkitTapHighlightColor:"transparent"}},"PDF")
          :h("div",{style:{width:60}})
      )
    ),

    // MAIN SCROLL AREA
    h("div",{style:{flex:1,overflowY:"auto",WebkitOverflowScrolling:"touch",padding:"14px 16px 16px"}},
      page==="dash"&&!selCat&&h(Dashboard,{cats,meds,onGo:go}),
      page==="cats"&&!selCat&&h(CatsList,{cats,onSel:c=>{setSelCat(c);},onAdd:()=>setAddCat(true),onShare:c=>setShareCat(c)}),
      page==="cats"&&selCat&&h(CatProfile,{cat:selCat,onBack:()=>setSelCat(null),customEvents,onShare:()=>setShareCat(selCat)}),
      page==="cal"&&h(CalendarPage,{cats,customEvents,setCustomEvents}),
      page==="hist"&&h(HistPage,{cats,customEvents}),
      page==="meds"&&h(MedsPage,{meds,setMeds})
    ),

    // BOTTOM NAV BAR
    h("div",{style:{background:C.card,borderTop:`1px solid ${C.border}`,display:"flex",paddingBottom:"env(safe-area-inset-bottom)",flexShrink:0,zIndex:20}},
      NAV.map(n=>h("button",{key:n.id,onClick:()=>{go(n.id);},
        style:{flex:1,background:"none",border:"none",padding:"10px 4px 8px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3,WebkitTapHighlightColor:"transparent"}},
        h("span",{style:{fontSize:22}},n.i),
        h("span",{style:{fontSize:9,fontWeight:page===n.id?700:400,color:page===n.id?C.mint:C.muted}},n.l)))
    ),

    // MODALS
    addCat&&h(AddCatSheet,{onClose:()=>setAddCat(false),onSave:cat=>{const nc=[...cats,cat];setCats(nc);save("cats",nc);setAddCat(false);}}),
    shareCat&&h(ShareSheet,{cat:shareCat,customEvents,onClose:()=>setShareCat(null)})
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(h(App,null));
