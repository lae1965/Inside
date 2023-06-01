export class CreateUserDto {
  login: string;
  password: string;
  aliasName?: string;
  aliasColor?: string;
  avatar?: string;
}
