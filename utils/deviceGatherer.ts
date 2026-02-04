
import { DeviceInfo } from '../types';

export const getDeviceInfo = async (): Promise<DeviceInfo> => {
  const n = window.navigator as any;
  const s = window.screen;

  // Battery API - Mobile WebViews often block this for fingerprinting prevention
  let batteryInfo = { level: 100, charging: true, chargingTime: 0, dischargingTime: 0 };
  try {
    if ('getBattery' in n) {
      const b = await n.getBattery();
      batteryInfo = {
        level: (b.level * 100) || 100,
        charging: b.charging ?? true,
        chargingTime: b.chargingTime || 0,
        dischargingTime: b.dischargingTime || 0,
      };
    }
  } catch (e) {
    console.warn("Battery API unavailable");
  }

  // WebGL Info - Use a more robust check for mobile GPUs
  let graphics = { vendor: 'Generic Mobile GPU', renderer: 'Adreno/Mali Unknown' };
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as any;
    if (gl) {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        graphics.vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || graphics.vendor;
        graphics.renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || graphics.renderer;
      }
    }
  } catch (e) {
    console.warn("WebGL Context unavailable");
  }

  // Geolocation (optional prompt) - Critical for mobile apps
  let geo = undefined;
  try {
    const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
      n.geolocation.getCurrentPosition(resolve, reject, { 
        timeout: 8000, 
        enableHighAccuracy: true,
        maximumAge: 0
      });
    });
    geo = {
      lat: pos.coords.latitude,
      lng: pos.coords.longitude,
      accuracy: pos.coords.accuracy
    };
  } catch (e) {
    console.warn("Geolocation failed or denied");
  }

  return {
    browser: {
      userAgent: n.userAgent || 'Unknown',
      language: n.language || 'en-US',
      platform: n.platform || 'Android',
      vendor: n.vendor || 'Google',
      online: n.onLine ?? true,
      cookieEnabled: n.cookieEnabled ?? true,
    },
    hardware: {
      cores: n.hardwareConcurrency || 4,
      memory: n.deviceMemory || 4,
      maxTouchPoints: n.maxTouchPoints || 5,
    },
    screen: {
      width: s.width,
      height: s.height,
      pixelRatio: window.devicePixelRatio || 1,
      colorDepth: s.colorDepth || 24,
      orientation: (s.orientation as any)?.type || 'portrait-primary',
    },
    network: {
      effectiveType: n.connection?.effectiveType || '4g',
      downlink: n.connection?.downlink || 10,
      rtt: n.connection?.rtt || 100,
      saveData: n.connection?.saveData || false,
    },
    battery: batteryInfo,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
    geolocation: geo,
    graphics: graphics,
  };
};
