import React, { useState } from 'react';
import './Invitations.css';
import { useEffect } from 'react';

const fetchDealerPicture = () => new Promise((resolve) => {
    setTimeout(() => { resolve("https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/70/703dac9006a3ab09818ef44c841c047dfbfbe6bc_full.jpg") }, 1000);
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
    }, 2000);
});

const Invitations = ({ dealer }) => {
    const [dealerPictureURL, setDealerPictureURL] = useState("");
    const [hoveredCustomer, setHoveredCustomer] = useState("");

    useEffect(() => {
        fetchDealerPicture().then(setDealerPictureURL);
    }, []);

    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        fetchCustomers().then(setCustomers);
    }, []);

    return (
        <main className="Invitations">
            <header className="media">
                <div className="media-left">
                    <img className="media-object" src={dealerPictureURL} alt={`${dealer.name}'s profile`} />
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
                        <tbody onMouseOut={() => { setHoveredCustomer("") }}>
                            {
                                customers.map((customer) => (
                                    <tr key={customer.name} className={
                                        hoveredCustomer === customer.name ? "hovered" : ""
                                    }
                                        onMouseOver={() => {
                                            //console.log("[onMouseOver]", customer.name);
                                            setHoveredCustomer(customer.name)
                                        }}>
                                        <td>{customer.name}</td>
                                        <td>{customer.status}</td>
                                        <td>{customer.invitationDate}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </section>
        </main>
    );
};

export default Invitations;