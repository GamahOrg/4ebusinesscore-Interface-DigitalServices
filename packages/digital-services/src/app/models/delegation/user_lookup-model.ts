export class UsersModel 
{
    id:string;
    userName:string;
    email?:string
    
    constructor(id:string,
        userName:string,email?:string){
        this.id = id;
        this.userName = userName;
        this.email=email
    }
}