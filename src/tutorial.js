import React, { Component } from 'react';

function Tutorial(props) {
  return (
    <div className="Tutorial">
    	<h3>Welcome to Math Comet!</h3>
    	<ol>
    		<li>Answer problems by typing in the blank white box.
    		Then press 'ENTER'</li>
    		<li>Change the type and difficulty of problems with the
    		buttons below. Changes will update as soon as you submit
    		an answer for the current problem.</li>
    		<li>If you're looking for a challenge, try changing the bases
    		in 'Advanced Options'!</li>
    	</ol>
    	<p><i className="material-icons" onClick={props.onClick}>cancel</i></p>
    </div>
  );
}

export {Tutorial};