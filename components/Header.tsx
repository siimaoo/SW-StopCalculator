import style from "../assets/styles/components/Header.module.scss";

const Header = () => {
  return (
    <div className={style.wrapper}>
      <nav>
        <div className={style.container}>
          <h1>Stops Calculator</h1>
        </div>
      </nav>
    </div>
  );
};

export default Header;
