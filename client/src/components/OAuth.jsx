import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../constant"; // ✅ central config

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      // Prevent multiple calls if already signed in
      if (auth.currentUser) return;

      // Google popup login
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Send user info to backend
      const res = await fetch(`${serverUrl}/api/auth/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // ✅ keeps cookies/session
        body: JSON.stringify({
          name: user.displayName,
          email: user.email,
          photo: user.photoURL,
        }),
      });

      // Avoid JSON parse errors on empty body
      const text = await res.text();
      const data = text ? JSON.parse(text) : {};

      if (!res.ok) {
        console.error("Google sign-in failed:", data.message || res.statusText);
        return;
      }

      // Update Redux store & navigate
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      if (error.code === "auth/popup-blocked") {
        console.error("Popup blocked — please allow popups in your browser.");
      } else if (error.code === "auth/cancelled-popup-request") {
        console.error("Popup request was canceled.");
      } else {
        console.error("Could not sign in with Google", error);
      }
    }
  };

  return (
    <button
      onClick={handleGoogleClick}
      type="button"
      className="bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95"
    >
      Continue with Google
    </button>
  );
}
