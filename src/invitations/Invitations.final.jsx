import React, { useState } from 'react';
import './Invitations.css';
import { useEffect } from 'react';

const fetchDealerPicture = () => new Promise((resolve) => {
    setTimeout(() => { resolve("https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/70/703dac9006a3ab09818ef44c841c047dfbfbe6bc_full.jpg") }, 2000);
});

const fetchCustomers = () => new Promise((resolve) => {
    setTimeout(() => {
        // Array.from([1,2,3]): Create an array from an array. Just copies.
        // Array.from([1,2,3], i => i * 2): Creates an array and runs the callback in every item. Doubles every item from original array
        // Array.from(Array(50), i => i * 2): Array(50) creates array with 50 empty entries. NaN, NaN...
        // Array.from(Array(50).keys(), i => i * 2): Array.keys() returns the index! Now it works
        resolve(
            Array.from(Array(500).keys(), (idx) => {
                return {
                    name: `Customer ${idx}`,
                    status: "Pending",
                    invitationDate: new Date(1489328000000 + (idx * 10000000)).toDateString()
                };
            })
        )
    }, 1000);
});

const DealerHeader = ({ dealer }) => {
    const [dealerPictureURL, setDealerPictureURL] = useState("");
    useEffect(() => {
        fetchDealerPicture(dealer.id).then(setDealerPictureURL);
    }, []);

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

const CustomersTable = ({ dealerId }) => {
    const [hoveredCustomer, setHoveredCustomer] = useState("");
    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        fetchCustomers(dealerId).then(setCustomers);
    }, []);

    const rows = customers.length === 0
        ? <tr><td>Loading customers...</td></tr>
        : customers.map((customer) => <HoverRow key={customer.name} customer={customer} />);

    return (
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
    )
};

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
    return (
        <main className="Invitations">
            <DealerHeader dealer={dealer} />
            <section>
                <CustomersTable dealerId={dealer.id} />
            </section>
        </main>
    );
};

export default Invitations;