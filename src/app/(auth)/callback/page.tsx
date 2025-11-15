import { authenticateUser } from "@/actions/user";
import { redirect } from "next/navigation";

const AuthCallbackPage = async () => {
  const auth = await authenticateUser();

  if (auth.ok) redirect("/dashboard");

  return redirect("/sign-in");
};

export default AuthCallbackPage;
