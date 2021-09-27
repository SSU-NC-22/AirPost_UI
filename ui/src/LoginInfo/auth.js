const users = [
    { email: "hjs@nc22.com", password: "1083"},
    { email: "ces@nc22.com", password: "7205"},
    { email: "ssm@nc22.com", password: "7050"},
    { email: "airpostsch@gmail.com", password: "0000"},
    { email: "a", password: "a"},
  ];
  
  export function signIn({ email, password }) {
    const user = users.find(
      (user) => user.email === email && user.password === password
    );
    if (user === undefined) throw new Error();
    return user;
  }