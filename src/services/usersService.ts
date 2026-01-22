import axios from './axios';

type User = {
  id: number;
  name: string;
  email: string;
};

type CreateUserDto = {
  name: string;
  email: string;
};

const MOCK_USERS: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
];

export async function getUsers() {
  const res = await axios.get('/api/users');
  return res.data;
}

export async function getUserById(id: number) {
  const res = await axios.get(`/api/users/${id}`);
  return res.data;
}

export async function getUsersMock() {
  return new Promise<User[]>((resolve) => {
    setTimeout(() => resolve(MOCK_USERS), 500);
  });
}

export async function getUserByIdMock(id: number) {
  return new Promise<User | null>((resolve) => {
    setTimeout(() => {
      const user = MOCK_USERS.find((u) => u.id === id);
      resolve(user || null);
    }, 500);
  });
}

/*
 * OPCIONES DE MOCKING DISPONIBLES:
 *
 * 1. MSW (Mock Service Worker):
 *    - Usa getUsers(), getUserById()
 *    - Activa con VITE_USE_MOCKS=true en .env
 *    - Intercepta de forma transparente y funciona con axios
 *    - Simula requests HTTP reales con status codes, delays
 *    - Ventaja: No cambia código, solo variable de entorno
 *
 * 2. Mock directo (siempre retorna data):
 *    - Usa getUsersMock(), getUserByIdMock()
 *    - Siempre retorna data simulada sin requests HTTP
 *    - Útil para demostraciones o prototipado rápido
 *    - Ventaja: Simple, no requiere configuración
 *    - Desventaja: No simula comportamiento HTTP real
 *
 * 3. Postman Mock Server:
 *    - Configura baseURL en src/config/config.ts:
 *      backendUrl: 'https://mock.pstmn.io/su-mock-id'
 *    - Usa getUsers(), getUserById() normalmente
 *    - Los requests van al mock server de Postman en lugar del backend real
 *    - Ventaja: Compartir mocks con el equipo sin modificar código
 *    - Documentación: https://learning.postman.com/docs/designing-and-developing-your-api/mocking-data/
 *
 * 4. Backend real:
 *    - Usa getUsers(), getUserById()
 *    - Asegúrate de VITE_USE_MOCKS=false
 *    - Configura baseURL al backend real en src/config/config.ts
 *    - Ventaja: Datos reales del backend
 */