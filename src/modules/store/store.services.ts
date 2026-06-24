import bcrypt from "bcryptjs";
import Store from "./store.models";

export const getStoreSettings = (storeId: string) => {
  return Store.findById(storeId);
};

export const updateStoreSettings = (
  storeId: string,
  data: { name?: string; email?: string; phone?: string; address?: string; currency?: string; logo?: string }
) => {
  return Store.findByIdAndUpdate(storeId, data, { new: true });
};

export const updateStorePassword = async (
  storeId: string,
  currentPassword: string,
  newPassword: string
) => {
  const store = await Store.findById(storeId).select("+password");
  if (!store) throw new Error("Boutique introuvable");

  const isMatch = await bcrypt.compare(currentPassword, store.password);
  if (!isMatch) throw new Error("Mot de passe actuel incorrect");

  store.password = await bcrypt.hash(newPassword, 10);
  return store.save();
};

export const deleteStore = async (storeId: string, password: string) => {
  const store = await Store.findById(storeId).select("+password");
  if (!store) throw new Error("Boutique introuvable");

  const isMatch = await bcrypt.compare(password, store.password);
  if (!isMatch) throw new Error("Mot de passe incorrect");

  return Store.findByIdAndDelete(storeId);
};
