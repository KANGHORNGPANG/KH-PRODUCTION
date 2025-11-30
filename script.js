let subjectCount = 0;
let availableIds = [];

function createParticles(count=40){
    for(let i=0;i<count;i++){
        const p = document.createElement('div');
        p.className='particle';
        p.style.left = Math.random()*100 + 'vw';
        p.style.animationDuration = (5+Math.random()*5)+'s';
        document.body.appendChild(p);
    }
}
createParticles();

function addSubject(savedData=null) {
    let newId = availableIds.length > 0 ? availableIds.shift() : ++subjectCount;
    const div = document.createElement('div');
    div.className='subject-box';
    div.id='subject'+newId;

    let partsHTML='';
    for(let i=1;i<=10;i++){
        const val = savedData?savedData[`p${i}`]:'';
        const t = savedData?savedData[`p${i}_total`]:'';
        partsHTML += `
            Part ${i}: 
            <input type="number" id="s${newId}_p${i}" value="${val}" oninput="calculate(${newId})"> /
            <input type="number" id="s${newId}_p${i}_total" value="${t}" oninput="calculate(${newId})"><br>
        `;
    }

    const nameVal = savedData?savedData.name:'';

    div.innerHTML = `
        <h3>Subject ${newId}</h3>
        Name: <input type="text" id="name${newId}" placeholder="Subject name" value="${nameVal}"><br><br>
        ${partsHTML}
        <div class="total" id="total${newId}">Total: 0 / 0 (0%)</div>
        <button class="delete-btn" onclick="deleteSubject(${newId})"><i class="fas fa-trash"></i></button>
    `;

    document.getElementById('subjects').appendChild(div);
    calculate(newId);
}

function deleteSubject(id){
    const box=document.getElementById('subject'+id);
    if(box) box.remove();
    availableIds.push(id);
    availableIds.sort((a,b)=>a-b);
    calculateOverall();
}

function calculate(id){
    let total=0,max=0;
    for(let i=1;i<=10;i++){
        const val = Number(document.getElementById(`s${id}_p${i}`).value)||0;
        const t = Number(document.getElementById(`s${id}_p${i}_total`).value)||0;
        total += val; 
        max += t;
    }
    const percent=max?((total/max)*100).toFixed(2):0;
    document.getElementById(`total${id}`).innerHTML=`Total: ${total} / ${max} (${percent}%)`;
    calculateOverall();
}

function calculateOverall(){
    let allTotal=0,allMax=0;
    document.querySelectorAll('.subject-box').forEach(box=>{
        const id = Number(box.id.replace("subject",""));
        for(let i=1;i<=10;i++){
            allTotal += Number(document.getElementById(`s${id}_p${i}`).value)||0;
            allMax += Number(document.getElementById(`s${id}_p${i}_total`).value)||0;
        }
    });
    
    const percent = allMax ? ((allTotal/allMax)*100).toFixed(2):0;

    let status = percent>=40 ? "PASS ⭐" : "FAIL ❌";
    let color="black";
    if(percent<=40) color="red";
    else if(percent<=50) color="yellow";
    else if(percent<=60) color="orange";
    else if(percent<=70) color="pink";
    else if(percent<=80) color="green";
    else color="blue";

    const overallDiv = document.getElementById("overallResult");
    overallDiv.style.color=color;
    overallDiv.innerHTML=`Total Score: ${allTotal} / ${allMax} | Average: ${percent}% | ${status}`;
}

function saveSubjects(){
    const data=[];
    document.querySelectorAll('.subject-box').forEach(box=>{
        const i = Number(box.id.replace("subject",""));
        const sub = {name:document.getElementById(`name${i}`).value};
        for(let j=1;j<=10;j++){
            sub[`p${j}`] = document.getElementById(`s${i}_p${j}`).value;
            sub[`p${j}_total`] = document.getElementById(`s${i}_p${j}_total`).value;
        }
        data.push(sub);
    });
    localStorage.setItem('subjectsData',JSON.stringify(data));
    alert("✅ Subjects saved!");
}

function sortSubjects(){
    const container = document.getElementById('subjects');
    const boxes = Array.from(container.children);
    boxes.sort((a,b)=>{
        const nameA = document.getElementById(`name${a.id.replace('subject','')}`).value.toUpperCase();
        const nameB = document.getElementById(`name${b.id.replace('subject','')}`).value.toUpperCase();
        return nameA.localeCompare(nameB);
    });
    boxes.forEach(box=>container.appendChild(box));
}

function exportPDF(){
    window.print();
}

function setTheme(theme){
    if(theme==="pink") document.body.style.background="linear-gradient(135deg, #ffd0e0, #ffc0cb, #ffb6c1)";
    else if(theme==="blue") document.body.style.background="linear-gradient(135deg, #d0f0fd, #b0e0ff, #a0d8ff)";
    else if(theme==="dark") document.body.style.background="#1e1e2f";
}

window.onload = function(){
    const saved = JSON.parse(localStorage.getItem('subjectsData'))||[];
    if(saved.length>0) saved.forEach(sub=>addSubject(sub));
};
