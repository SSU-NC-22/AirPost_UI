import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { DELIVERY_URL } from "../defineUrl";

function DeliveryConfirm(props:any) {
    const history = useHistory();

    const handleConfirm = () =>{
        history.push("/");
    }

    const [drone_id, set_drone_id] = useState(0);

    useEffect(() => {
        var url = DELIVERY_URL + '/' + props.location.state.invoiceNumber;

		fetch(url)
			.then((res) => res.json())
			.then((data) => set_drone_id(data.drone_id))
			.catch((error) => console.error('Error:', error));
      });

    return(
        <>
		<div>
			<div style={{ textAlign:"center", marginTop:"70px"}}>
				<label style={{fontSize:"40px"}}>Delivery registration completed!</label>
                   <hr style={{width:"570px", borderColor:"black"}}></hr><br></br>
				<div style={{textAlign:"left", marginLeft:"325px", fontSize:"23px"}}>
                       <label style={{color:"gray"}}>Invoice Number</label>
                       <label style={{marginLeft: "142px"}}>{props.location.state.invoiceNumber}</label><br></br>
                       <label style={{color:"gray", marginTop:"7px"}}>Selected Drone Id</label>
                       <label style={{marginLeft:"122px"}}>{drone_id}</label><br></br>
                       <label style={{color:"gray", marginTop:"7px"}}>Source Station</label>
                       <label style={{marginLeft:"157px"}}>{props.location.state.sourceList}</label><br></br>
                       <label style={{color:"gray", marginTop:"7px"}}>Destination Tag</label>
                       <label style={{marginLeft:"147px"}}>{props.location.state.destList}</label><br></br>
                       <label style={{color:"gray", marginTop:"7px"}}>Sender Name</label>
                       <label style={{marginLeft:"166px"}}>{props.location.state.senderName}</label><br></br>
                       <label style={{color:"gray", marginTop:"7px"}}>Sender Phone Number</label>
                       <label style={{marginLeft:"72px"}}>{props.location.state.senderPn}</label><br></br>
                       <label style={{color:"gray", marginTop:"7px"}}>Sender Email</label>
                       <label style={{marginLeft:"172px"}}>{props.location.state.senderEmail}</label><br></br>
                       <label style={{color:"gray", marginTop:"7px"}}>Recipient Name</label>
                       <label style={{marginLeft:"144px"}}>{props.location.state.recipientName}</label><br></br>
                       <label style={{color:"gray", marginTop:"7px"}}>Recipient Phone Number</label>
                       <label style={{marginLeft:"49px"}}>{props.location.state.recipientPn}</label>
                   </div>
			</div>
			<div style={{ textAlign:"center", marginTop:"50px"}}>
				<button
					type="button"
					className="btn" 
					data-toggle="modal"
					style={{ background: 'lightgray', color : 'white', fontSize:"23px" }}
                    onClick={handleConfirm}
				>
				Confirm
				</button>
				</div>
		</div>
		</>
    );
}

export default DeliveryConfirm