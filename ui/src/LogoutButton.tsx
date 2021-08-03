import React, { Component } from 'react';

class Searchbar extends Component{
    render(){
        return(
            <form className="form-inline my-2 my-lg-0">
				<button className="btn my-2 my-sm-0" type="submit" style={{ color : 'white'}}>LOGOUT</button>
			</form>
        );
    }
}

export default Searchbar