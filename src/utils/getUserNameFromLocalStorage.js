export function getUserFromLocalStorage() {
  return localStorage.getItem("name") + "#" + localStorage.getItem("rand");
}

export function getNameFromLocalStorage() {
  return localStorage.getItem("name");
}
