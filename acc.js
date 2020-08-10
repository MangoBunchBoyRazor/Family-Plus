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
        this.family.sons[data.name] = data;
        database.ref('accounts/'+this.username+"/sd").update({
            family: this.family
        },()=>{
            let m = document.getElementById("maincontent");
            m.innerHTML = `${m.innerHTML}<h3 style="color: white;">Son added Please refresh to update</h3>`
        });
    }
    createTree(){
        this.family = {
            sons: {}
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
        })
    }
}
