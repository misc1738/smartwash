let users = [];
let id = 1;

export async function register({ firstName, lastName, email, password }) {
  await new Promise((r) => setTimeout(r, 200));
  if (users.find((u) => u.email === email)) throw new Error('Email already registered');
  const user = { id: id++, firstName, lastName, email, password };
  users.push(user);
  return { id: user.id, firstName: user.firstName, email: user.email };
}

export async function login({ email, password }) {
  await new Promise((r) => setTimeout(r, 200));
  const u = users.find((x) => x.email === email && x.password === password);
  if (!u) throw new Error('Invalid credentials');
  return { id: u.id, firstName: u.firstName, email: u.email };
}

export function listUsers() { return [...users]; }
