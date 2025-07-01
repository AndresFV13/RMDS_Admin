import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../../services/api";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";

export default function SignInForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    try {
      const response = await axiosInstance.post("login", { email, password });
      const { token } = response.data;
      if (!token) {
        setErrorMessage("Tu correo o contraseña no son válidos.");
        return;
      }
      if (isChecked) {
        localStorage.setItem("authToken", token);
      }
      navigate("/dashboard");
    } catch (error) {
      const msg = error.response?.status === 401
        ? "Tu correo o contraseña no son válidos."
        : "Tu correo o contraseña no son válidos.";
      setErrorMessage(msg);
      console.error("Login error:", error);
    }
  };

return (
  <div className="flex flex-col flex-1">
    {/* Volver al panel */}
    <div className="w-full max-w-md pt-10 mx-auto">
      <Link to="/" className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
        <ChevronLeftIcon className="size-5" />
        Volver al panel de control
      </Link>
    </div>
    <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
      <div className="mb-5 sm:mb-8">
        <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
          Iniciar sesión
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          ¡Ingresa tu correo electrónico y contraseña para iniciar sesión!
        </p>
        <div className="relative py-3 sm:py-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="p-2 text-gray-400 bg-white dark:bg-gray-900 sm:px-5 sm:py-2">
              O
            </span>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Email */}
            <div>
              <Label>Correo electrónico <span className="text-error-500">*</span></Label>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="ejemplo@gmail.com" />
            </div>
            {/* Contraseña */}
            <div>
              <Label>Contraseña <span className="text-error-500">*</span></Label>
              <div className="relative">
                <Input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Introduce tu contraseña" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2" aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}>
                  {showPassword ? <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" /> : <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />}
                </button>
              </div>
            </div>
            {/* Mantenme conectado + enlace olvidar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Checkbox checked={isChecked} onChange={setIsChecked} />
                <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">Mantenme conectado</span>
              </div>
              <Link to="/reset-password" className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400">¿Olvidaste tu contraseña?</Link>
            </div>
            {errorMessage && (
              <div role="alert">
                <p className="text-sm text-red-500 mb-4">{errorMessage}</p>
              </div>
            )}
            <div>
              <Button type="submit" className="w-full" size="sm">Iniciar sesión</Button>
            </div></div>
        </form>
        <div className="mt-5">
          <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
            ¿No tienes una cuenta?
            <Link to="/signup" className="text-brand-500 hover:text-brand-600 dark:text-brand-400">Regístrate</Link>
          </p>
        </div>
        </div>
      </div>
    </div>
  );
}