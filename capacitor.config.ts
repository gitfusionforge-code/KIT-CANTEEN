import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.999862beae844c35b4df76925617e123',
  appName: 'kit-canteen-dash-05',
  webDir: 'dist',
  server: {
    url: 'https://999862be-ae84-4c35-b4df-76925617e123.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    BarcodeScanner: {
      permissions: {
        camera: "Camera access is required to scan barcodes"
      }
    }
  }
};

export default config;