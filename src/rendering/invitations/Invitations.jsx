import React, { useState, useEffect } from 'react';
import './Invitations.css';
import { fetchCustomers, fetchDealerPicture } from './api';

const Invitations = ({ dealer }) => {
    const [dealerPictureURL, setDealerPictureURL] = useState("");
    const [hoveredCustomer, setHoveredCustomer] = useState("");
    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        fetchDealerPicture(dealer.id).then(setDealerPictureURL);
        fetchCustomers(dealer.id).then(setCustomers);
    }, [dealer.id]);

    return (
        <main className="Invitations">
            <header className="media">
                <div className="media-left">
                    {
                        !!dealerPictureURL
                            ? <img className="media-object" src={dealerPictureURL} alt={`${dealer.name}'s profile`} />
                            : "Loading profile pic..."
                    }
                </div>
                <div>
                    <h1>Hello {dealer.name} 👋</h1>
                </div>
            </header>
            <section>
                <table>
                    <thead className="tableHeader">
                        <tr>
                            <td>Name</td>
                            <td>Invitation status</td>
                            <td>Invitation date</td>
                        </tr>
                    </thead>
                    {customers.length > 0 && <tbody onMouseOut={() => { setHoveredCustomer("") }}>
                        {
                            customers.map((customer) => (
                                <tr key={customer.name} className={
                                    hoveredCustomer === customer.name ? "hovered" : ""
                                }
                                    onMouseOver={() => {
                                        setHoveredCustomer(customer.name)
                                    }}>
                                    <td>{customer.name}</td>
                                    <td>{customer.status}</td>
                                    <td>{customer.invitationDate}</td>
                                </tr>
                            ))
                        }
                    </tbody>}
                </table>
            </section>
        </main>
    );
};

export default Invitations;