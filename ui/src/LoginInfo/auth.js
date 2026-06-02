const users = [
    // SECURITY: plaintext credentials removed. Authenticate server-side (JWT) — see
    // AirPost/application/rest/handler/auth.go and the new ui-next client (src/lib/api.ts).
  ];
  
  export function signIn({ email, password }) {
    const user = users.find(
      (user) => user.email === email && user.password === password
    );
    if (user === undefined) throw new Error();
    return user;
  }