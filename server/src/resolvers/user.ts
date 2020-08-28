import { Resolver, Mutation, Field, Arg, Ctx, ObjectType, Query } from "type-graphql";
import { MyContext } from "src/types";
import { User } from "../entities/User";
import argon2 from "argon2";
import { EntityManager } from "@mikro-orm/postgresql";
import { COOKIE_NAME, FORGET_PASSWORD_PREFIX } from "../constants";
import { UsernamePasswordInput } from "./UsernamePasswordInput";
import { validateRegister } from "../utils/validateRegister";
import { sendEmail } from "../utils/sendEmail";
import { v4 } from 'uuid';

@ObjectType()
class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[]

  @Field(() => User, { nullable: true })
  user?: User

}

@Resolver()
export class UserResolver {
  @Mutation(() => UserResponse)
  async changePassword(
    @Arg('token') token: string,
    @Arg('newPassword') newPassword: string,
    @Ctx() { em, redis, req }: MyContext
  ): Promise<UserResponse> {
    if (newPassword.length <= 2) {
      return {
        errors: [
          {
            field: 'newPassword',
            message: 'length must be greater than 2'
          }
        ]
      };

    }

    const key = FORGET_PASSWORD_PREFIX + token
    const userId = await redis.get(key)

    if (!userId) {
      return {
        errors: [
          {
            field: 'token',
            message: 'token expired'
          }
        ]
      };

    }

    const user = await em.findOne(User, { id: parseInt(userId) });

    if (!user) {
      return {
        errors: [
          {
            field: 'token',
            message: 'user no longer exists'
          }
        ]

      }
    };

    user.password = await argon2.hash(newPassword);
    em.persistAndFlush(user);
    // Delete forgotPassword token when done
    redis.del(key);

    // log in after change
    req.session.userId = user.id;

    return { user };

  }

  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg('email') email: string,
    @Ctx() { em, redis }: MyContext
  ) {
    const user = await em.findOne(User, { email })
    if (!user) {
      // Email not in database
      return true;
    }

    const token = v4();

    await redis.set(FORGET_PASSWORD_PREFIX + token, user.id, 'ex', 1000 * 60 * 60 * 24 * 3); // 3 days

    await sendEmail(
      email,
      `<a href="http://localhost:3000/change-password/${token}">Reset Password</a>`
    )

    return true;
  }

  @Query(() => User, { nullable: true })
  async me(
    @Ctx() { req, em }: MyContext
  ) {
    // You are not logged in!
    if (!req.session.userId) {
      return null;
    }

    const user = await em.findOne(User, { id: req.session.userId })

    return user;
  }


  @Mutation(() => UserResponse)
  async register(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {

    const errors = validateRegister(options);
    if (errors) {
      return { errors };
    }

    const hashedPassword = await argon2.hash(options.password)
    let user;

    try {
      // Use Knex to avoid flush Error with persistAndFlush
      const result = await (em as EntityManager).createQueryBuilder(User).getKnexQuery().insert(
        {
          username: options.username,
          email: options.email,
          password: hashedPassword,
          created_at: new Date(),
          updated_at: new Date()
        }
      ).returning('*');

      user = result[0];
    }
    catch (error) {
      console.log("message:", error.message)
      if (error.code === '23505' || error.detail.includes('already exists')) {
        // Duplicate Username Error

        return {
          errors: [
            {
              field: "username",
              message: "username already taken"
            }
          ]
        }

      }
    }

    // Store user id session
    // Set cookie - keep logged in
    req.session.userId = user.id;

    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('usernameOrEmail') usernameOrEmail: string,
    @Arg('password') password: string,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    const user = await em.findOne(User, usernameOrEmail.includes('@') ? { email: usernameOrEmail }
      : { username: usernameOrEmail });
    if (!user) {
      return {
        errors: [{
          field: 'usernameOrEmail',
          message: 'that username doesn\'t exist',
        },
        ]
      }
    }
    const valid = await argon2.verify(user.password, password);
    if (!valid) {
      return {
        errors: [
          {
            field: 'password',
            message: 'incorrect password',
          },
        ]
      }
    }

    req.session.userId = user.id;

    return {
      user
    };
  }

  @Mutation(() => Boolean)
  logout(
    @Ctx() { req, res }: MyContext
  ) {
    return new Promise((resolve) => req.session.destroy(err => {
      res.clearCookie(COOKIE_NAME);
      if (err) {
        console.log(err);
        resolve(false)
        return
      }

      resolve(true)
    }))
  }
}