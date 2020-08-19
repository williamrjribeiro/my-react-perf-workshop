import React, { useState, useEffect } from 'react';
import './Invitations.css';
import { fetchCustomers, fetchDealerPicture } from './api';

const HoverRow = ({ customer }) => {
    const [isHovered, setIsHovered] = useState(false);
    return (
        <tr key={customer.name} className={isHovered ? "hovered" : ""}
            onMouseOver={() => {
                setIsHovered(true);
            }}
            onMouseOut={() => {
                setIsHovered(false);
            }}>
            <td>{customer.name}</td>
            <td>{customer.status}</td>
            <td>{customer.invitationDate}</td>
        </tr>
    );
};

const Invitations = ({ dealer }) => {
    const [dealerPictureURL, setDealerPictureURL] = useState("");
    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        fetchDealerPicture(dealer.id).then(setDealerPictureURL);
        fetchCustomers(dealer.id).then(setCustomers);
    }, [dealer.id]);

    const rows = customers.length === 0
        ? <tr><td>Loading customers...</td></tr>
        : customers.map((customer) => <HoverRow key={customer.name} customer={customer} />);

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
                    <tbody>
                        {rows}
                    </tbody>
                </table>
            </section>
        </main>
    );
};

export default Invitations;