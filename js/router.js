// js/router.js

export const navigateTo = (path) => {
  window.location.pathname = path;
};

export const redirectTo = (path) => {
  window.location.replace(path);
};
