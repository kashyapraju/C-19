import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Typography,
} from "@material-ui/core";
import { blue, blueGrey, green, red } from "@material-ui/core/colors";
import {
  GetGlobalSummary,
  GetRegionalSummary,
} from "../apiCalls/covid19trackerApi";
import { renderDisplayCard } from "./commonComponent";
import CountUp from "react-countup";
import indianFlag from "./indianFlag.png";
import Chart from "chart.js";

export default function BodyComponent() {
  const [fetched, setfetcheds] = useState(false);
  const [graphFeched, setGraphFeched] = useState(false);
  const [globalCases, setGlobalcases] = useState({});
  const [totalCases, setTotalCases] = useState({});
  const [indianCase, setIndianCase] = useState([]);

  useEffect(
    () =>
      !fetched &&
      GetGlobalSummary().then(({ data: { Global } }) => {
        setGlobalcases({
          "New Cases": Global.NewConfirmed,
          "Total Cases": Global.TotalConfirmed,
          "New Recovery": Global.NewRecovered,
          "Total Recovery": Global.TotalRecovered,
          "New Deaths": Global.NewDeaths,
          "Total Deaths": Global.TotalDeaths,
        });
        setfetcheds(true);
      })
  );

  //useeffect for graph
  useEffect(() => {
    !graphFeched &&
      GetRegionalSummary().then(({ data: { cases_time_series } }) => {
        const data = {};

        cases_time_series.forEach((item, i) => {
          const DATE = new Date(item.date);
          const currentMonth = DATE.getMonth();
          const currentYear = DATE.getFullYear();

          if (!data[currentYear]) {
            data[currentYear] = {};
          }
          if (!data[currentYear][currentMonth]) {
            data[currentYear][currentMonth] = +item.dailyconfirmed;
          } else {
            data[currentYear][currentMonth] += +item.dailyconfirmed;
          }
        });
        setTotalCases(data);
        const IndianCase = Object.keys(data["2021"]).map((item, i) => {
          return data["2021"][item];
        });
        setIndianCase(IndianCase);
        setGraphFeched(true);
      });
    renderGraph({
      labels: [
        "jan",
        "feb",
        "mar",
        "apr",
        "may",
        "jun",
        "jul",
        "aug",
        "sep",
        "oct",
        "nov",
        "dec",
      ],
      title: "Covid cases",
      data: indianCase,
      bgColor: blue[200],
      borderColor: blue[800],
    });
  });

  return (
    <Box mt={2} mr={2} ml={2}>
      <Grid container spacing={1}>
        <Grid item xs={12} sm={12}>
          <Typography
            variant='h6'
            gutterBottom={true}
            style={{ color: blue[700] }}>
            Global Status
          </Typography>
        </Grid>
        {!Object.entries(globalCases).length ? (
          <Box
            style={{
              height: "200px",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}>
            <Typography variant='body1' color='textSecondary' align='center'>
              Loading Global state ...
            </Typography>
            <br />
            <CircularProgress color='secondary' />
          </Box>
        ) : (
          Object.entries(globalCases).map((item, i) =>
            renderDisplayCard({
              key: item[0],
              value: <CountUp start={0} end={item[1]} duration={2} />,
              index: i,
              Color:
                item[0] === "New Cases"
                  ? blue[500]
                  : item[0] === "Total Cases"
                  ? blue[500]
                  : item[0] === "New Recovery"
                  ? green[500]
                  : item[0] === "Total Recovery"
                  ? green[500]
                  : red[500],
            })
          )
        )}
      </Grid>
      {/* graph grid / */}
      <Box mt={4}>
        <Grid container>
          <Grid item xs={12} sm={12}>
            <Typography
              variant='h6'
              gutterBottom={true}
              style={{ color: blue[700] }}>
              Regional Status
            </Typography>
          </Grid>
          {/* //graph card  */}
          <Grid item xs={12} sm={12}>
            <Card>
              <Box p={(1, 1)} style={{ display: "flex" }}>
                <img
                  src={indianFlag}
                  alt={"Indian flag"}
                  style={{ width: "40px", height: "auto" }}
                />
                <Typography
                  variant='body1'
                  component='h6'
                  style={{
                    color: blueGrey[700],
                    lineHeight: "50px",
                  }}>
                  India
                </Typography>
              </Box>
              <CardContent>
                <canvas id='myChart' width='100%' height='400'></canvas>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export const renderGraph = ({ labels, title, data, bgColor, borderColor }) => {
  let ctx = document.getElementById("myChart").getContext("2d");
  let myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: title,
          data: data,
          backgroundColor: bgColor,
          borderColor: borderColor,
          borderWidth: 3,
        },
      ],
    },
    options: {
      scales: {
        yAxes: [
          {
            gridLines: {
              color: "rgba(0, 0, 0, 0)",
            },
            ticks: {
              beginAtZero: true,
              callback: function (label, index, dataOfLabels) {
                return label / 1000000 + "m";
              },
            },
          },
        ],
        xAxes: [
          {
            gridLines: {
              color: "rgba(0, 0, 0, 0)",
            },
          },
        ],
      },
      responsive: true,
      maintainAspectRatio: false,
    },
  });
  return myChart;
};
