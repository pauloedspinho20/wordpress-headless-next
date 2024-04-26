import { IUser } from "../../types/user";
import { fetchGraphQL } from "../api";

/*
 *  MUTATIONS - POSTS
 */

/* Register user */

export async function RegisterUser({ username, email, password }: IUser) {
  const data = await fetchGraphQL(`
    mutation Register {
      registerUser(
        input: {username: "${username}", password: "${password}", email: "${email}"}
      ) {
          clientMutationId
          user {
          capabilities
          databaseId
          email
          firstName
          lastName
          name
          registeredDate
          slug
          userId
          username
        }
      }
    }
  `);
  return data.registerUser as IUser;
}

/* Login User */

export async function LoginUser({ username, password }: IUser) {
  const data = await fetchGraphQL(`
    mutation Login {
      login(
        input: {username: "${username}", password: "${password}", clientMutationId: "uniqueId"}
      ) {
          authToken
          clientMutationId
          refreshToken
          user {
            avatar {
              url
            }
            id
            name
            email
            databaseId
            capabilities
            firstName
            lastName
            jwtAuthExpiration
            jwtUserSecret
            isJwtAuthSecretRevoked
            nickname
            slug
            username
          }
        }
      }
  `);

  return data;
}
