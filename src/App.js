import { createTheme, ThemeProvider } from "@mui/material";
import { useEffect, useState } from "react";

import "./App.css";

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import CloudIcon from "@mui/icons-material/Cloud";
import Button from "@mui/material/Button";

import axios from "axios";
import moment from "moment/moment";
import "moment/min/locales";
import { useTranslation } from "react-i18next";

moment.locale("ar");

const theme = createTheme({
  typography: {
    fontFamily: ["IBM"],
  },
});

let cancelAxios = null;
function App() {
  const { t, i18n } = useTranslation();
  const [temp, setTemp] = useState({
    number: null,
    min: null,
    max: null,
    description: "",
    icon: null,
  });
  const [timeAndDate, settimeAndDate] = useState("");
  const [local, setLocal] = useState("ar");

  function handleLangClick() {
    if (local === "ar") {
      setLocal("en");
      i18n.changeLanguage("en");
      moment.locale("en");
    } else {
      setLocal("ar");
      i18n.changeLanguage("ar");
      moment.locale("ar");
    }
    settimeAndDate(moment().format("LLLL"));
  }
  useEffect(() => {
    i18n.changeLanguage(local);
  }, []);
  useEffect(() => {
    settimeAndDate(moment().format("LLLL"));
    axios
      .get(
        "https://api.openweathermap.org/data/2.5/weather?q=Cairo,eg&appid=4dc273ac770da9fd9e31381e0d724fd0&units=metric&lang=en",
        {
          cancelToken: new axios.CancelToken((c) => {
            cancelAxios = c;
          }),
        }
      )
      .then(function (response) {
        const number = Math.round(response.data.main.temp);
        const min = Math.round(response.data.main.temp_min);
        const max = Math.round(response.data.main.temp_max);
        const description = response.data.weather[0].description;
        const icon = `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`;
        setTemp({ number, min, max, description, icon });
        console.log(response.data);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
    return () => {
      cancelAxios();
    };
  }, []);
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Container maxWidth="sm">
          <div
            style={{
              height: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <div
              className="card"
              style={{
                width: "100%",
                background: "rgb(28 52 91 / 36%)",
                color: "white",
                padding: "10px",
                borderRadius: "15px",
                boxShadow: "0px 11px 1px rgba(0,0,0,0.05)",
              }}
              dir={local === "ar" ? "rtl" : "ltr"}
            >
              <div
                className="titel"
                style={{
                  display: "flex",
                  justifyContent: "start",
                  alignItems: "end",
                }}
              dir={local === "ar" ? "rtl" : "ltr"}
              >
                <Typography
                  variant="h2"
                  style={{ marginRight: "20px", fontWeight: "600" }}
                >
                  {t("Cairo")}
                </Typography>
                <Typography variant="h5" style={{ marginRight: "20px" }}>
                  {timeAndDate}
                </Typography>
              </div>
              <hr />

              <div
                className="body"
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="h1" style={{ textAlign: "right" }}>
                      {temp.number}
                    </Typography>
                    <img src={temp.icon}></img>
                  </div>
                  <Typography variant="h6"> {t(temp.description)}</Typography>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <h5>
                      {t("min")} : {temp.min}
                    </h5>
                    <h5 style={{ margin: "0px 5px" }}>|</h5>
                    <h5>
                      {t("max")} : {temp.max}
                    </h5>
                  </div>
                </div>

                <CloudIcon style={{ fontSize: "200px", color: "white" }} />
              </div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "end",
                width: "100%",
                marginTop: "20px",
              }}
              dir={local === "ar" ? "rtl" : "ltr"}
            >
              <Button
                style={{ color: "white" }}
                variant="text"
                onClick={handleLangClick}
              >
                {local === "en" ? "Arabic" : "إنجليزي"}
              </Button>
            </div>
          </div>
        </Container>
      </ThemeProvider>
    </div>
  );
}

export default App;
