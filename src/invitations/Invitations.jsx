import React, { useState } from 'react';
import './Invitations.css';
import { useEffect } from 'react';

const fetchDealerName = () => new Promise((resolve) => {
    console.log("[fetchDealerName]");
    setTimeout(() => {resolve("John Wick")}, 1000);
});

const fetchCustomers = () => new Promise((resolve) => {
    console.log("[fetchCustomers]");
    setTimeout(() => {resolve([
        {
            name: "John Woo",
            status: "enroled",
            invitationDate: "05/05/2020"
        },
        {
            name: "John Doe",
            status: "pending",
            invitationDate: "06/03/2020"
        },
        {
            name: "John Wayne",
            status: "bounced",
            invitationDate: "01/04/2020"
        }
    ])}, 2000);
});

const Customers = () => {
    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        fetchCustomers().then(setCustomers);
    }, []);

    if(customers.length === 0) return null;

    return (
        <section className="Invitations">
                <table>
                    <thead>
                        <tr>
                            <td>Name</td>
                            <td>Invitation status</td>
                            <td>Invitation date</td>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        customers.map((customer) => (
                            <tr key={customer.name}>
                                <td>{customer.name}</td>
                                <td>{customer.status}</td>
                                <td>{customer.invitationDate}</td>
                            </tr>
                        ))
                    }
                    </tbody>
                </table>
            </section>
    )
}

const Invitations = () => {
    const [dealerName, setDealerName] = useState("");

    useEffect(() => {
        fetchDealerName().then(setDealerName);
    }, []);


    return (
        <main>
            <h1>Hello {dealerName} 👋</h1>
            <Customers />
        </main>
    );
};

export default Invitations;