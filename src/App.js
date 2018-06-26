import React, { Component } from "react";
import axios from "axios";
import $ from "jquery";

class App extends Component {
  state = {
    filteredPeople: [],
    people: [],
    search: "",
    isLoading: true
  };

  componentDidMount() {
    // get random user data
    axios.get("https://randomuser.me/api/?results=5000&nat=us").then((res) => {
      this.setState({
        people: res.data.results,
        filteredPeople: res.data.results,
        isLoading: false
      });

      // set up manual jQuery logic
      this.jQuerySetup(res.data.results);
    });
  }

  jQuerySetup = (results) => {
    // event listener
    var self = this;
    $("#test2 .input").on("keydown", function(evt) {
      // if alpha input, add char. Otherwise ignore
      const filteredVal = (evt.keyCode >= 65 && evt.keyCode <=90) ? $(this).val() + evt.key : $(this).val().slice(0, -1);
      self.jQueryChangeHandler(results, filteredVal);
    });

    // force render logic to happen at least once
    self.jQueryChangeHandler(results, '');
  };

  jQueryChangeHandler = (results, val) => {
    $("#test2 .people").empty();
      // filter down based on input value
      const filtered = results.filter(person => {
        return (`${person.name.first} ${person.name.last}`).indexOf(val) !== -1;
      });
      $(".peopleCountJq").text(filtered.length + ' found');
      // loop over and make <p> tag for each person object
      filtered.forEach(person => {
        const name = `${person.name.first} ${person.name.last}`;
        const img = $("<img>").attr("src", person.picture.thumbnail).attr("alt", person.name.first);
        const strong = $("<strong>").text(name);
        $("#test2 .people").append($("<p>").append(img).append($("<br>")).append(strong))
      });
  }

  changeSearch = (e) => {
    // update state when input changes
    const { people } = this.state;
    const filteredPeople = people.filter(person => ((person.name.first + " " + person.name.last).indexOf(e.target.value) !== -1));
    this.setState({
      search: e.target.value,
      filteredPeople
    });
  };

  filteredPeopleList = () => {
    const { filteredPeople } = this.state;
    return filteredPeople.map((person, index) => {
      const name = `${person.name.first} ${person.name.last}`;
      const thumbnail = person.picture.thumbnail;
      return (
      <p key={index}>
        <img src={thumbnail} alt={name} />
        <br/>
        <strong>{name}</strong>
      </p>
    )});
  }

  render() {
    // render two forms, one based on react state and one that's hard-coded for jQuery to populate
    return (
      <div>
        <div className={(this.state.isLoading) ? 'hidden': ''}>
        <form id="test1">
          <input
            className="input"
            type="text"
            value={this.state.search}
            onChange={this.changeSearch}
            placeholder="Filter with React"
          />
          <div className="peopleCountReact">{this.state.filteredPeople.length} found</div>
          <div className="people">
          {this.filteredPeopleList()}
          </div>
        </form>

        <form id="test2">
          <input
            type="text"
            className="input"
            placeholder="Filter with jQuery"
          />
          <div className="peopleCountJq">0 found</div>
          <div className="people"></div>
        </form>
        </div>
        <div className={(!this.state.isLoading) ? 'hidden': ''}>
          Loading 5000 people.  Please wait
        </div>
      </div>
    );
  }
}

export default App;
