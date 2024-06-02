import { Db, ObjectId } from "mongodb";
import { SignUpWithEmailParamsDto } from "../../core/dtos/sign_up_with_email_params.dto.ts";
import { User, UserSchema } from "../../core/entities/user.entity.ts";
import { db } from "../database/db.ts";

export class UsersRepository {
  constructor(private readonly database: Db = db) {}

  async create(params: SignUpWithEmailParamsDto): Promise<User | null> {
    const user = await this.database.collection("users").insertOne({
      uuid: crypto.randomUUID(),
      ...params,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {});
    
    const createdUser = await this.findUnique("_id", user.insertedId);
    return createdUser;
  }

  async findUnique(by: "_id" | "uuid" | "email", value: ObjectId | string): Promise<User|null> {
    const query = by === "_id" ? { [by]: new ObjectId(value) } : { [by]: value };
    const user = await this.database.collection("users").findOne(query);

    if (!user) return null;
    
    const validUser = UserSchema.parse({
      ...user, 
      id: user?._id.toHexString()
    })

    console.log("UsersRepository.findUnique:", validUser)

    return validUser;
  }
}