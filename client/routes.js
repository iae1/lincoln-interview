import React from "react"
import { Route, Switch } from "react-router-dom";
import Home from "./components/Home";
import Upload from "./components/Upload"
import Donations from "./components/Donations"

export default function Routes () {
    return (
        <Switch>
          <Route exact path="/" component={Home}/>
          <Route exact path="/donations" component={Donations}/>
          <Route path="/upload" component={Upload}/>
        </Switch>
    )
}