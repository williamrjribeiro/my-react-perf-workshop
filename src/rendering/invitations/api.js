const fetchDealerPicture = () => new Promise((resolve) => {
    setTimeout(() => { resolve("https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/70/703dac9006a3ab09818ef44c841c047dfbfbe6bc_full.jpg") }, 2000);
});

const fetchCustomers = () => new Promise((resolve) => {
    setTimeout(() => {
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

export { fetchCustomers, fetchDealerPicture };