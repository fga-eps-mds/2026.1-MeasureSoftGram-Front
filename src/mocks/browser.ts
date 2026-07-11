/**
 * Worker MSW para o browser. Usado apenas no modo mock (client-side),
 * nunca no SSR nem no build de producao.
 */
import { setupWorker } from 'msw';

import { handlers } from './handlers';

export const worker = setupWorker(...handlers);
