class account {
    constructor(asd){
        if(asd != undefined){
            this.name = asd.name;
            this.password = asd.password || null;
            this.family = asd.family || null;
            this.dob = asd.date_of_birth || null;
            this.gender = asd.gender || null;
        }
    }
    addSon(data){
        let m = document.getElementById("maincontent");
        let h = m.innerHTML;
        console.log(m,h);

        if(this.family.sons)
            this.family.sons[data.name] = data;
        else {
            this.family.sons = {};
            this.family.sons[data.name] = data;
        }
        database.ref('accounts/'+this.name).update({
            family: this.family
        },()=>{
            let temp = m.innerHTML;
            m.innerHTML = `${temp}<h3 style="color: black;" class="mt-3">Member successfully added</h3>`
        });
        setTimeout(() => {
            m.innerHTML = h;
        }, 1000);
        let n = {name: this.name};
        database.ref('accounts/'+data.name+"/family/parents").update({
            father: n
        });
    }
    createTree(){
        this.family = {
            sons: {},
            siblings: {},
            parents: {}
        };
        database.ref('accounts/'+this.name+"/sd").update({
            family: this.family
        });
    }
    getBirthdayEvents(arr){
        let mebirth = arr;
        let today = new Date();
        let birthdate = new Date(today.getFullYear(),mebirth[1],mebirth[0]);
        if(today.getTime() > birthdate.getTime()) birthdate.setFullYear(birthdate.getFullYear()+1);

        let diff = birthdate.getTime()-today.getTime();
        
        return Math.floor(diff/(1000*60*60*24));
    }
    createAccount(a,b){
        this.username = a;
        this.password = b;
        this.family = null;
        database.ref('accounts/'+this.name).on('value',(data)=>{
            this.family = data.val().family;
        });
    }
}
