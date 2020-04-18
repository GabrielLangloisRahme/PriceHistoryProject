import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Chart from "react-apexcharts";
import axios from "axios";

function compare(a, b) {
  if (a.createdAt < b.createdAt) {
    return -1;
  }
  if (a.createdAt > b.createdAt) {
    return 1;
  }
  return 0;
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { netWorthArray: [] };
  }

  netWorthFunction = (historyArray) => {
    let time = [];
    let netWorth = [];
    let BTC_CAD = 9991.98;
    let ETH_CAD = 243.58;

    historyArray.sort(compare);

    for (let index in historyArray) {
      if (historyArray[index].direction == "credit") {
        if (historyArray[index].currency == "CAD") {
          time[index] = historyArray[index].createdAt;
          if (index == 0) {
            netWorth[index] = historyArray[index].amount;
          } else {
            let oldValue = historyArray[index - 1].amount;
            let newValue = historyArray[index].amount;
            netWorth[index] = oldValue + newValue;
          }
        }

        if (historyArray[index].currency == "BTC") {
          time[index] = historyArray[index].createdAt;
          if (index == 0) {
            netWorth[index] = historyArray[index].amount * BTC_CAD;
          } else {
            let oldValue = historyArray[index - 1].amount;
            let newValue = historyArray[index].amount * BTC_CAD;
            netWorth[index] = oldValue + newValue;
          }
        }

        if (historyArray[index].currency == "ETH") {
          time[index] = historyArray[index].createdAt;
          if (index == 0) {
            netWorth[index] = historyArray[index].amount * ETH_CAD;
          } else {
            let oldValue = historyArray[index - 1].amount;
            let newValue = historyArray[index].amount * ETH_CAD;
            netWorth[index] = oldValue + newValue;
          }
        }
      }

      if (historyArray[index].direction == "debit") {
        if (historyArray[index].currency == "CAD") {
          time[index] = historyArray[index].createdAt;
          if (index == 0) {
            netWorth[index] = -historyArray[index].amount;
          } else {
            let oldValue = historyArray[index - 1].amount;
            let newValue = historyArray[index].amount;
            netWorth[index] = oldValue - newValue;
          }
        }

        if (historyArray[index].currency == "BTC") {
          time[index] = historyArray[index].createdAt;
          if (index == 0) {
            netWorth[index] = -historyArray[index].amount * BTC_CAD;
          } else {
            let oldValue = historyArray[index - 1].amount;
            let newValue = historyArray[index].amount * BTC_CAD;
            netWorth[index] = oldValue - newValue;
          }
        }

        if (historyArray[index].currency == "ETH") {
          time[index] = historyArray[index].createdAt;
          if (index == 0) {
            netWorth[index] = -historyArray[index].amount * ETH_CAD;
          } else {
            let oldValue = historyArray[index - 1].amount;
            let newValue = historyArray[index].amount * ETH_CAD;
            netWorth[index] = oldValue - newValue;
          }
        }
      }
    }

    var filteredTime = time.filter(function (el) {
      return el != null;
    });

    var filteredNetWorth = netWorth.filter(function (el) {
      return el != null;
    });

    return [filteredTime, filteredNetWorth];
  };

  async componentDidMount() {
    let historyArray = await axios.get(
      "https://shakepay.github.io/programming-exercise/web/transaction_history.json"
    );
    let netWorthArray = await this.netWorthFunction(historyArray.data);

    this.setState({ netWorthArray });
  }

  render() {
    // if (this.state.netWorthArray) {
    let [xAxis, yAxis] = this.state.netWorthArray;
    console.log("this is x", xAxis);
    console.log("this is y", yAxis);
    let series = [
      {
        name: "Net Earnings",
        data: yAxis,
      },
    ];
    let options = {
      chart: {
        id: "Net Earnings",
      },
      xaxis: {
        categories: xAxis,
      },
    };
    return (
      <div>
        <h1>Net Earnings (CAD) Over Time</h1>
        <Chart options={options} series={series} type="line" width="1000" />
      </div>
    );
    // } else {
    //   return <div></div>;
    // }
  }
}

export default App;
