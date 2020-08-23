var database = firebase.database();
var accs;
var acc;

        
const LoginBody = '<div id="background" style="position: absolute; top: 0%; left: 0%; height: 100vh; width: 100vw;"></div><div class="header" id="head" style="backdrop-filter: blur(5px);"><h2 style="margin-left: 50px; cursor: pointer; color: black;" onclick="document.location.pathname=`/index.html`">Family Plus</h2><a href="about.html" class="href" style="top: 4%;left: 80%; color: black;">About</a><a href="landing.html" class="href" style="top: 4%;left: 85%; color: black;">Login</a><a href="landing.html" class="href" style="top: 4%;left: 90%; color: black;">Sign Up</a></div><div id="Logindiv"><h3 style="margin-left: 32.25%;">Login to Family Plus</h3><input type="text" id="username" onfocus="document.getElementById(`usela`).style.top=`19%`;" onblur="if(this.value == ``)document.getElementById(`usela`).style.top=`24%`;"></input><br><label for = "username" class="username" style="margin-bottom: 0px;" id="usela">Username</label><br><input type="password" id="password" onfocus="document.getElementById(`pssla`).style.top= `40%`;" onblur="if(this.value == ``)document.getElementById(`pssla`).style.top=`45%`;"></input><br><label for="password"class="password" style="margin-bottom: 0px" id="pssla">Password</label><br><button type="button" class="logBtn" onclick="login()">Login</button><button onclick="signup();" class="logBtn" style="margin-left: 10px">Sign Up</button></div>';
const Dashboard = '<body style="background-image:none;"><div style="position: absolute; top: 0%;color: black; background-color: cornflowerblue; width: 100%;"><h2 style="margin-left: 10px;">Family Plus</h2><img src="user-solid.svg" width="30" height="30" style="position: absolute; top: 20%; left: 75%;"><h3 style="position:absolute; top: 0%; left: 78%;">Sample User Name</h3><button onclick="logout();" id="logoutBtn">Log Out</button></div><div class="sidenav"><div id="Das" onclick="changenav(`das`);">Dashboard</div><div id="Fam" onclick="changenav(`fam`);">Family Tree</div><div id="Loc" onclick="changenav(`loc`);">Track Family</div></div><div id="maincontent" style="background-color: white; text-align: center;"><h3>Your family tree</h3></div></body>';

var landingState = "login";
loadNam = ()=> {
    setTimeout(() => {
        document.getElementById("firstpageh1").style.marginLeft = "0px";
        document.getElementById("firstpageh1").style.opacity = "1";
    }, 250);
    setTimeout(() => {
        document.getElementById("firstpageh2").style.marginTop = "0px";
        document.getElementById("firstpageh2").style.opacity = "1";
    }, 1000);
    setTimeout(() => {
        document.getElementById("firstpageBtn").style.marginLeft = "0px";
        document.getElementById("firstpageBtn").style.opacity = "1";
        document.getElementById("firstpage").onmousemove = (event) =>{
            let x = Math.floor(event.screenX - 188);
            let y = Math.floor(event.screenY - 131);
            let old_max = 394;
            let old_min = 71;
            let ymap = ( (y - old_min) / (old_max - old_min) ) * (5 - (-5)) + (-5);
            old_max = 394;
            old_min = -1;
            let xmap = ( (x - old_min) / (old_max - old_min) ) * (5 - (-5)) + (-5);
            document.getElementById("firstpage").style.transform = "rotateX("+(-ymap)+"deg) rotateY("+(xmap)+"deg)";
        };
    }, 1000);
    setTimeout(() => {
        VANTA.HALO({
                el: "#background",
                mouseControls: true,
                touchControls: true,
                gyroControls: false,
                minHeight: 200.00,
                minWidth: 200.00,
                baseColor: 0x947de,
                backgroundColor: 0xb102d
          });
    }, 750);
}
let header = document.getElementById("head");
let sticky = header.offsetTop;

Login = ()=>window.location.href="/landing.html";

function logout(){
    acc = undefined;
    landingState = "login";
    document.body.innerHTML = LoginBody;
}
function login(){
    let name = document.getElementById("username");
    let pass = document.getElementById("password");

    if(landingState == "login"){
        let found = false;
        let found2 = false;
        for(var s in accs){
            if(name.value == s){
                found = true;
                if(pass.value == accs[s].sd.password)
                    found2 = true;
            }
        }
        if(found == false){
            alert("Username not found");
            return null;
        } else if(found2 == false){
            alert("Wrong password. Please try again");
            return null;
        }
        acc = new account(accs[name.value].sd);
        if(accs[acc.username].sd.family == null)
            acc.family = null;
    }
    landingState = "dashboard";
    document.body.innerHTML = Dashboard;
    createDashboard();
}
function signup(){
    let name = document.getElementById("username");
    let pass = document.getElementById("password");

    if(landingState == "login"){
        if(name.value==""){
            alert("we need a username!");
            return null;
        }
        if(pass.value==""){
            alert("we need a password!");
            return null;
        } else if(pass.value.length < 6){
            alert("password must be of at least 6 characters");
            return null;
        }
        for(var a in accs){
            if(name.value == a){
                alert("Existing account with given username. Please login");
                return null;
            }
        }
        acc = new account();
        acc.createAccount(name.value,pass.value);
        database.ref('accounts/'+name.value).set({
            sd: acc
        });
        if(accs[acc.username].sd.family == null)
            acc.family = null;
    }
    landingState = "dashboard";
    document.body.innerHTML = Dashboard;
    createDashboard();
}
function createDashboard(){
    document.getElementsByTagName("h3")[0].innerHTML = acc.username;
    let tree = document.getElementById("maincontent");
    if(acc.family == null){
        let g = tree.innerHTML;
        tree.innerHTML = `${g}<p style='margin-top: 30px;'>Your family tree is yet to be created</p><button onclick="changenav(\'fam\'); acc.createTree();">Create your Family Tree</button>`;
    } else {
        let g = tree.innerHTML;
        tree.innerHTML = `${g}<canvas id="famCanvas" width="800" height="500"></canvas>`;
        drawTree();
    }
}
function drawTree(){
    let ctx = document.getElementById('famCanvas').getContext('2d');
    ctx.fillStyle = '#ff4444';
    ctx.fillRect(350,100,100,50);
    let mepos = {x: 350, y: 100};
    ctx.font="bold 25px Recursive";
    ctx.fillStyle = 'black';
    ctx.textAlign = "center";
    ctx.fillText("You", mepos.x+50, mepos.y+35);
    if(acc.family.sons){
        ctx.fillRect(mepos.x+45,mepos.y+50,10,15);
        let sons = acc.family.sons;
        let le = Object.keys(acc.family.sons).length;
        let l = mepos.x+le*50;
        let prevl = l;
        for(var p in sons){
            ctx.fillStyle="black";
            ctx.fillRect(prevl-5,mepos.y+65,10,50);
            ctx.fillStyle="#ffaaaa";
            ctx.fillRect(prevl-40,mepos.y+115,80,40);
            ctx.font="normal 15px Recursive";
            ctx.fillStyle="black";
            ctx.fillText(sons[p].name,prevl,140+mepos.y);
            prevl -= 100;
        }
        ctx.fillRect(prevl+100,mepos.y+65,l-prevl-100,10);
    }
    if(acc.family.parents){
        ctx.fillStyle = "black";
        ctx.fillRect(mepos.x+45,mepos.y-50,10,50);
        ctx.fillRect(mepos.x,mepos.y-55,100,10);
        if(acc.family.parents.father){
            ctx.fillStyle = "#ff2222";
            ctx.fillRect(mepos.x-100,mepos.y-80,100,50);
            ctx.font = "bold 13px Recursive";
            ctx.fillStyle = "black";
            ctx.fillText("father",mepos.x-50,mepos.y-65);
            ctx.font = "bold 17px Recursive";
            ctx.fillText(acc.family.parents.father.name,mepos.x-50,mepos.y-40);
        }
        if(acc.family.parents.mother){
            ctx.fillStyle = "#ff2222";
            ctx.fillRect(mepos.x+100,mepos.y-80,100,50);
            ctx.font = "bold 13px Recursive";
            ctx.fillStyle = "black";
            ctx.fillText("mother",mepos.x+150,mepos.y-65);
            ctx.font = "bold 17px Recursive";
            ctx.fillText(acc.family.parents.mother.name,mepos.x+150,mepos.y-40);
        }
    }
}
function changenav(asd){
    var dasBody = '<h3>Your family tree</h3>';
    var locBody = '<h3>Track your Children Here</h3><p>Track your child\'s location and ensure his/her safety<br><span style="color: red">Warning: You can only track children\'s location</span><br><br><span style="font-weight: bold; font-size: 20px;">This feature has intentionally not been implemented because this is a prototype</span>';
    var famBody;
    if(acc.family == null)
        famBody = '<div style="background-color: white;" id="MainDiv"><h2 style="text-align: center;">Create Your own family tree</h2><h3>Add A Family Member</h3><label for="check1">A Child</label><input type="radio" id="check1" name="rela" value="child"><label for="check2">A Sibling</label><input type="radio" id="check2" name="rela" value="sibling" disabled><label for="check3">A Parent</label><input type="radio" id="check3" name="rela" value="parent" disabled><h5>What is your relative\'s username?</h5><input id="famname"><br><br><button onclick="send();">Add Child</button></div>';
    else {
        famBody = `<div style="background-color: white;" id="MainDiv"><h3>Add A Family Member</h3><label for="check1">A Child</label><input type="radio" id="check1" name="rela"><label for="check2">     A Sibling</label><input type="radio" id="check2" name="rela" disabled><label for="check3">     A Parent</label><input type="radio" id="check3" name="rela" disabled><h5>What is your relative\'s username?</h5><input id="famname"><br><br><button onclick="send();" style="margin-bottom: 10px;">Add Child</button></div>`;
    }
    if(asd == "das"){
        document.getElementById("maincontent").innerHTML = dasBody;
        createDashboard();
    }
    else if(asd == "fam"){
        document.getElementById("maincontent").innerHTML = famBody;
    }
    else if(asd == "loc"){
        document.getElementById("maincontent").innerHTML = locBody;
    }
}
function send(){
    let name = document.getElementById("famname");
    if(name.value == ""){
        alert("please give a username");
        return null;
    }
    if(document.getElementById("check1").checked == false){
        alert("please specify a relation");
        return null;
    }
    let found = false;
    for(var p in accs){
        if(p == name.value)
            found = true;
    }
    if(found == false){
        alert("user name not found");
        return 0;
    }
    acc.addSon({name: name.value});
}