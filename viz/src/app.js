import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import ExperimentPage from "./experiments/Experiment";
import ExperimentBuilder from "./experiments/ExperimentBuilder";

export default function App() {
  const [experiments, setExperiments] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/results/all", {
      method: "get",
    })
      .then((res) => res.json())
      .then((resultResponse) => {
        setExperiments([
          ExperimentBuilder.first(
            resultResponse.filter((r) =>
              r.description.experiment_ids.includes(1)
            )
          ),
          ExperimentBuilder.second(
            resultResponse.filter((r) =>
              r.description.experiment_ids.includes(2)
            )
          ),
          ExperimentBuilder.third(
            resultResponse.filter((r) =>
              r.description.experiment_ids.includes(3)
            )
          ),
        ]);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="App">
      <div className="AppHeader">
        <h1>Libp2p Pubsub viz. Med Mouine</h1>
        <h2>
          Data is based on the output of libp2p-pubsub-tracer (tracestats).
        </h2>
        <h2>The full event trace can be found in /data/trace</h2>
      </div>
      <Router>
        <div>
          <ul>
            <li>
              <Link to="/exp1">Experiment 1 (#publishers)</Link>
            </li>
            <li>
              <Link to="/exp2">Experiment 2 (Connection manager)</Link>
            </li>
            <li>
              <Link to="/exp3">Experiment 3 (Pubsub Protocol)</Link>
            </li>
          </ul>
          <hr />
          <Switch>
            {experiments.map((exp, i) => (
              <Route exact path={"/exp" + (i + 1)}>
                <ExperimentPage isLoading={isLoading} experiment={exp} />
              </Route>
            ))}
          </Switch>
        </div>
      </Router>
    </div>
  );
}

// TODO: Trace analysis
// componentDidMount(){

//   fetch('http://localhost:5000/api/all', {
//     method: 'get'
//   }).then(data => {
//     return ndjsonStream(data.body);
//   }).then((dataStream) => {
//     const streamReader = dataStream.getReader();
//     const read = result => {
//       if (result.done) return;
//
//       this.setState({
//         todos: this.state.todos.concat([result])
//       });
//
//       streamReader.read().then(read);
//     };
//
//     streamReader.read().then(read);
//   }).catch(err => {
//     console.error(err)
//   });
// }
