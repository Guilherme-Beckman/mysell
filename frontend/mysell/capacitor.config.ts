import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'mysell',
  webDir: 'www',
  plugins: {
    App: {
      // This creates the "mysell://" URL scheme that your backend redirects to
      appUrlOpen: {
        onChange: true
      }
    }
  }
};

export default config;
