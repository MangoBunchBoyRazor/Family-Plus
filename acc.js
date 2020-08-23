class account {
    constructor(asd){
        if(asd != undefined){
            this.username = asd.username;
            this.password = asd.password;
            this.family = asd.family;
            database.ref('accounts/'+this.username).on('value',(data)=>{
                this.family = data.val().sd.family;
            })
        }
    }
    addSon(data){
        let m = document.getElementById("maincontent");
        let h = m.innerHTML;
        if(this.family.sons)
            this.family.sons[data.name] = data;
        else {
            this.family.sons = {};
            this.family.sons[data.name] = data;
        }
        database.ref('accounts/'+this.username+"/sd").update({
            family: this.family
        },()=>{
            m.innerHTML = `${m.innerHTML}<h3 style="color: black;">Member successfully added</h3>`
        });setTimeout(() => {
            m.innerHTML = h;
        }, 1000);
        let n = {name: this.username};
        database.ref('accounts/'+data.name+"/sd/family/parents").update({
            father: n
        });
    }
    createTree(){
        this.family = {
            sons: {},
            siblings: {},
            parents: {}
        };
        database.ref('accounts/'+this.username+"/sd").update({
            family: this.family
        });
    }
    createAccount(a,b){
        this.username = a;
        this.password = b;
        this.family = null;
        database.ref('accounts/'+this.username).on('value',(data)=>{
            this.family = data.val().sd.family;
        });
    }
}
