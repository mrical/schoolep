import { auth } from "../firebase";

export default async function userType() {
  await auth.currentUser?.getIdToken(true);
  const decodedToken = await auth.currentUser?.getIdTokenResult();
  console.log(decodedToken?.claims?.stripeRole);
  return decodedToken?.claims?.stripeRole;
}
