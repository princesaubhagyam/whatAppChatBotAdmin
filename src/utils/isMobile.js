const isMobile = () => {
  console.log(window.innerWidth, '----');

  return window.innerWidth <= 600;
};

export default isMobile;
