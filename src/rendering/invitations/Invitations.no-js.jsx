import React, { useState, useEffect } from 'react';
import './Invitations.css';
import { fetchCustomers, fetchDealerPicture } from './api';

const DealerHeader = ({ dealer }) => {
    const [dealerPictureURL, setDealerPictureURL] = useState("");
    useEffect(() => {
        fetchDealerPicture(dealer.id).then(setDealerPictureURL);
    }, [dealer.id]);

    return (
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
    )
};

const CustomersTable = React.memo(({ dealerId }) => {
    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        fetchCustomers(dealerId).then(setCustomers);
    }, [dealerId]);

    const rows = customers.length === 0
        ? <tr><td>Loading customers...</td></tr>
        : customers.map((customer) => <HoverRow key={customer.name} customer={customer} />);

    return (
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
    )
});

const HoverRow = ({ customer }) => {
    return (
        <tr key={customer.name} className="hoverable">
            <td>{customer.name}</td>
            <td>{customer.status}</td>
            <td>{customer.invitationDate}</td>
        </tr>
    );
};

const Invitations = ({ dealer }) => {
    return (
        <main className="Invitations">
            <DealerHeader dealer={dealer} />
            <CustomersTable dealerId={dealer.id} />
        </main>
    );
};

export default Invitations;