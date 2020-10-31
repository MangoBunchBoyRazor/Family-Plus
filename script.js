//Database variable
var database = firebase.database();
var auth = firebase.auth();
//Contains all the accounts in the database
var accs;
//Contains the account with which the user has logged in
var acc;

//Default screen when the page first loads up
var landingState = "login";
var Userflag = "login";
var UserSetup;

window.addEventListener("load",function (){
    auth.onAuthStateChanged(function(user){
        if (user) {
            if(user.displayName == null)
                UserSetup = false;
            else
                UserSetup = true;
            database.ref('accounts').on('value', function(data){
                accs = data.val();
                if(landingState == "login"){
                    if(Userflag == "login" && UserSetup){
                        acc = new account(accs[user.displayName]);
                        if(accs)
                            if(accs[acc.name].family == null)
                                acc.family = null;

                        console.log("hello");
                    } else if(Userflag == "signup"){
                        acc = new account();
                        landingState = "dashboard";
                        createDashboard();
                    }
                    document.getElementById("login-nav").style.visibility = "hidden";
                    document.getElementById("login-div").style.visibility = "hidden";
                    document.getElementById("landing-nav").style.visibility = "visible";
                    document.getElementById("landing-div").style.visibility = "visible";
                    landingState = "dashboard";
                    createDashboard();
                    document.getElementById("maincontent").style.background = "linear-gradient(#ee9ca7, #ffdde1)";
                }
            });
        }
        else {
            document.getElementById("login-nav").style.visibility = "visible";
            document.getElementById("login-div").style.visibility = "visible";
            document.getElementById("landing-nav").style.visibility = "hidden";
            document.getElementById("landing-div").style.visibility = "hidden";
            landingState = "login";
        }
    });
});

//Function to linput the account details from the database when the user logs in
function login(){
    //Email Validation
    let email = document.getElementById("email").value;
    if(email == "") { alert("We need email"); return null;}
    let regx = /^([a-z 0-9\.-]+)@([a-z0-9-]+).([a-z]{2,8})(.[a-z]{2,8})?$/
    if(regx.test(email) == false) {alert("email invalid"); return null;}

    //Password validation
    let pass = document.getElementById("password").value;
    if(pass == '') {alert("We need password"); return null;}
    if(pass.length < 6) {alert("password should be minimum 6 characters long"); return null;}

    Userflag = "login";

    //Creating new firebase account
    auth.signInWithEmailAndPassword(email, pass).catch(function(err) {
        console.log(err);
        let errCode = err.code;
        let errMsg = err.message;
        alert(errMsg);
    });
}
//Function to create an account when the user signs up
function signup(){
    //Email Validation
    let email = document.getElementById("email").value;
    if(email == "") { alert("We need email"); return null;}
    let regx = /^([a-z 0-9\.-]+)@([a-z0-9-]+).([a-z]{2,8})(.[a-z]{2,8})?$/
    if(regx.test(email) == false) {alert("email invalid"); return null;}

    //Password validation
    let pass = document.getElementById("password").value;
    if(pass == '') {alert("We need password"); return null;}
    if(pass.length < 6) {alert("password should be minimum 6 characters long"); return null;}

    Userflag = "signup";

    //Creating new firebase account
    auth.createUserWithEmailAndPassword(email, pass).catch(function(err) {
        let errCode = err.code;
        let errMsg = err.messsage;
        alert(errMsg);
    });
}
function logout(){
    auth.signOut().then(function(){
        document.getElementById("login-nav").style.visibility = "visible";
        document.getElementById("login-div").style.visibility = "visible";
        document.getElementById("landing-nav").style.visibility = "hidden";
        document.getElementById("landing-div").style.visibility = "hidden";
        console.log("user logged out");
    })
}
function verifyAcc() {
    auth.currentUser.sendEmailVerification().then(function(){
        alert("Email has been sent. Check your inbox");
    }).catch(function(err){
        console.log(err.message);
    })
}
//Function to create the dashboard
function createDashboard(){
    if(auth.currentUser.displayName)
        document.getElementById("nav-user-name").innerHTML = `<i class='fas fa-user prefix'></i> `+auth.currentUser.displayName;
    else
        document.getElementById("nav-user-name").innerHTML = `<i class='fas fa-user prefix'></i>Your User Name`;
    
    let tree = document.getElementById("maincontent");
    if(auth.currentUser !== null){
        if(auth.currentUser.emailVerified){
            if(acc.family == null){
                tree.innerHTML = `<h3 class="text-uppercase  font-weight-bold"style="color: #0039a6;">Your Family Tree</h3><p class="mt-5 lead">Your family tree is yet to be created</p><button onclick="changenav(\'fam\'); acc.createTree();" class="btn btn-secondary btn-outline-black">Create your Family Tree</button>`;
            } else {
                tree.innerHTML = `<h3 class="text-uppercase  font-weight-bold" style="color: #0039a6;">Your Family Tree</h3><hr class="hr-dark" style = "width: 80%;"><div class="tf-tree" id="tree-div"></div>`;
               
                let div = document.getElementById("tree-div");
                
                let ul = document.createElement("ul");
                ul.id = auth.currentUser.displayName;

                let li = document.createElement("li");
                li.id = auth.currentUser.displayName + "li";

                let span = document.createElement("span");
                span.classList.add('tf-nc');
                span.innerHTML = auth.currentUser.displayName;

                var parentul, parentli, parentspan;
                if(acc.family.parents) {
                    let family = acc.family;
                    if(family.parents.father) {
                        parentul = document.createElement("ul");
                        parentul.id = family.parents.father.name;

                        parentli = document.createElement("li");
                        parentli.id = family.parents.father.name+"li";

                        parentspan = document.createElement("span");
                        parentspan.classList.add('tf-nc');
                        parentspan.innerHTML = family.parents.father.name;

                        div.appendChild(parentul);
                        parentul.appendChild(parentli);
                        parentli.appendChild(parentspan);

                        createTree(accs[acc.family.parents.father.name]);
                    }
                } else {
                    div.appendChild(ul);
                    ul.appendChild(li);
                    span.style.background = "linear-gradient(#667eea, #764ba2)";
                    li.appendChild(span);

                    createTree(acc);
                }

                for(var name in accs) {
                    var current = accs[name];

                    //birthdays
                    let day = current.date_of_birth.slice(0,2);
                    let month = current.date_of_birth.slice(3,5) * 1;
                    let year = current.date_of_birth.slice(6);
                    let date = new Date(year,month-1,day);

                    if(document.getElementById(name + "li")) {
                        
                        let el = document.getElementById(name+"li").children[0];
                        console.log(el);

                        let content1 = "<h5 style='font-weight: 700'>"+current.name+"</h5><p class='lead'>"+current.gender+", born on: "+date.toDateString();
                        
                        $(el).tooltip({
                            html: true,
                            title: content1,
                        });
                    }
                }
            }
        }
        else {
            if(Userflag == "signup" || UserSetup == false){
                console.log("wor");
                tree.innerHTML = `<h3 class="text-uppercase font-weight-bold" style="color: #0039a6;">Welcome To Family Plus</h3><hr class="hr-light"><p class="lead text-center">Your account details need to be setup<br><button class="btn btn-secondary" onclick="changenav('set');">Click here to set up your account</button></p>`
            } else{ 
                tree.innerHTML = `<h3 class="text-uppercase font-weight-bold" style="color: #0039a6;">Your Family Tree</h3><hr class="hr-dark" style="width: 75%;"><h4 class="h4-responsive text-center">Your Account Is Not Verified Yet</h4><p class="lead text-center">Please verify your account to be able to create a family tree. Click on the button to get a verification mail on your registered email id.</p><button class="btn btn-secondary btn-sm" onclick="verifyAcc();">Click Here to get a verification mail</button>`;
            }
        }
    }
}
//Function to create trees recursively
function createTree(ant) {
    if(ant.family) {
        let el = document.createElement("ul");
        el.id = ant.name;

        if(ant.family.sons) {
            for(var name in ant.family.sons) {
                let current = ant.family.sons[name];

                document.getElementById(ant.name + "li").appendChild(el);

                drawTree(el,current.name, accs[current.name]);
                createTree(accs[current.name]);
            }
        }
    }
}
//Function to display the family tree members in a tree form
function drawTree(el, name, account){
    let li = document.createElement("li");
    li.id = name + "li";

    let span = document.createElement("span");
    span.classList.add("tf-nc");
    if(name == acc.name){
            span.style.background = "linear-gradient(#667eea, #764ba2)";
            span.style.color = "white";
    }
    span.innerHTML = name || account.name;

    el.appendChild(li).appendChild(span);
}
//Function to change the screen
function changenav(asd){
    let gradients = ["linear-gradient(#667eea, #764ba2)","linear-gradient(#89f7fe, #66a6ff)","linear-gradient(#ff758c, #ff7eb3)","linear-gradient(#ee9ca7, #ffdde1)","linear-gradient(#93a5cf, #e4efe9)"];

    var dasBody = '<h3 style="color: #0039a6;">Your family tree</h3>';
    var setupBody = '<div class="text-center text-white"><h3>Set up your account</h3><br><h5>What is your username?</h5><input type="text" id="setup-username" placeholder="Your username here..." class="text-left"><br><h5 class="mt-3">What is your gender?</h5><input type="radio" name="setup-gender" value="male" id="setup-gender-male"><label for="setup-gender-male">Male</label><br><input type="radio" name="setup-gender" value="female" id="setup-gender-female"><label for="setup-gender-female">Female</label><br><h5 class="mt-3">Your Date Of Birth:</h5><input type="text" id="setup-dob-input" placeholder="dd-mm-yy"><br><button class="btn btn-secondary mt-5" onclick="setupacc();">set up my account</button></div>'
    var locBody = '<h3 class="text-uppercase font-weight-bold" style="color: #0039a6;">Birthdays</h3><hr class="hr-dark"><div id="famBirths" class="text-left">Check your family members birthday\'s here<br></div>';
    var profBody = '<div class="text-center text-white"><img src = "user-solid.svg" class="mx-auto my-5" style="width: 15%; height: 15%;" data-toggle="tooltip" title="Change profile pic"><h5 id="profile-name" class="mt-3 font-weight-bold text-uppercase" style="font-size: 2.5rem;"></h5><p class="text-center lead" id="profile-about"></p></div>';
    var famBody;
    if(asd == "das"){
        document.getElementById("maincontent").innerHTML = dasBody;
        document.getElementById("maincontent").style.background = gradients[3];
        document.getElementById("maincontent").style.borderRadius = "10px";
        createDashboard();
    }
    else if(asd == "fam"){
        if(acc.family == null)
            famBody = '<div id="MainDiv"><h2 style="text-align: center;">Create your own family tree</h2><hr class="hr-dark" style="margin-bottom: 25px; width: 65%;"><h5>Add A Family Member</h5><label for="check1">A Child</label><input type="radio" id="check1" name="rela" value="child"><label for="check2">A Sibling</label><input type="radio" id="check2" name="rela" value="sibling" disabled><label for="check3">A Parent</label><input type="radio" id="check3" name="rela" value="parent" disabled><h5>What is your relative\'s username?</h5><input id="famname"><br><br><button onclick="send();">Add Child</button></div>';
        else
            famBody = `<div id="MainDiv"><h3>Add A Family Member</h3><hr class="hr-dark" style="margin-bottom: 25px; width: 65%;"><label for="check1" style="margin-right: 10px;">A Child</label><input type="radio" id="check1" name="rela" style="margin-right: 10px;"><label for="check2" style="margin-right: 10px;">A Sibling</label><input type="radio" id="check2" name="rela" disabled style="margin-right: 10px;"><label for="check3" style="margin-right: 10px;">A Parent</label><input type="radio" id="check3" name="rela" disabled style="margin-right: 10px;"><h5>What is your relative\'s username?</h5><input id="famname" placeholder="your childs name.."><br><br><button onclick="send();" style="margin-bottom: 10px;" class="btn btn-outline-black">Add Child</button></div>`;
        document.getElementById("maincontent").innerHTML = famBody;
        document.getElementById("maincontent").style.background = gradients[4];
        document.getElementById("maincontent").style.border = "2px solid black";
    }
    else if(asd == "loc"){
        document.getElementById("maincontent").innerHTML = locBody;
        document.getElementById("maincontent").style.border = "2px solid black";
        document.getElementById("maincontent").style.background = "linear-gradient(#f5f7fa, #c3cfe2)";

        for(var name in accs) {
            var current = accs[name];

            let day = current.date_of_birth.slice(0,2);
            let month = current.date_of_birth.slice(3,5) * 1;
            let birthdate = new Date(2020,month-1,day);
            let today = new Date();

            let par = document.createElement("p");
            if(current.name !== auth.currentUser.displayName){
                par.innerHTML = current.name + " was born on " + birthdate.toDateString();
                document.getElementById("famBirths").appendChild(par);
            }

            if(today.getTime() < birthdate.getTime()) {
                let daysDiff = Math.ceil((birthdate.getTime() - today.getTime()) / (1000 * 3600 * 24));
                if(daysDiff < 20) {
                    let para = document.createElement("p");
                    para.classList.add("lead");
                    para.classList.add("font-weight-bold");
                    para.classList.add("text-info");

                    if(current.name == auth.currentUser.displayName){
                        para.innerHTML = "Your birthday is close!"
                    }
                    else{
                        para.innerHTML = current.name + "'s birthday is on "+birthdate.toDateString()+", which is close!";
                    }

                    document.getElementById("maincontent").appendChild(para);
                }
            }
        }
    }
    else if(asd == "pof"){
        if(auth.currentUser.displayName){
            document.getElementById("maincontent").innerHTML = profBody;
            document.getElementById("profile-name").innerHTML = auth.currentUser.displayName;
            document.getElementById("profile-about").innerHTML = acc.gender + ", born on " + acc.dob;
            document.getElementById("maincontent").style.border = "2px solid black";
            document.getElementById("maincontent").style.background = gradients[1];
        }
        else{
            document.getElementById("maincontent").style.background = gradients[1];
            document.getElementById("maincontent").style.border = "2px solid black";
            document.getElementById("maincontent").innerHTML = setupBody;
        }
    } 
    else if(asd == "set"){
        document.getElementById("maincontent").innerHTML = setupBody;
        document.getElementById("maincontent").style.background = gradients[0];
        $( '#maincontent' ).ready(function(){
            $( '#setup-dob-input' ).datepicker({
                dateFormat: "dd-mm-yy",
                changeMonth: true,
                changeYear: true,
                maxDate: "+1d",
                minDate: new Date(1800, 11, 30),
                yearRange: "-100: +1"
            });
        })
    }
}
//Function to add the family members
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
function setupacc(){
    auth.currentUser.updateProfile({
        displayName: document.getElementById("setup-username").value
    }).then(function(){
        UserSetup = "true";
        Userflag = "login";
    
        let dob = document.getElementById('setup-dob-input').value;
        let gend = $('input[name=setup-gender]:checked').val();
        console.log(gend);

        database.ref("accounts/"+auth.currentUser.displayName).set({
            name: auth.currentUser.displayName,
            date_of_birth: dob,
            gender: gend,
            family: null
        });

        changenav('das');
        createDashboard();

    }).catch(function(err){
        console.log(err);
    });
}