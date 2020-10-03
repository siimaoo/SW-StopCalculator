import Head from "next/head";
import Header from "../components/Header";
import style from "../assets/styles/Home.module.scss";
import fetchShips, { Ships } from "../services/getDataOfAllShips";
import { useState, useEffect } from "react";
import { IoIosArrowRoundForward } from "react-icons/io";
import { ToastContainer, toast } from "react-toastify";
import yoda from '../public/static/images/yoda.png';

const Home = () => {
  const [distance, setDistance] = useState("");
  const [ships, setShips] = useState([]);
  const [wasCalculated, setWasCalculated] = useState(false);

  const TIMES = {
    day: 24,
    days: 24,
    week: 168,
    weeks: 168,
    month: 730,
    months: 730,
    year: 8760,
    years: 8760,
  };

  const calculateStops = e => {
    e.preventDefault();
    const arr = [];

    ships.map((ship) => {
      if (ship.consumables != "unknown" && ship.MGLT != "unknown") {
        const consumableSplited = ship.consumables.split(" ");
        const consumablesInHours =
          consumableSplited[0] * TIMES[consumableSplited[1]];
        const stops = +distance / ship.MGLT / consumablesInHours;
        return arr.push({ ...ship, ...{ stops } });
      }
    });

    setShips(arr);
    setWasCalculated(true);
  };

  useEffect(() => {
    getDataOfAllShips(1);
  }, []);

  const getDataOfAllShips = async (page: number) => {
    try {
      const { data } = await fetchShips(page);
      const arr = ships;
      arr.push(...data.results);
      setShips(arr);
      if (data.next != null) getDataOfAllShips(page += 1);
    } catch (err) {
      toast("Oops 😭 Something wen't wrong. Please try again later.", {
        type: "error",
      });
    }
  };

  return (
    <>
      <Head>
        <title>Stops Calculator</title>
      </Head>

      <Header />

      <ToastContainer position="bottom-right" />

      <div className={style.container}>
        <div className={style.col}>
          <h1>Welcome to Stops Calculator</h1>

          <p>
            Input the distance in mega lights (MGTL) and we'll calculate how
            many stops you need to complete your journey.
          </p>

          <img src={yoda} alt="Baby yoda"/>
        </div>

        <div className={`${style.col} ${style.center}`}>
          <div className={style.card}>
            <form onSubmit={calculateStops}>
              <input
                type="text"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
              />

              <IoIosArrowRoundForward
                className={style.icon}
                onClick={calculateStops}
              />
            </form>
          </div>

          <div className={`${style.card} ${style.scroll}`}>
            {wasCalculated ? (
              ships.map((ship, index) => {
                return (
                  <div key={index} className={style.card_item}>
                    <h4>{ship.name}:</h4>
                    <p>{Math.floor(ship.stops)}</p>
                  </div>
                );
              })
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
