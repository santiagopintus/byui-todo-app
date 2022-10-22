const getEl = (sel, option) => {
  let el;
  option === "class"
    ? (el = document.querySelector(sel))
    : option === "classes"
    ? (el = document.querySelectorAll(sel))
    : option === "id"
    ? (el = document.getElementById(sel))
    : null;
  return el;
};

const create = tag => {
  return document.createElement(tag);
}

export default getEl;
export { create };