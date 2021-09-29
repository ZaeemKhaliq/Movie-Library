export default function getToken() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user) {
    const token = user.token;
    return token;
  } else {
    return;
  }
}
