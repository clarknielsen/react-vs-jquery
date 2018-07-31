import React, { Component } from "react";
import axios from "axios";
import $ from "jquery";

class App extends Component {
  state = {
    people: [],
    search: ""
  };

  componentDidMount() {
    // allow overriding number of results based on query string
    let results = window.location.search.replace("?limit=", "") || 5000;

    // get random user data
    axios.get(`https://randomuser.me/api/?results=${results}&nat=us`).then((res) => {
      this.setState({
        people: res.data.results
      });

      // set up manual jQuery logic
      this.jQuerySetup(res.data.results);
    });
  }

  jQuerySetup = (results) => {
    // event listener
    $("#test2 .input").on("keydown", function() {
      // clear current results
      $("#test2 .people").empty();

      // filter down based on input value
      let filtered = results.filter((p) => {
        return (p.name.first + " " + p.name.last).indexOf($(this).val()) !== -1;
      });

      // loop over and make <p> tag for each person object
      for (let i = 0; i < filtered.length; i++) {
        let name = `${filtered[i].name.first} ${filtered[i].name.last}`;

        let img = $("<img>").attr("src", filtered[i].picture.thumbnail).attr("alt", name);
        let strong = $("<strong>").text(name);
        
        $("#test2 .people").append($("<p>").append(img).append(strong));
      }
    });

    // force render logic to happen at least once
    $("#test2 .input").trigger("keydown");
  };

  changeSearch = (e) => {
    // update state when input changes
    this.setState({
      search: e.target.value
    });
  };

  cancelSubmit = (e) => {
    // don't accidentally reload page
    e.preventDefault();
  };

  render() {
    // render two forms, one based on react state and one that's hard-coded for jQuery to populate
    return (
      <div>
        <form id="test1" onSubmit={this.cancelSubmit}>
          <input 
            className="input" 
            type="text" 
            value={this.state.search} 
            onChange={this.changeSearch} 
            placeholder="Filter with React"
          />

          <div className="people">
            {
              this.state.people.filter((p) => {
                // filter down based on search state
                return (p.name.first + " " + p.name.last).indexOf(this.state.search) !== -1;
              }).map((p) => {
                let name = `${p.name.first} ${p.name.last}`;

                // convert into jsx
                return (
                  <p key={p.id.value}>
                    <img src={p.picture.thumbnail} alt={name} />
                    <strong>{name}</strong>
                  </p>
                );
              })
            }
          </div>
        </form>

        <form id="test2" onSubmit={this.cancelSubmit}>
          <input 
            type="text" 
            className="input" 
            placeholder="Filter with jQuery"
          />

          <div className="people"></div>
        </form>
      </div>
    );
  }
}

export default App;
