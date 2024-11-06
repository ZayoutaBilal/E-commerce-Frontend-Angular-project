export interface UserDetailsModule {
  
  userId : Number;
  username : string;
  password : string;
  email : string;
  isEnabled : boolean;
  token : string;
  authorities: string[];

}
