# TesisAssistant

Una aplicación móvil para asistir a estudiantes en el proceso de elaboración de tesis.

## Configuración de Firebase

Para configurar Firebase en la aplicación:

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Habilita Authentication con Email/Password
3. Crea una base de datos Firestore
4. Obtén la configuración de tu proyecto Firebase
5. Reemplaza los valores en `config/firebase.ts` con tu configuración:

```typescript
const firebaseConfig = {
  apiKey: "tu-api-key",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-project-id",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "tu-app-id"
};
```

## Características

- ✅ Autenticación con Firebase (Email/Password)
- ✅ Feed de videos estilo TikTok
- ✅ Sistema de asesores con chat
- ✅ Subida de documentos (Turniting)
- ✅ Simulación de pagos
- ✅ Perfil de usuario completo
- ✅ Diseño responsive y moderno
