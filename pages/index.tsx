import Head from "next/head";
import Header from "../components/Header";
import style from "./../assets/styles/Home.module.scss";
import fetchShips, { Ships } from './../services/getDataOfAllShips';
import { useState, useEffect } from "react";
import { AiOutlineCalculator } from "react-icons/ai";
import { ToastContainer, toast } from 'react-toastify';


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

  const calculateStops = () => {
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
      const data:Ships = await fetchShips(page);
      const arr = ships;
      arr.push(...data.results);
      setShips(arr);

      if (data.next != null) getDataOfAllShips(page += 1);
    } catch (e) {
      toast("Oops 😭 Something wen't wrong. Please try again later.", {type: 'error'});
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
        <div className={style.card}>
          <h4>Input the distance in mega lights (MGLT)</h4>

          <div>
            <input
              type="text"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
            />

            <AiOutlineCalculator
              className={style.icon}
              onClick={calculateStops}
            />
          </div>
        </div>

        <div className={style.card}>
          {wasCalculated ? (
            ships.map((ship, index) => {
              return (
                <div key={index} className={style.card_item}>
                  <h5>{ship.name}:</h5>
                  <p>{Math.floor(ship.stops)}</p>
                </div>
              );
            })
          ) : (
            <h3>Aguardando dados...</h3>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
