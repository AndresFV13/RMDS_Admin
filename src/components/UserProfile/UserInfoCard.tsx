import { useEffect, useState } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import api from "../../services/api"
import { User } from "../../types/user/User";

export default function UserInfoCard() {

  const userId = localStorage.getItem('userId');

  const { isOpen, openModal, closeModal } = useModal();

  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    phone: "",
    facebook: "",
    x: "",
    linkedin: "",
    instagram: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get<User>(`/users/${userId}`);
        const data = res.data;
        setFormData({
          name: data.name || "",
          lastName: data.lastName || "",
          email: data.email || "",
          phone: data.phone || "",
          facebook: data.facebook || "",
          x: data.x || "",
          linkedin: data.linkedin || "",
          instagram: data.instagram || "",
        });
      } catch (error) {
        console.error("Error al cargar los datos del usuario:", error);
      }
    };

    fetchUser(); 
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await api.put(`/users/${userId}`, formData);
      console.log("Usuario actualizado");
      closeModal();
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
    }
  };

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Información Personal
          </h4>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Nombre</p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {formData.name}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Apellido</p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {formData.lastName}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Correo Electrónico</p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {formData.email}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Teléfono</p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {formData.phone}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={openModal}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:w-auto"
        >
          ✎ Editar
        </button>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Editar Información Personal
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Actualiza tus datos para mantener tu perfil al día.
            </p>
          </div>
          <form className="flex flex-col">
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div>
                  <Label>Facebook</Label>
                  <Input type="text" name="facebook" value={formData.facebook} onChange={handleChange} />
                </div>
                <div>
                  <Label>X.com</Label>
                  <Input type="text" name="x" value={formData.x} onChange={handleChange} />
                </div>
                <div>
                  <Label>LinkedIn</Label>
                  <Input type="text" name="linkedin" value={formData.linkedin} onChange={handleChange} />
                </div>
                <div>
                  <Label>Instagram</Label>
                  <Input type="text" name="instagram" value={formData.instagram} onChange={handleChange} />
                </div>
              </div>

              <div className="mt-7 grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div>
                  <Label>Nombre</Label>
                  <Input type="text" name="name" value={formData.name} onChange={handleChange} />
                </div>
                <div>
                  <Label>Apellido</Label>
                  <Input type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
                </div>
                <div>
                  <Label>Correo Electrónico</Label>
                  <Input type="email" name="email" value={formData.email} onChange={handleChange} />
                </div>
                <div>
                  <Label>Teléfono</Label>
                  <Input type="text" name="phone" value={formData.phone} onChange={handleChange} />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Cerrar
              </Button>
              <Button size="sm" onClick={handleSave}>
                Guardar Cambios
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
