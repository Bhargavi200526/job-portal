import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import dotenv from 'dotenv';

dotenv.config();

Sentry.init({
  dsn: process.env.SENTRY_DSN || 'https://865bc82d6c02d12ae4d1591346f7f832@o4509561156272128.ingest.us.sentry.io/4509561162629120',
  integrations: [
    nodeProfilingIntegration(),
    Sentry.mongooseIntegration()  
  ],
  tracesSampleRate: 1.0,
  profileSessionSampleRate: 1.0,
  profileLifecycle: 'trace',
  sendDefaultPii: true,
});

Sentry.startSpan(
  {
    name: 'Initial Setup',
  },
  () => {
    console.log('Sentry profiling started');
  }
);
