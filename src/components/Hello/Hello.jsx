import axios from "axios";
import React from "react";

const myAxios = axios.create({ withCredentials: true });

const Hello = () => {

  const onClick = () => {
    myAxios.get("http://localhost:8085/admin-login")
      .then(res => {
        console.log("<<<<<<<<<<<<<<<<<<<", res);
      })
      .catch(err => {
        console.error("we're getting an axios error", err);
      });
  };

  return (
    <div>
      This page is under construction. Click <span><a href="https://www.triton.lmig.com">here</a></span> to return to Triton
      <button onClick={onClick}>Button</button>
    </div>
  );
};

export default Hello;
