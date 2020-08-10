var database = firebase.database();
var accs;
var acc;

const LoginBody = '<body><h2 style="margin-left: 10px;">Family Plus</h2><div id="Logindiv"><h3 style="margin-left: 32.25%;">Login to Family Plus</h3><h5 class="username" style="margin-bottom: 0px;">Username</h5><br><input type="text" id="username"></input><br><h5 class="password" style="margin-bottom: 0px">Password</h5><br><input type="password" id="password"></input><br><button type="button" id="logBtn" onclick="login()">Login</button><br><p style="font-size: 13px; color: #ccccccaa; margin-left: 22%;">Need an account? <a onclick="change();">Register</a></p></div></body>';
const SignupBody = '<body><h2 style="margin-left: 10px;">Family Plus</h2><div id="Logindiv"><h3 style="margin-left: 32.25%;">Sign up for Family Plus</h3><h5 class="username" style="margin-bottom: 0px;">Your Username</h5><br><input type="text" id="username"></input><br><h5 class="password" style="margin-bottom: 0px">Your Password</h5><br><input type="password" id="password"></input><br><button type="button" id="logBtn" onclick="login();">Sign up</button><br><p style="font-size: 13px; color: #ccccccaa; margin-left: 22%;">Already have an account? <a onclick="change();">Log in</a></p></div></body>';
const Dashboard = '<body style="background-image:none;"><div style="position: absolute; top: 0%;color: black; background-color: cornflowerblue; width: 100%;"><h2 style="margin-left: 10px;">Family Plus</h2><img src="user-solid.svg" width="30" height="30" style="position: absolute; top: 20%; left: 75%;"><h3 style="position:absolute; top: 0%; left: 78%;">Sample User Name</h3></div><div class="sidenav"><div id="Das" onclick="changenav(`das`);">Dashboard</div><div id="Fam" onclick="changenav(`fam`);">Family Tree</div></div><div id="maincontent" style="background-color: white; text-align: center"><h3>Your family tree</h3></div></body>';

var landingState = "login";

window.onscroll = ()=>myFunction();
window.onload = ()=>{
    database.ref("accounts").on('value',data=>accs=data.val());
    if(document.location.pathname == "/landing.html"){
        change("login");
    }
};

let header = document.getElementById("head");
let sticky = header.offsetTop;

myFunction =()=>{
    if (window.pageYOffset > sticky)
        header.classList.add("sticky");
    else
        header.classList.remove("sticky");
}

Login = ()=>{
    window.location.href="/landing.html";
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
    else if(landingState == "signup"){
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
function change(change){
    if(change){
        landingState = change;
        if(change == "login")
            document.body.innerHTML = LoginBody;
        else if(change == "signup")
            document.body.innerHTML = SignupBody;
    }
    if(landingState == "login"){
        landingState = "signup";
        document.body.innerHTML = SignupBody;
    }
    else if(landingState == "signup"){
        landingState = "login";
        document.body.innerHTML = LoginBody;
    }
}
function createDashboard(){
    document.getElementsByTagName("h3")[0].innerHTML = acc.username;
    let tree = document.getElementById("maincontent");
    if(acc.family == null){
        let g = tree.innerHTML;
        tree.innerHTML = `${g}<p style='margin-top: 30px;'>Your family tree is yet to be created</p><button onclick="changenav(\'fam\'); acc.createTree();">Create your Family Tree</button>`;
    } else {
        let g = tree.innerHTML;
        tree.innerHTML = `${g}<p style='margin-top: 30px;'></p>`;
        drawTree();
    }
}
function drawTree(){
    let fam = acc.family.sons;
    let div = document.createElement('div');
    div.innerHTML = acc.username;
    div.classList.add("tree");    
    document.getElementById('maincontent').appendChild(div);
    let div2 = document.createElement('div');
    div2.classList.add("line");
    document.getElementById('maincontent').appendChild(div2);
    for(var a in fam){
        let div2 = document.createElement('div');
        div2.classList.add("line");
        document.getElementById('maincontent').appendChild(div2);
        let div1 = document.createElement('div');
        div1.innerHTML = fam[a].name;
        div1.classList.add("tree");
        document.getElementById('maincontent').appendChild(div1);
    }
}
function changenav(asd){
    var dasBody = '<h3>Your family tree</h3>';
    if(acc.family == null)
        var famBody = '<div style="background-color: white;" id="MainDiv"><h2 style="text-align: center;">You have not created your family tree</h2>Get started by adding a member<p></p><p style="padding-left: 10px;"></p><h3>Add A Family Member</h3><label for="check1">A Son</label><input type="checkbox" id="check1"><label for="check2">A Daughter</label><input type="checkbox" id="check2" disabled><label for="check3">A Parent</label><input type="checkbox" id="check3" disabled><h5>What is your son\'s username?</h5><input id="famname"><br><br><button onclick="send();">Add Son</button></div>';
    else {
        var famBody = `<div style="background-color: white;" id="MainDiv"><h3>Add A Family Member</h3><label for="check1">A Son</label><input type="checkbox" id="check1"><label for="check2">A Daughter</label><input type="checkbox" id="check2" disabled><label for="check3">A Parent</label><input type="checkbox" id="check3" disabled><h5>What is your son\'s username?</h5><input id="famname"><br><br><button onclick="send();">Add Son</button> </div>`;
    }
    if(asd == "das"){
        document.getElementById("maincontent").innerHTML = dasBody;
        createDashboard();
    }
    else if(asd == "fam")
        document.getElementById("maincontent").innerHTML = famBody;
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