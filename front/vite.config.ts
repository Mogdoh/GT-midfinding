import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return defineConfig({
    plugins: [react()],
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV),
      // Kakao API 키를 전역 변수로 정의
      'process.env.REACT_APP_KAKAO_API_KEY': JSON.stringify(env.REACT_APP_KAKAO_API_KEY),
    },
    server: {
      proxy: {
        '/api': {
          target: `${env.SERVER_URL}:${env.SERVER_PORT}`,
          changeOrigin: true,
        },
      },
    },
  });
};
