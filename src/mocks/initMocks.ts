/**
 * Inicializa o modo mock de forma idempotente.
 *
 * So faz algo quando NEXT_PUBLIC_API_MOCKING === 'enabled' e roda no client.
 * Liga o Service Worker do MSW e semeia o localStorage com uma sessao fake,
 * para que o AuthContext considere o usuario logado sem passar pelo OAuth real.
 * Quando o mock esta desligado, e um no-op inerte (nao afeta build nem testes).
 */
import { MOCK_TOKEN } from './handlers';
import user from './fixtures/user.json';

let started = false;

// Formatos alinhados ao useLocalStorage (JSON.stringify) e ao AuthContext.
// token, session e provider sao gravados via useLocalStorage (JSON);
// login_timestamp e gravado como string simples (ver Auth.context.tsx).
function seedFakeSession() {
  if (!localStorage.getItem('token')) {
    localStorage.setItem('token', JSON.stringify(MOCK_TOKEN));
  }
  if (!localStorage.getItem('provider')) {
    localStorage.setItem('provider', JSON.stringify('credentials'));
  }
  if (!localStorage.getItem('session')) {
    localStorage.setItem('session', JSON.stringify(user));
  }
  if (!localStorage.getItem('login_timestamp')) {
    localStorage.setItem('login_timestamp', Date.now().toString());
  }
}

export async function initMocks(): Promise<void> {
  if (process.env.NEXT_PUBLIC_API_MOCKING !== 'enabled') return;
  if (typeof window === 'undefined') return;
  if (started) return;
  started = true;

  const { worker } = await import('./browser');
  await worker.start({
    onUnhandledRequest: 'bypass',
    serviceWorker: { url: '/mockServiceWorker.js' }
  });

  seedFakeSession();
}
