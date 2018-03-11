import React from "react";
import { Redirect } from "react-router-dom";

const authorize = RenderedComponent => {
  return class extends React.Component {

    render() {
      if ( localStorage.getItem("jwt") && this.props.routerProps.location.pathname === "/home" ) {
        return <Redirect to="/party" />;
      } else if ( !localStorage.getItem("jwt") && this.props.routerProps.location.pathname !== "/home") {
        return <Redirect to="/home" />;
      } else {
        return <RenderedComponent />;
      }
    }
  };
};

export default authorize;
