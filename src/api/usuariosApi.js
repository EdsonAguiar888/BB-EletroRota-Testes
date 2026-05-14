/**
 * URL da coleção `usuarios` do json-server.
 * Em desenvolvimento o Vite encaminha `/api/*` para o json-server (mesma origem → sem CORS).
 */
export function getUsuariosCollectionUrl() {
  const fromEnv = import.meta.env.VITE_JSON_SERVER_URL;
  if (fromEnv) {
    return `${String(fromEnv).replace(/\/$/, '')}/usuarios`;
  }
  if (import.meta.env.DEV) {
    return '/api/usuarios';
  }
  return 'http://localhost:3000/usuarios';
}

export function getUsuarioByIdUrl(id) {
  return `${getUsuariosCollectionUrl()}/${encodeURIComponent(id)}`;
}
