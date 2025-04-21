import { useState, useEffect } from 'react';
import { Organization } from '../../shared/models/Organization';

function App() {
  const [organizations, setOrganizations] = useState<Organization[] | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('http://localhost:3500/organizations');
        if (response.ok) {
          const data = await response.json();
          setOrganizations(data.map(Organization.fromJson));
        } else {
          console.error('Failed to fetch data');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  return (
    <div>
      <h2>Organizations</h2>
      {organizations ? (
        <ul>
          {organizations.map((org) => (
            <li key={org.organization_id}>
              <strong>{org.name}</strong>
              <ul>
                {org.accounts.map((account) => (
                  <li key={account.account_id}>
                    {account.name}
                    <ul>
                      {account.deals.map((deal) => (
                        <li key={deal.deal_id}>
                          {deal.name} – ${deal.value} ({deal.status})
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default App;
