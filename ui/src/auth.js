const users = [
    { email: "hjs@nc22.com", password: "1083"},
    { email: "ces@nc22.com", password: "7205"},
    { email: "ssm@nc22.com", password: "7050"},
    { email: "root@google.com", password: "root"},
  ];
  
  export function signIn({ email, password }) {
    const user = users.find(
      (user) => user.email === email && user.password === password
    );
    if (user === undefined) throw new Error();
    return user;
  }