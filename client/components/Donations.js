import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Dropdown, Table, Card } from 'react-bootstrap'

export default function Donations () {
  const [seeOnlyKnownDonations, getOnlyKnownDonations] = useState(false)
  const [donationsList, setDonationsList] = useState([])
  const [totalDonations, setTotalDonations] = useState([])

  useEffect(async () => {
    try {
      if (seeOnlyKnownDonations) {
        const { data: donations } = await axios.get('/api/knownDonations')
        setDonationsList(donations)
        let donationsAmounts = []
        donations.forEach(({donation_amount}) => {
          donationsAmounts.push(parseFloat(donation_amount))
        })
        setTotalDonations(donationsAmounts.reduce((acc, cv) => acc+cv).toFixed(2))
      } else {
        const { data: donations } = await axios.get('/api/donations')
        setDonationsList(donations)
        let donationsAmounts = []
        donations.forEach(({donation_amount}) => {
          donationsAmounts.push(parseFloat(donation_amount))
        })
        setTotalDonations(donationsAmounts.reduce((acc, cv) => acc+cv))
      } 
    } catch (error) {
      console.log(error)
    }
  },[seeOnlyKnownDonations])
  
  
  return (
    <>
      <Dropdown>
        <Dropdown.Toggle variant="primary" id="dropdown-basic" >
          Filter Donations
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item onClick={()=>getOnlyKnownDonations(false)}>All donations</Dropdown.Item>
          <Dropdown.Item onClick={()=>getOnlyKnownDonations(true)}>Non-anonymous donations</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <Card style={{ width: '18rem' }}>
        <Card.Body>
          <Card.Title>Total Donations</Card.Title>
          <Card.Text>
            We have currently raised ${totalDonations ? totalDonations : 0}!
          </Card.Text>
        </Card.Body>
      </Card>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Donor Id</th>
            <th>Name</th>
            <th>Email</th>
            <th>Gender</th>
            <th>Address</th>
            <th>Donation Amount</th>
          </tr>
        </thead>
        <tbody>
          {
            donationsList.map((donation) => (
              <tr key={donation.id}>
                <th>{donation.donor_id}</th>
                <th>{donation.donor_name}</th>
                <th>{donation.donor_email}</th>
                <th>{donation.donor_gender}</th>
                <th>{donation.donor_address}</th>
                <th>${donation.donation_amount}</th>
              </tr>
            ))
          }
        </tbody>
      </Table>
    </>
  )
}