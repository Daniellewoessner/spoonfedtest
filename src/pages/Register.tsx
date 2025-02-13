import { useState, FormEvent, ChangeEvent } from "react";
import { registerUser } from "../api/userAPI";
import Auth from "../utils/auth";
import { login } from "../api/authAPI";
import LoginModal from "../components/loginModal";
interface RegisterData {
  username: string;
  password: string;
  confirmPassword: string;
}
const Register = () => {
  const [modalShow, setModalShow] = useState(false);
  const [registerData, setRegisterData] = useState<RegisterData>({
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState<string>('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterData({
      ...registerData,
      [name]: value,
    });
  };
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setError('');

    // Validation
    if (
      !registerData.username ||
      !registerData.password ||
      !registerData.confirmPassword
    ) {
      setError("All fields are required");
      return;
    }
    if (registerData.password !== registerData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {

      console.log('Starting registration process...');

      // Register the user
      await registerUser({
        username: registerData.username,
        password: registerData.password,
      });

      console.log('Registration successful, attempting login...');



      // Automatically log in after successful registration
      const loginResponse = await login({
        username: registerData.username,
        password: registerData.password,
      });
      if (!loginResponse || !loginResponse.token) {
        throw new Error("Login response missing token");
      }

      Auth.login(loginResponse.token, registerData.username);
     
    } catch (err) {
      console.error("Registration/Login error:", err);
      setError(
        err instanceof Error ? err.message : "Failed to register account"
      );
    }
  };
  return (
    <div className="container">
      <form className="form" onSubmit={handleSubmit}>
        <h1>Create Account</h1>
        {error && <div className="error-message">{error}</div>}
        <label>Username</label>
        <input
          type="text"
          name="username"
          value={registerData.username}
          onChange={handleChange}
        />
        <label>Password</label>
        <input
          type="password"
          name="password"
          value={registerData.password}
          onChange={handleChange}
        />
        <label>Confirm Password</label>
        <input
          type="password"
          name="confirmPassword"
          value={registerData.confirmPassword}
          onChange={handleChange}
        />
        <button onClick={() => setModalShow(true)} type="submit">Register</button>
        <LoginModal
          show={modalShow}
          onHide={() => setModalShow(false)}
          size="lg"
          centered
        />
      </form>
    </div>
  );
};

export default Register;

