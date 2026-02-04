
import { NetworkConnection } from '../types';

const APPS = [
  { name: 'YouTube', pkg: 'com.google.android.youtube' },
  { name: 'Telegram', pkg: 'org.telegram.messenger' },
  { name: 'System UI', pkg: 'com.android.systemui' },
  { name: 'Chrome', pkg: 'com.android.chrome' },
  { name: 'Play Store', pkg: 'com.android.vending' },
  { name: 'WhatsApp', pkg: 'com.whatsapp' },
  { name: 'Instagram', pkg: 'com.instagram.android' },
  { name: 'Kernel', pkg: 'system_server' }
];

const IPS = ['172.217.16.142', '31.13.72.36', '104.244.42.1', '52.223.195.88', '185.60.216.35'];

export const generateMockConnection = (): NetworkConnection => {
  const app = APPS[Math.floor(Math.random() * APPS.length)];
  return {
    id: Math.random().toString(36).substr(2, 9),
    app: app.name,
    packageName: app.pkg,
    localPort: Math.floor(Math.random() * 4000) + 1024,
    remoteIp: IPS[Math.floor(Math.random() * IPS.length)],
    protocol: Math.random() > 0.2 ? 'TCP' : 'UDP',
    status: Math.random() > 0.8 ? 'LISTENING' : 'ESTABLISHED',
    bytesSent: Math.floor(Math.random() * 5000),
    bytesReceived: Math.floor(Math.random() * 20000),
    timestamp: Date.now()
  };
};
