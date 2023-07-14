import { IsEmail, IsNotEmpty, IsNotIn, IsString, Length } from "class-validator";

export class CreateSignupDto {
    @IsString()
    @IsNotEmpty()
    name: string;   

    @IsEmail()
    @IsNotEmpty()
    email: string;    

    @IsNotEmpty()
    @Length(6, 15)
    password: string;
}
