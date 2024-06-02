import { Db } from "mongodb";
import { SignUpParamsDto } from "../../core/dtos/sign_up_params.dto.ts";
import { User, UserSchema } from "../../core/entities/user.entity.ts";

export class UsersRepository {
  constructor(private readonly db: Db) {}

  async create(params: SignUpParamsDto): Promise<void> {
    await this.db.collection("users").insertOne(params);
  }

  async findUnique(by: "id" | "uuid" | "email", value: string): Promise<User> {
    const user = await this.db.collection("users").findOne({ [by]: value });
    const validUser = UserSchema.parse(user);
    
    return validUser;
  }
}