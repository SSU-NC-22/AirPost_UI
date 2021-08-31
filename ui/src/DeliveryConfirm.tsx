import { render } from "@testing-library/react";
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { DELIVERY_URL } from "./defineUrl";

/*
interface DeliveryProps {
    senderName:string;
    senderPn:string;
    recipientName:string;
    recipientPn:string;
    destinationTagId:number;
    destinationTagName:string
}
*/

interface invoiceNumber {
    invoiceNumber:string;
}

function DeliveryConfirm(props:any) {
    const [invoiceNumber, setinvoiceNumber] = useState("");

    useEffect(() => {
	    getDestinationTag(props.location.state.destinationTagId);
	});

	const getDestinationTag = (Id: number) => {
		var url =
			DELIVERY_URL + '?id=' + Id;
    
		const data = [];

		fetch(url)
			.then((res) => res.json()) 
			.then((data) => setinvoiceNumber(data.invoiceNumber)
			)
			.catch((error) => console.error('Error:', error));
	}

    const history = useHistory();

    const handleConfirm = () =>{
        history.push("/");
    }

    return(
        <>
		<div>
			<div style={{ textAlign:"center", marginTop:"100px"}}>
				<label style={{fontSize:"40px"}}>Delivery registration completed!</label>
                   <hr style={{width:"570px", borderColor:"black"}}></hr><br></br>
				<div style={{textAlign:"left", marginLeft:"325px", fontSize:"23px"}}>
                       <label style={{color:"gray"}}>Invoice Number</label>
                       <label style={{fontSize:"20px"}}>{invoiceNumber}</label><br></br>
                       <label style={{color:"gray", marginTop:"7px"}}>Destination Tag</label>
                       <label style={{marginLeft:"147px"}}>{props.location.state.destinationTagName}</label><br></br>
                       <label style={{color:"gray", marginTop:"7px"}}>Sender Name</label>
                       <label style={{marginLeft:"166px"}}>{props.location.state.senderName}</label><br></br>
                       <label style={{color:"gray", marginTop:"7px"}}>Sender Phone Number</label>
                       <label style={{marginLeft:"72px"}}>{props.location.state.senderPn}</label><br></br>
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