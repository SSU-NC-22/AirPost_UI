const users = [
    { email: "REDACTED", password: "REDACTED"},
    { email: "REDACTED", password: "REDACTED"},
    { email: "REDACTED", password: "REDACTED"},
    { email: "REDACTED", password: "REDACTED"},
    { email: "REDACTED", password: "REDACTED"},
  ];
  
  export function signIn({ email, password }) {
    const user = users.find(
      (user) => user.email === email && user.password === password
    );
    if (user === undefined) throw new Error();
    return user;
  }