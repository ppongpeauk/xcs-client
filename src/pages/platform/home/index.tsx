import MainLayout from "@/components/mainLayout";
import { initFirebase } from "@/firebase/firebaseApp";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Home() {
  const app = initFirebase();
  const router = useRouter();
  const auth = getAuth();
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (!user) {
    router.push("/idp/login");
  }

  return (
    <MainLayout>
      <h1>Home</h1>
    </MainLayout>
  );
}
