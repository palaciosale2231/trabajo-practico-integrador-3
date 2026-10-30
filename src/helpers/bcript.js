import bcrypt from "bcrypt";

export const hashPassword = async (password) => {
  const hashedPassword = await bcrypt.hash(password, 10); // 10 = salt rounds, osea cuantas veces se encripta la contraseña para que sea más segura. Pero si pongo un número más alto va a tardar más en encriptar y desencriptar la contraseña.
  return hashedPassword;
};
// Esta función compara la contraseña ingresada por el usuario con la contraseña encriptada almacenada en la base de datos. Devuelve true si coinciden, false si no.
export const comparePassword = async (password, hashedPassword) => {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
};