import { createSignal } from "solid-js";

interface User {
  id: number;
  username: string;
  email: string;
}

const [user, setUser] = createSignal<User | null>(null);
const [isAuthenticated, setIsAuthenticated] = createSignal(false);

export const authStore = {
  user,
  isAuthenticated,
  login(userData: User) {
    setUser(userData);
    setIsAuthenticated(true);
  },
  logout() {
    setUser(null);
    setIsAuthenticated(false);
  }
};
