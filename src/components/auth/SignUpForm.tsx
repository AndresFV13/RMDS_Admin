import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import axiosInstance from "../../services/api";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formErrors, setFormErrors] = useState({
    name: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    terms: '',
  });

  const navigate = useNavigate();

  const validate = () => {
    const errors: any = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) errors.name = 'Nombre requerido';
    if (!formData.lastName.trim()) errors.lastName = 'Apellido requerido';
    if (!formData.email.trim()) errors.email = 'Correo requerido';
    else if (!emailRegex.test(formData.email)) errors.email = 'Correo inválido';

    if (!formData.phone.trim()) errors.phone = 'Teléfono requerido';
    else if (formData.phone.length < 7) errors.phone = 'Teléfono inválido';

    if (!formData.password) errors.password = 'Contraseña requerida';
    else if (formData.password.length < 6) errors.password = 'Mínimo 6 caracteres';

    if (!isChecked) errors.terms = 'Debes aceptar los términos';

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleChange = (e:any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await axiosInstance.post('/users', formData);
      console.log("Usuario registrado:", response.data);
      setSuccess(true);

      setTimeout(() => {
        navigate('/');
      }, 1500);

    } catch (err) {
      console.error(err);
      setError('Error al registrar el usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Crear cuenta
            </h1>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <Label>
                    Nombre<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    name="name"
                    placeholder="Ingresa tu nombre"
                    value={formData.name}
                    onChange={handleChange}
                  />
                  {formErrors.name && <p className="text-red-500 text-sm">{formErrors.name}</p>}
                </div>
                <div>
                  <Label>
                    Apellido<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    name="lastName"
                    placeholder="Ingresa tu apellido"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                  {formErrors.lastName && <p className="text-red-500 text-sm">{formErrors.lastName}</p>}
                </div>
              </div>

              <div>
                <Label>
                  Correo electrónico<span className="text-error-500">*</span>
                </Label>
                <Input
                  type="email"
                  name="email"
                  placeholder="Ingresa tu correo"
                  value={formData.email}
                  onChange={handleChange}
                />
                {formErrors.email && <p className="text-red-500 text-sm">{formErrors.email}</p>}
              </div>

              <div>
                <Label>
                  Teléfono<span className="text-error-500">*</span>
                </Label>
                <Input
                  type="text"
                  name="phone"
                  placeholder="Ingresa tu número de teléfono"
                  value={formData.phone}
                  onChange={handleChange}
                />
                {formErrors.phone && <p className="text-red-500 text-sm">{formErrors.phone}</p>}
              </div>

              <div>
                <Label>
                  Contraseña<span className="text-error-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    placeholder="Ingresa tu contraseña"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  {formErrors.password && <p className="text-red-500 text-sm">{formErrors.password}</p>}
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    )}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Checkbox
                  className="w-5 h-5"
                  checked={isChecked}
                  onChange={setIsChecked}
                />
                {formErrors.terms && <p className="text-red-500 text-sm">{formErrors.terms}</p>}
                <p className="inline-block font-normal text-gray-500 dark:text-gray-400">
                  Al crear una cuenta, aceptas nuestros
                  <span className="text-gray-800 dark:text-white/90"> Términos</span> y
                  <span className="text-gray-800 dark:text-white"> Política de privacidad</span>.
                </p>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600"
                  disabled={loading}
                >
                  {loading ? "Registrando..." : "Registrarse"}
                </button>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}
              {success && (
                <p className="text-green-500 text-sm">¡Usuario registrado exitosamente!</p>
              )}
            </div>
          </form>

          <div className="mt-5">
            <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
              ¿Ya tienes una cuenta?{" "}
              <Link
                to="/signin"
                className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
              >
                Iniciar sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
